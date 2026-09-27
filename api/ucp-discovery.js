const UCP_VERSION = "2026-01-11";

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const host = req.headers.host;
  const base = `https://${host}`;

  return res.status(200).json({
    ucp: {
      version: UCP_VERSION,
      services: {
        "dev.ucp.shopping": [
          {
            version: UCP_VERSION,
            spec: "https://ucp.dev/specs/shopping",
            schema: "https://ucp.dev/services/shopping/openapi.json",
            transport: "rest",
            endpoint: `${base}/api/ucp/checkout-sessions`,
          },
          {
            version: UCP_VERSION,
            spec: "https://ucp.dev/specs/shopping",
            transport: "mcp",
            endpoint: `${base}/api/mcp`,
          },
        ],
      },
      capabilities: {
        "dev.ucp.shopping.checkout": [
          {
            version: UCP_VERSION,
            spec: "https://ucp.dev/specs/shopping/checkout",
            schema: "https://ucp.dev/schemas/shopping/checkout.json",
          },
        ],
        "dev.ucp.shopping.payment": [
          {
            version: UCP_VERSION,
            spec: "https://ucp.dev/specs/shopping/payment",
            schema: "https://ucp.dev/schemas/shopping/payment.json",
          },
        ],
        "dev.ucp.shopping.discount": [
          {
            version: UCP_VERSION,
            spec: "https://ucp.dev/specs/shopping/discount",
            schema: "https://ucp.dev/schemas/shopping/discount.json",
            extends: "dev.ucp.shopping.checkout",
          },
        ],
      },
      payment_handlers: {
        "dev.ucp.mock_payment": [
          {
            id: "dev.ucp.mock_payment",
            version: UCP_VERSION,
            spec: "https://ucp.dev/specs/mock",
            schema: "https://ucp.dev/schemas/mock.json",
            config_schema: "https://ucp.dev/schemas/mock.json",
            instrument_schemas: ["https://ucp.dev/schemas/shopping/types/card_payment_instrument.json"],
            config: { supported_tokens: ["success_token", "fail_token"] },
          },
        ],
      },
    },
    keys: [],
  });
}
