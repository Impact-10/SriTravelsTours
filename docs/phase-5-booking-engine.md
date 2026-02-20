# Phase 5 - Booking Engine (Without Payment)

## Implemented backend APIs

- `GET /listActiveVehicles` (auth required)
- `POST /calculateAmount` (auth required)
- `POST /createBooking` (auth required)

All APIs are in Cloud Functions and protected with Firebase JWT validation.

## Security decisions

- Vehicle pricing is read from Firestore on backend only.
- Booking amount is calculated server-side only.
- Frontend-provided amount is never accepted.
- Booking creation always stores status as `pending` and payment state as `not_started`.

## Frontend

- `/vehicles` page
  - Loads vehicle list from backend
  - Captures booking inputs
  - Calls backend for amount calculation
  - Creates booking via backend endpoint
- `/login` page
  - Phone OTP login via Firebase Auth

## Required before runtime testing

1. Deploy functions (requires `ADMIN_BOOTSTRAP_SECRET` configured)
2. Seed vehicles into Firestore using backend credentials:

```powershell
cd "d:\work\Cab Booking\cab-booking\functions"
$env:FIREBASE_PROJECT_ID="sri-travel-tours"
$env:GOOGLE_APPLICATION_CREDENTIALS="<absolute-path-to-service-account-json>"
npm run seed:vehicles
```
