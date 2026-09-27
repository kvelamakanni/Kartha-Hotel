import { supabase } from '../lib/supabaseClient.js';
import { findHotel, findRoom, searchHotels, nightsBetween } from '../lib/hotels.js';
import { toUcpSession, generateBookingRef } from '../lib/sessions.js';
import { applyDiscount } from '../lib/discounts.js';
import { validatePaymentToken } from '../lib/payments.js';

const TOOLS = [
  {
    name: 'search_hotels',
    description: 'Search for available hotels by destination, dates and guest count. If the user does not provide the check-in date, check-out date, or number of guests in their request, DO NOT invent or assume values. You MUST ask the user for these details first before calling this tool.',
    inputSchema: {
      type: 'object',
      properties: {
        destination: { type: 'string', description: "City, country, or region to search (e.g. 'Paris', 'US', 'Maldives')" },
        check_in: { type: 'string', description: 'Check-in date in YYYY-MM-DD format. Do not guess this value, ask the user if not provided.' },
        check_out: { type: 'string', description: 'Check-out date in YYYY-MM-DD format. Do not guess this value, ask the user if not provided.' },
        guests: { type: 'integer', description: 'Number of guests. Do not guess this value, ask the user if not provided.' },
      },
      required: ['destination', 'check_in', 'check_out', 'guests'],
    },
  },
  {
    name: 'get_hotel_details',
    description: 'Get full details for a specific hotel, including room types, amenities, and pricing.',
    inputSchema: {
      type: 'object',
      properties: { hotel_id: { type: 'string', description: 'The hotel ID from search results' } },
      required: ['hotel_id'],
    },
  },
  {
    name: 'create_booking_session',
    description: 'Create a booking session for a hotel room. Returns a UCP-compliant checkout session with pricing and payment options.',
    inputSchema: {
      type: 'object',
      properties: {
        hotel_id: { type: 'string', description: 'Hotel ID' },
        room_id: { type: 'string', description: 'Room type ID to book' },
        check_in: { type: 'string', description: 'Check-in date YYYY-MM-DD' },
        check_out: { type: 'string', description: 'Check-out date YYYY-MM-DD' },
        guests: { type: 'integer', description: 'Number of guests' },
        promo_code: { type: 'string', description: 'Optional discount code (dev.ucp.shopping.discount capability)' },
      },
      required: ['hotel_id', 'room_id', 'check_in', 'check_out'],
    },
  },
  {
    name: 'submit_buyer_info',
    description: 'Attach guest name and email to a checkout session, moving it to ready_for_complete. Required before complete_booking, since this server does not (yet) resolve buyer identity via OAuth.',
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
    name: 'complete_booking',
    description: 'Complete a hotel booking session and generate a booking confirmation.',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: { type: 'string', description: 'The checkout session ID to complete' },
        payment_token: { type: 'string', description: 'Optional dev.ucp.mock_payment token: "success_token" or "fail_token". Omit to skip the payment step.' },
      },
      required: ['session_id'],
    },
  },
  {
    name: 'cancel_booking',
    description: 'Cancel a hotel booking or reservation. You must provide either the session_id or the booking reference.',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: { type: 'string', description: 'The checkout session ID to cancel' },
        booking_ref: { type: 'string', description: 'The confirmation reference (e.g. BK-XXXXXX) to cancel' },
      },
    },
  },
];

function truncate(text, max) {
  if (!text || text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '...';
}

// Returns null if `guests` is set and no room at this hotel can fit that
// many people — drops hotels with no qualifying room and computes "from"
// price only over rooms that actually fit the party.
function toSearchSummary(hotel, guests) {
  const qualifying = guests
    ? hotel.room_types.filter((r) => r.max_guests >= guests)
    : hotel.room_types;
  if (guests && qualifying.length === 0) return null;

  const cheapest = qualifying.reduce((min, r) => Math.min(min, r.price_per_night), Infinity);
  return {
    id: hotel.id,
    brand: hotel.brand,
    name: hotel.name,
    location: hotel.location,
    star_rating: hotel.star_rating,
    amenities: hotel.amenities,
    from_price_per_night: cheapest,
    currency: 'USD',
    image: hotel.images[0],
    description: truncate(hotel.description, 140),
  };
}

async function callTool(name, args) {
  switch (name) {
    case 'search_hotels': {
      const results = searchHotels(args?.destination)
        .map((h) => toSearchSummary(h, args?.guests))
        .filter(Boolean);
      return { hotels: results, count: results.length };
    }

    case 'get_hotel_details': {
      const hotel = findHotel(args?.hotel_id);
      if (!hotel) throw new Error(`No hotel matching "${args?.hotel_id}"`);
      return hotel;
    }

    case 'create_booking_session': {
      const hotel = findHotel(args?.hotel_id);
      if (!hotel) throw new Error(`No hotel matching "${args?.hotel_id}"`);
      const room = findRoom(hotel, args?.room_id);
      if (!room) throw new Error(`No room matching "${args?.room_id}" at ${hotel.name}`);

      const nights = nightsBetween(args.check_in, args.check_out);
      const subtotal = room.price_per_night * nights;
      const { promo_code, discount_amount, total } = applyDiscount(subtotal, args?.promo_code);

      const { data, error } = await supabase
        .from('checkout_sessions')
        .insert([{
          status: 'incomplete',
          hotel_id: hotel.id,
          hotel_name: hotel.name,
          brand: hotel.brand,
          room_id: room.id,
          room_name: room.name,
          check_in: args.check_in,
          check_out: args.check_out,
          guests: args.guests || 1,
          nights,
          unit_price: room.price_per_night,
          subtotal,
          promo_code,
          discount_amount,
          amount: total,
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

    case 'complete_booking': {
      const { data: session, error: fetchErr } = await supabase
        .from('checkout_sessions')
        .select('*')
        .eq('id', args.session_id)
        .single();
      if (fetchErr || !session) throw new Error('Session not found');
      if (session.status !== 'ready_for_complete') {
        throw new Error(`Session must be ready_for_complete (currently ${session.status}). Call submit_buyer_info first.`);
      }
      validatePaymentToken(args?.payment_token);

      const { data: booking, error: bookingErr } = await supabase
        .from('bookings')
        .insert([{
          booking_ref: generateBookingRef(),
          guest_name: session.guest_name,
          email: session.email,
          hotel_id: session.hotel_id,
          hotel_name: session.hotel_name,
          brand: session.brand,
          room_id: session.room_id,
          room_name: session.room_name,
          check_in: session.check_in,
          check_out: session.check_out,
          guests: session.guests,
          nights: session.nights,
          unit_price: session.unit_price,
          subtotal: session.subtotal,
          promo_code: session.promo_code,
          discount_amount: session.discount_amount,
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

      return { ...toUcpSession(updated), booking_id: booking.id, booking_ref: booking.booking_ref };
    }

    case 'cancel_booking': {
      if (!args?.session_id && !args?.booking_ref) {
        throw new Error('Provide either session_id or booking_ref');
      }

      if (args.booking_ref) {
        const { data: booking, error: fetchErr } = await supabase
          .from('bookings')
          .select('*')
          .eq('booking_ref', args.booking_ref)
          .single();
        if (fetchErr || !booking) throw new Error('Booking not found');
        if (booking.status === 'cancelled') throw new Error('Booking already cancelled');

        const { data: updated, error } = await supabase
          .from('bookings')
          .update({ status: 'cancelled' })
          .eq('id', booking.id)
          .select()
          .single();
        if (error) throw new Error(error.message);

        await supabase
          .from('checkout_sessions')
          .update({ status: 'cancelled', updated_at: new Date().toISOString() })
          .eq('booking_id', booking.id);

        return updated;
      }

      const { data: session, error: fetchErr } = await supabase
        .from('checkout_sessions')
        .select('*')
        .eq('id', args.session_id)
        .single();
      if (fetchErr || !session) throw new Error('Session not found');
      if (session.status === 'completed') {
        throw new Error('Session already completed — cancel the booking by its booking_ref instead');
      }
      const { data, error } = await supabase
        .from('checkout_sessions')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', args.session_id)
        .select()
        .single();
      if (error) throw new Error(error.message);
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
