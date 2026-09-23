import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
console.log('SUPABASE_URL is:', JSON.stringify(process.env.SUPABASE_URL));
  try {
    const { guestName, email, hotelName, checkIn, checkOut, guests, amount } = req.body;

    if (!guestName || !email || !hotelName || !checkIn || !checkOut) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        guest_name: guestName,
        email,
        hotel_name: hotelName,
        check_in: checkIn,
        check_out: checkOut,
        guests: guests || 1,
        amount: amount || 0
      }])
      .select();

    if (error) throw error;

    return res.status(200).json({ success: true, booking: data[0] });
  } catch (err) {
    console.error('Booking insert failed:', err);
    return res.status(500).json({ error: err.message || 'Failed to save booking' });
  }
}
