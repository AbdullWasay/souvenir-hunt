## Stripe Setup (Local)

Use this once to make checkout + webhook work locally.

1. Keep these in `.env`:
   - `STRIPE_SECRET_KEY`
   - `VITE_STRIPE_PUBLISHABLE_KEY`
   - `APP_URL=http://localhost:5173`

2. Start app:
   - `npm run dev`

3. Install Stripe CLI (if not installed):
   - macOS (Homebrew): `brew install stripe/stripe-cli/stripe`
   - then login: `stripe login`

4. Start webhook forwarding:
   - `npm run stripe:listen`

5. Copy the printed signing secret from terminal:
   - looks like `whsec_...`
   - put it in `.env` as `STRIPE_WEBHOOK_SECRET=whsec_...`

6. Restart app after editing `.env`.

7. Optional webhook test:
   - `npm run stripe:trigger-checkout`

## Production webhook secret

In Stripe Dashboard:
- Developers -> Webhooks -> Add endpoint
- Endpoint URL: `https://<your-domain>/api/stripe-webhook`
- Listen to event: `checkout.session.completed`
- Save, then click endpoint -> Reveal signing secret
- Set that as `STRIPE_WEBHOOK_SECRET` in production env.
