# Remmybeautyplus

A responsive, framework-free booking website for a luxury braiding and beauty studio.

## Run locally

For the Version 1 static website (booking, availability, localStorage, and admin), run any static server:

```bash
python3 -m http.server 8000
```

No backend is required for Version 1. The optional SMS notification feature uses the included Node server. To enable it, run `npm install`, set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER` in your hosting environment, then run `npm start`.

Then open `http://localhost:8000`.

## Prototype features

- Responsive public site, service gallery, policies, and contact details
- Four-step booking flow with business-hour and service-duration validation
- Double-booking prevention and blocked dates using `localStorage`
- Downloadable `.ics` calendar events
- Admin dashboard at `admin.html` (`admin@remmybeautyplus.com` / `remmy-demo-2026`)
- Apple Pay, Google Pay, and card checkout interface prepared for Stripe; the prototype never collects card data or confirms payment
- Automatic new-booking SMS notifications to `+1 (347) 781-3754` when Twilio is configured

## Customize

- Edit services, images, regular/sale prices, deposits, durations, and availability in `admin.html`.
- Edit business hours, blocked dates, booking policy, and reminder preferences in `admin.html`.
- Replace placeholder contact details in `index.html`.
- Default site photography is stored as optimized WebP files in `images/`.

Admin-managed prototype changes are stored in browser `localStorage`, so they apply only to the same browser profile and device. A backend database and cloud image storage are required for reliable cross-device updates.

## Production notes

This is still a prototype. SMS requires a Twilio account and SMS-capable Twilio number. Copy the variable names from `.env.example` into your hosting provider's secret environment settings; never commit credentials. Before launch, also use backend authentication, a database such as Supabase/PostgreSQL, server-side conflict checks, secure image uploads, and Stripe Checkout or Square for real payments.
