import { supabase } from '../../../lib/supabaseClient.js';
import { toUcpSession } from '../../../lib/sessions.js';

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  const { id } = req.query;

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('checkout_sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: { message: 'Session not found' } });
    }
    return res.status(200).json(toUcpSession(data));
  }

  if (req.method === 'PATCH') {
    try {
      const { buyer } = req.body || {};
      if (!buyer?.name || !buyer?.email) {
        return res.status(400).json({ error: { message: 'buyer.name and buyer.email are required' } });
      }

      const { data: existing, error: fetchErr } = await supabase
        .from('checkout_sessions')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchErr || !existing) {
        return res.status(404).json({ error: { message: 'Session not found' } });
      }
      if (existing.status === 'completed' || existing.status === 'cancelled') {
        return res.status(409).json({ error: { message: `Session already ${existing.status}` } });
      }

      const { data, error } = await supabase
        .from('checkout_sessions')
        .update({
          guest_name: buyer.name,
          email: buyer.email,
          status: 'ready_for_complete',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json(toUcpSession(data));
    } catch (err) {
      console.error('UCP update session failed:', err);
      return res.status(500).json({ error: { message: err.message || 'Failed to update session' } });
    }
  }

  return res.status(405).json({ error: { message: 'Method not allowed' } });
}
