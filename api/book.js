import { supabase } from '../lib/supabaseClient.js';
import { findHotel, findRoom, nightsBetween } from '../lib/hotels.js';
import { generateBookingRef } from '../lib/sessions.js';
import { applyDiscount } from '../lib/discounts.js';
import { validatePaymentToken } from '../lib/payments.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { guestName, email, hotelId, roomId, checkIn, checkOut, guests, promoCode, paymentToken } = req.body || {};

    if (!guestName || !email || !hotelId || !roomId || !checkIn || !checkOut) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hotel = findHotel(hotelId);
    if (!hotel) return res.status(400).json({ error: `No hotel matching "${hotelId}"` });
    const room = findRoom(hotel, roomId);
    if (!room) return res.status(400).json({ error: `No room matching "${roomId}" at ${hotel.name}` });

    const nights = nightsBetween(checkIn, checkOut);
    const subtotal = room.price_per_night * nights;

    let promo_code, discount_amount, amount;
    try {
      ({ promo_code, discount_amount, total: amount } = applyDiscount(subtotal, promoCode));
      validatePaymentToken(paymentToken);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        booking_ref: generateBookingRef(),
        guest_name: guestName,
        email,
        hotel_id: hotel.id,
        hotel_name: hotel.name,
        brand: hotel.brand,
        room_id: room.id,
        room_name: room.name,
        check_in: checkIn,
        check_out: checkOut,
        guests: guests || 1,
        nights,
        unit_price: room.price_per_night,
        subtotal,
        promo_code,
        discount_amount,
        amount,
      }])
      .select();

    if (error) throw error;

    return res.status(200).json({ success: true, booking: data[0] });
  } catch (err) {
    console.error('Booking insert failed:', err);
    return res.status(500).json({ error: err.message || 'Failed to save booking' });
  }
}
