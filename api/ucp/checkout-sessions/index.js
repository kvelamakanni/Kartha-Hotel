import { supabase } from '../../../lib/supabaseClient.js';
import { findHotel, nightsBetween } from '../../../lib/hotels.js';
import { toUcpSession } from '../../../lib/sessions.js';

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  try {
    const { hotel, check_in, check_out, guests } = req.body || {};
    const listing = findHotel(hotel);

    if (!listing || !check_in || !check_out) {
      return res.status(400).json({
        error: { message: 'hotel, check_in and check_out are required' },
      });
    }

    const nights = nightsBetween(check_in, check_out);
    const guestCount = guests || 1;
    const amount = listing.price * nights;

    const { data, error } = await supabase
      .from('checkout_sessions')
      .insert([{
        status: 'incomplete', // buyer info not collected yet
        hotel_name: listing.brand,
        check_in,
        check_out,
        guests: guestCount,
        nights,
        unit_price: listing.price,
        amount,
      }])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json(toUcpSession(data));
  } catch (err) {
    console.error('UCP create session failed:', err);
    return res.status(500).json({ error: { message: err.message || 'Failed to create session' } });
  }
}
