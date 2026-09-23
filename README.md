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
2. Select a room → fill in name/email → **Confirm booking**.
3. In Supabase, go to **Table Editor** → `bookings` — the row should appear
   immediately. That's your transaction log.
4. You can also hit `https://your-site.vercel.app/api/bookings` directly in
   a browser to see the last 50 bookings as JSON (useful for a future admin
   page).

## Making changes later

Any `git push` to `main` auto-redeploys on Vercel — no manual redeploy step.

## Notes

- The free tiers here (Vercel Hobby + Supabase Free) are enough for a demo
  or small real project. Supabase free pauses a project after a week of no
  traffic — open the dashboard once to unpause it if that happens.
- The `service_role` key is only ever used inside `/api/*.js`, which runs on
  Vercel's servers, never in the browser — so it's never exposed to visitors.
- To go further: add a `payment_status` column and wire in Stripe Checkout,
  or add simple auth to a `/admin` page that reads `/api/bookings`.
