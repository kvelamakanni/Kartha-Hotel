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
    if (session.status !== 'ready_for_complete') {
      return res.status(409).json({
        error: { message: `Session must be ready_for_complete (currently ${session.status})` },
      });
    }

    // Write the real, durable transaction row — same table the human checkout flow writes to.
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

    if (bookingErr) throw bookingErr;

    const { data: updated, error: updateErr } = await supabase
      .from('checkout_sessions')
      .update({
        status: 'completed',
        booking_id: booking.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    return res.status(200).json({ ...toUcpSession(updated), booking_id: booking.id });
  } catch (err) {
    console.error('UCP complete session failed:', err);
    return res.status(500).json({ error: { message: err.message || 'Failed to complete session' } });
  }
}
