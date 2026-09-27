// Shapes a database row from the `checkout_sessions` table into the
// UCP-style session object returned by all /api/ucp/checkout-sessions
// endpoints and the create_booking_session / complete_booking / get
// MCP tools.
export function toUcpSession(row) {
  return {
    id: row.id,
    status: row.status, // incomplete | ready_for_complete | completed | cancelled
    line_items: [
      {
        hotel_id: row.hotel_id,
        room_id: row.room_id,
        label: `${row.hotel_name} — ${row.room_name}`,
        brand: row.brand,
        check_in: row.check_in,
        check_out: row.check_out,
        guests: row.guests,
        nights: row.nights,
        unit_amount: row.unit_price,
        amount: row.amount,
      },
    ],
    totals: {
      subtotal: row.subtotal ?? row.amount,
      discount_amount: row.discount_amount || 0,
      amount: row.amount,
      currency: "USD",
    },
    promo_code: row.promo_code || null,
    buyer:
      row.guest_name || row.email
        ? { name: row.guest_name, email: row.email }
        : null,
    booking_id: row.booking_id || null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// Generates a human-readable confirmation reference, e.g. "BK-7F3K9A".
export function generateBookingRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I ambiguity
  let ref = "";
  for (let i = 0; i < 6; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }
  return `BK-${ref}`;
}
