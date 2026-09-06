# Remmybeautyplus

A responsive, framework-free booking website for a luxury braiding and beauty studio.

## Run locally

For the Version 1 static website (booking, availability, localStorage, and admin), run any static server:

```bash
python3 -m http.server 8000
```

No backend is required for Version 1. The optional SMS notification feature uses the included Node server. To enable it, run `npm install`, set the Twilio environment variables shown in `.env.example`, then run `npm start`.

Then open `http://localhost:8000`.

## Prototype features

- Responsive public site, service gallery, policies, and contact details
- Four-step booking flow with business-hour and service-duration validation
- Double-booking prevention and blocked dates using `localStorage`
- Downloadable `.ics` calendar events
- Admin dashboard at `admin.html` (`admin` / `remmy123`)
- Demo payment confirmation that never collects card data
- Automatic new-booking SMS notifications to `+1 (347) 781-3754` when Twilio is configured

## Customize

- Edit services, prices, and durations in `js/main.js`. Current prices and durations are estimates because the supplied catalog screenshots did not include them.
- Edit business hours and deposit amount at the top of `js/booking.js`.
- Replace placeholder contact details in `index.html`.
- Replace `images/remmy-hero.png` with final portfolio photography.

## Production notes

This is still a prototype. SMS requires a Twilio account and SMS-capable Twilio number. Copy the variable names from `.env.example` into your hosting provider's secret environment settings; never commit credentials. Before launch, also use backend authentication, a database such as Supabase/PostgreSQL, server-side conflict checks, secure image uploads, and Stripe Checkout or Square for real payments.
