// Shapes a database row from the `checkout_sessions` table into the
// UCP-style session object returned by all /api/ucp/checkout-sessions endpoints.
export function toUcpSession(row) {
  return {
    id: row.id,
    status: row.status, // incomplete | ready_for_complete | completed | cancelled
    line_items: [
      {
        label: row.hotel_name,
        check_in: row.check_in,
        check_out: row.check_out,
        guests: row.guests,
        nights: row.nights,
        unit_amount: row.unit_price,
        amount: row.amount,
      },
    ],
    totals: { amount: row.amount, currency: "USD" },
    buyer:
      row.guest_name || row.email
        ? { name: row.guest_name, email: row.email }
        : null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
