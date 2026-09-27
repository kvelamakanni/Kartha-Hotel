// Backing the dev.ucp.mock_payment handler declared in /.well-known/ucp.
// This is a mock — no real charge is ever made — matching the same
// success_token / fail_token contract other UCP mock-payment handlers use,
// so an agent that exercises payment against this server behaves the same
// way it would against a real one, without needing a live payment gateway.
export const SUPPORTED_TOKENS = ['success_token', 'fail_token'];

// Throws if `token` is provided and invalid or a deliberate failure token.
// A missing token is allowed (treated as "no payment step requested"), so
// existing callers that don't send one keep working.
export function validatePaymentToken(token) {
  if (token == null) return;
  if (token === 'success_token') return;
  if (token === 'fail_token') {
    throw new Error('Payment declined (mock dev.ucp.mock_payment: fail_token)');
  }
  throw new Error(`Unknown payment_token "${token}" — expected one of ${SUPPORTED_TOKENS.join(', ')}`);
}
