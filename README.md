# Kartha Hotels — deploy + booking log setup

This is a static site (`index.html`) plus two small backend functions
(`/api/book.js`, `/api/bookings.js`) that write/read a `bookings` table in a
free Supabase Postgres database. Follow these steps in order.

## 1. Create the free database (Supabase)

1. Go to https://supabase.com → **Start your project** → sign in with GitHub.
2. Click **New project**. Pick any name (e.g. `kartha-hotels`), a password
   (save it somewhere), and the region closest to you. Free tier is selected
   by default — no card required.
3. Wait ~2 minutes for it to provision.
4. In the left sidebar, open **SQL Editor** → **New query**.
5. Paste the contents of `supabase_schema.sql` (included in this project)
   and click **Run**. This creates the `bookings` table.
6. In the left sidebar, open **Project Settings** → **API**. Copy two values,
   you'll need them in step 3:
   - **Project URL** → this is `SUPABASE_URL`
   - **service_role secret** (under "Project API keys") → this is
     `SUPABASE_SERVICE_KEY`. Keep this one private — it has full write access.

## 2. Push the code to GitHub

Vercel deploys from a GitHub repo.

```bash
cd kartha-hotels
git init
git add .
git commit -m "Kartha Hotels site"
```

Create a new empty repo on https://github.com/new (don't add a README there),
then:

```bash
git remote add origin https://github.com/YOUR-USERNAME/kartha-hotels.git
git branch -M main
git push -u origin main
```

## 3. Deploy to Vercel

1. Go to https://vercel.com → sign in with GitHub → **Add New** → **Project**.
2. Select the `kartha-hotels` repo you just pushed → **Import**.
3. Leave the framework preset as **Other** (it's a static file + `/api`
   functions — Vercel detects the `api/` folder automatically).
4. Before clicking Deploy, open **Environment Variables** and add:
   | Name | Value |
   |---|---|
   | `SUPABASE_URL` | the Project URL from step 1.6 |
   | `SUPABASE_SERVICE_KEY` | the service_role secret from step 1.6 |
5. Click **Deploy**. After ~30 seconds you'll get a live URL like
   `kartha-hotels.vercel.app`.

## 4. Test it

1. Open your new `.vercel.app` URL.
2. Pick a collection (Aurel, Meridian, Solaris, Crest, Terra) → **View
   rooms** on a hotel → **Select** a room → fill in name/email → **Confirm
   booking**.
3. In Supabase, go to **Table Editor** → `bookings` — the row should appear
   immediately, with a `booking_ref` like `BK-7F3K9A`. That's your
   transaction log.
4. You can also hit `https://your-site.vercel.app/api/bookings` directly in
   a browser to see the last 50 bookings as JSON (useful for a future admin
   page).

## The catalog

`lib/hotels.js` holds the hotel + room-type catalog that both the human UI
(`index.html`) and the agent-facing endpoints below read from: 10 hotels
across 5 collections (Aurel Collection, Meridian Hotels, Solaris Resorts,
Crest Urban Hotels, Terra Retreat Hotels), each with 2-3 room types
(id, name, description, price_per_night, max_guests, beds, size_sqft).
This shape matches the Universal Commerce Protocol shopping schema used by
other UCP-compliant hotel sites, so search/details responses are drop-in
compatible for an agent that already knows how to talk to one.

## Making changes later

Any `git push` to `main` auto-redeploys on Vercel — no manual redeploy step.

## 5. Agent-facing endpoints (UCP + MCP)

This project also exposes the booking flow in two AI-agent-readable forms,
built to the shape of Google's open **Universal Commerce Protocol (UCP)**
and **MCP (Model Context Protocol)** — so agents can discover Kartha
Hotels and complete a booking without touching the human UI.

**Run the extra table first:** in Supabase SQL Editor, run
`supabase_schema_ucp.sql` (after `supabase_schema.sql`) to create the
`checkout_sessions` table these endpoints use.

### UCP discovery + checkout sessions
- `GET /.well-known/ucp` — discovery profile: tells an agent where the
  checkout-sessions endpoint and MCP endpoint live.
- `POST /api/ucp/checkout-sessions` — create a session for a specific hotel + room
  ```json
  { "hotel_id": "aurel_paris_centre", "room_id": "aurel_paris_classique", "check_in": "2026-11-01", "check_out": "2026-11-04", "guests": 2 }
  ```
- `GET /api/ucp/checkout-sessions/:id` — read a session
- `PATCH /api/ucp/checkout-sessions/:id` — attach the buyer
  ```json
  { "buyer": { "name": "Jane Doe", "email": "jane@example.com" } }
  ```
- `POST /api/ucp/checkout-sessions/:id/complete` — finalize → writes a real row into `bookings`, with a `booking_ref` like `BK-7F3K9A`
- `POST /api/ucp/checkout-sessions/:id/cancel` — cancel

Session states: `incomplete → ready_for_complete → completed | cancelled`.

Quick end-to-end test with curl:
```bash
SITE="https://your-site.vercel.app"

SESSION=$(curl -s -X POST "$SITE/api/ucp/checkout-sessions" \
  -H "Content-Type: application/json" \
  -d '{"hotel_id":"aurel_paris_centre","room_id":"aurel_paris_classique","check_in":"2026-11-01","check_out":"2026-11-04","guests":2}')
ID=$(echo $SESSION | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

curl -s -X PATCH "$SITE/api/ucp/checkout-sessions/$ID" \
  -H "Content-Type: application/json" \
  -d '{"buyer":{"name":"Jane Doe","email":"jane@example.com"}}'

curl -s -X POST "$SITE/api/ucp/checkout-sessions/$ID/complete"
```

### MCP endpoint
- `POST /api/mcp` — JSON-RPC 2.0. Supports `initialize`, `tools/list`, and
  `tools/call` for these tools: `search_hotels`, `get_hotel_details`,
  `create_booking_session`, `submit_buyer_info` (this server's own addition —
  see note below), `complete_booking`, `cancel_booking`.

`search_hotels` filters out any hotel with no room that fits the requested
`guests`, and reports `from_price_per_night` as the cheapest *qualifying*
room — not just the overall cheapest room.

`create_booking_session` (MCP) and `POST /api/ucp/checkout-sessions` (REST)
take an optional `promo_code` (`dev.ucp.shopping.discount` capability).
Known codes: `WELCOME10` (10% off), `STAY20` (20% off) — see
`lib/discounts.js`.

`complete_booking` (MCP) and `POST .../complete` (REST) take an optional
`payment_token` (`dev.ucp.mock_payment` handler, declared in
`/.well-known/ucp`'s `payment_handlers`): `"success_token"` succeeds,
`"fail_token"` is rejected with a mock decline, and omitting it entirely
skips the payment step (no real charge is ever made either way) — see
`lib/payments.js`.

> **Note:** the reference UCP hotel site this was matched against resolves
> buyer identity via OAuth2 identity-linking (see its `auth` block in
> `/.well-known/ucp`), so its `complete_booking` needs no separate buyer step.
> This project doesn't implement OAuth yet, so `submit_buyer_info` (name +
> email) is a required extra step between `create_booking_session` and
> `complete_booking`. Real OAuth2 + JWKS request signing is intentionally
> not faked here — it's a bigger, separate build, not something worth
> stubbing out just to match the discovery doc's shape.

Quick test:
```bash
curl -s -X POST "$SITE/api/mcp" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

To connect this as a real MCP server from an MCP-compatible client (like
Claude Desktop's custom connector setup, or any MCP client that supports an
HTTP/JSON-RPC transport), point it at `https://your-site.vercel.app/api/mcp`.

## Notes

- The free tiers here (Vercel Hobby + Supabase Free) are enough for a demo
  or small real project. Supabase free pauses a project after a week of no
  traffic — open the dashboard once to unpause it if that happens.
- The `service_role` key is only ever used inside `/api/*.js`, which runs on
  Vercel's servers, never in the browser — so it's never exposed to visitors.
- To go further: add a `payment_status` column and wire in Stripe Checkout,
  or add simple auth to a `/admin` page that reads `/api/bookings`.
