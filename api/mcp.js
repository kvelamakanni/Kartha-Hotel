import { supabase } from '../lib/supabaseClient.js';
import { HOTELS, findHotel, nightsBetween } from '../lib/hotels.js';
import { toUcpSession } from '../lib/sessions.js';

const TOOLS = [
  {
    name: 'search_hotels',
    description: 'List Kartha Hotels properties, optionally filtered by city or region text match.',
    inputSchema: {
      type: 'object',
      properties: { query: { type: 'string', description: 'Free-text city/region filter, e.g. "Rajasthan"' } },
    },
  },
  {
    name: 'create_checkout_session',
    description: 'Start a booking for a specific hotel and date range. Returns a session id used by the other tools.',
    inputSchema: {
      type: 'object',
      properties: {
        hotel: { type: 'string', description: 'Hotel name or id from search_hotels' },
        check_in: { type: 'string', description: 'YYYY-MM-DD' },
        check_out: { type: 'string', description: 'YYYY-MM-DD' },
        guests: { type: 'integer' },
      },
      required: ['hotel', 'check_in', 'check_out'],
    },
  },
  {
    name: 'submit_buyer_info',
    description: 'Attach guest name and email to a checkout session, moving it to ready_for_complete.',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
      },
      required: ['session_id', 'name', 'email'],
    },
  },
  {
    name: 'complete_checkout_session',
    description: 'Finalize a ready_for_complete session into a real, logged booking.',
    inputSchema: {
      type: 'object',
      properties: { session_id: { type: 'string' } },
      required: ['session_id'],
    },
  },
  {
    name: 'get_checkout_session',
    description: 'Read back the current state of a checkout session.',
    inputSchema: {
      type: 'object',
      properties: { session_id: { type: 'string' } },
      required: ['session_id'],
    },
  },
];

async function callTool(name, args) {
  switch (name) {
    case 'search_hotels': {
      const q = (args?.query || '').toLowerCase();
      const results = q
        ? HOTELS.filter((h) => h.city.toLowerCase().includes(q) || h.brand.toLowerCase().includes(q))
        : HOTELS;
      return results;
    }

    case 'create_checkout_session': {
      const listing = findHotel(args.hotel);
      if (!listing) throw new Error(`No hotel matching "${args.hotel}"`);
      const nights = nightsBetween(args.check_in, args.check_out);
      const amount = listing.price * nights;

      const { data, error } = await supabase
        .from('checkout_sessions')
        .insert([{
          status: 'incomplete',
          hotel_name: listing.brand,
          check_in: args.check_in,
          check_out: args.check_out,
          guests: args.guests || 1,
          nights,
          unit_price: listing.price,
          amount,
        }])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return toUcpSession(data);
    }

    case 'submit_buyer_info': {
      const { data: existing, error: fetchErr } = await supabase
        .from('checkout_sessions')
        .select('*')
        .eq('id', args.session_id)
        .single();
      if (fetchErr || !existing) throw new Error('Session not found');
      if (existing.status === 'completed' || existing.status === 'cancelled') {
        throw new Error(`Session already ${existing.status}`);
      }
      const { data, error } = await supabase
        .from('checkout_sessions')
        .update({
          guest_name: args.name,
          email: args.email,
          status: 'ready_for_complete',
          updated_at: new Date().toISOString(),
        })
        .eq('id', args.session_id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return toUcpSession(data);
    }

    case 'complete_checkout_session': {
      const { data: session, error: fetchErr } = await supabase
        .from('checkout_sessions')
        .select('*')
        .eq('id', args.session_id)
        .single();
      if (fetchErr || !session) throw new Error('Session not found');
      if (session.status !== 'ready_for_complete') {
        throw new Error(`Session must be ready_for_complete (currently ${session.status})`);
      }

      const { data: booking, error: bookingErr } = await supabase
        .from('bookings')
        .insert([{
          guest_name: session.guest_name,
          email: session.email,
          hotel_name: session.hotel_name,
          check_in: session.check_in,
          check_out: session.check_out,
          guests: session.guests,
          amount: session.amount,
        }])
        .select()
        .single();
      if (bookingErr) throw new Error(bookingErr.message);

      const { data: updated, error: updateErr } = await supabase
        .from('checkout_sessions')
        .update({ status: 'completed', booking_id: booking.id, updated_at: new Date().toISOString() })
        .eq('id', args.session_id)
        .select()
        .single();
      if (updateErr) throw new Error(updateErr.message);

      return { ...toUcpSession(updated), booking_id: booking.id };
    }

    case 'get_checkout_session': {
      const { data, error } = await supabase
        .from('checkout_sessions')
        .select('*')
        .eq('id', args.session_id)
        .single();
      if (error || !data) throw new Error('Session not found');
      return toUcpSession(data);
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. MCP uses JSON-RPC 2.0 over POST.' });
  }

  const { jsonrpc, id, method, params } = req.body || {};

  try {
    let result;
    switch (method) {
      case 'initialize':
        result = {
          protocolVersion: '2026-01-01',
          serverInfo: { name: 'kartha-hotels-mcp', version: '1.0.0' },
          capabilities: { tools: {} },
        };
        break;

      case 'tools/list':
        result = { tools: TOOLS };
        break;

      case 'tools/call': {
        const { name, arguments: args } = params || {};
        const output = await callTool(name, args || {});
        result = { content: [{ type: 'text', text: JSON.stringify(output) }] };
        break;
      }

      default:
        return res.status(200).json({
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Method not found: ${method}` },
        });
    }

    return res.status(200).json({ jsonrpc: '2.0', id, result });
  } catch (err) {
    console.error('MCP call failed:', err);
    return res.status(200).json({
      jsonrpc: '2.0',
      id,
      error: { code: -32000, message: err.message || 'Tool call failed' },
    });
  }
}
