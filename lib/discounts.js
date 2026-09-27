// Backing the dev.ucp.shopping.discount capability declared in
// /.well-known/ucp — a small hardcoded promo-code table, applied at
// create_booking_session / POST /api/ucp/checkout-sessions time.
export const PROMO_CODES = {
  WELCOME10: 0.10,
  STAY20: 0.20,
};

// Returns { promo_code, discount_amount, total } for a given subtotal.
// Throws if `code` is set but doesn't match a known promo.
export function applyDiscount(subtotal, code) {
  if (!code) {
    return { promo_code: null, discount_amount: 0, total: subtotal };
  }
  const normalized = code.trim().toUpperCase();
  const pct = PROMO_CODES[normalized];
  if (pct == null) {
    throw new Error(`Unknown promo code "${code}"`);
  }
  const discount_amount = Math.round(subtotal * pct * 100) / 100;
  return { promo_code: normalized, discount_amount, total: subtotal - discount_amount };
}
