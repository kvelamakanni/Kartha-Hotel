import { supabase } from '../../../lib/supabaseClient.js';
import { findHotel, findRoom, nightsBetween } from '../../../lib/hotels.js';
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
    const { hotel_id, room_id, check_in, check_out, guests } = req.body || {};
    const hotel = findHotel(hotel_id);

    if (!hotel) {
      return res.status(400).json({ error: { message: `No hotel matching hotel_id "${hotel_id}"` } });
    }
    const room = findRoom(hotel, room_id);
    if (!room) {
      return res.status(400).json({ error: { message: `No room matching room_id "${room_id}" at this hotel` } });
    }
    if (!check_in || !check_out) {
      return res.status(400).json({
        error: { message: 'check_in and check_out are required' },
      });
    }

    const nights = nightsBetween(check_in, check_out);
    const guestCount = guests || 1;
    const amount = room.price_per_night * nights;

    const { data, error } = await supabase
      .from('checkout_sessions')
      .insert([{
        status: 'incomplete', // buyer info not collected yet
        hotel_id: hotel.id,
        hotel_name: hotel.name,
        brand: hotel.brand,
        room_id: room.id,
        room_name: room.name,
        check_in,
        check_out,
        guests: guestCount,
        nights,
        unit_price: room.price_per_night,
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
