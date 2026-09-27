import { supabase } from '../../../../lib/supabaseClient.js';
import { toUcpSession } from '../../../../lib/sessions.js';

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  const { id } = req.query;

  try {
    const { data: session, error: fetchErr } = await supabase
      .from('checkout_sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !session) {
      return res.status(404).json({ error: { message: 'Session not found' } });
    }
    if (session.status === 'completed') {
      return res.status(409).json({ error: { message: 'Session already completed, cannot cancel' } });
    }

    const { data, error } = await supabase
      .from('checkout_sessions')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json(toUcpSession(data));
  } catch (err) {
    console.error('UCP cancel session failed:', err);
    return res.status(500).json({ error: { message: err.message || 'Failed to cancel session' } });
  }
}
