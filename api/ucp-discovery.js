export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const host = req.headers.host;
  const base = `https://${host}`;

  return res.status(200).json({
    ucp_version: "2026-01",
    merchant: {
      name: "Kartha Hotels",
      merchant_of_record: true,
      support_url: `${base}/#contact`,
    },
    capabilities: [
      {
        name: "com.karthahotels.lodging_checkout",
        version: "2026-01",
        transport: ["rest", "mcp"],
        checkout_sessions_url: `${base}/api/ucp/checkout-sessions`,
        mcp_url: `${base}/api/mcp`,
        currency: "USD",
      },
    ],
  });
}
