# Phase 2 - Firebase Setup (Production Baseline)

This phase establishes secure Firebase integration for the cab-booking monorepo.

## 1) Firebase Console setup (manual)

1. Open Firebase Console and select project: `sri-travel-tours`
2. Authentication:
   - Enable **Phone** provider
   - Enable **Email/Password** provider (for admin/back-office fallback)
3. Firestore:
   - Create database in **Production mode**
   - Pick the closest region to users (recommended: `asia-south1` if India-first)
4. Functions:
   - Ensure Blaze plan is enabled (required for outbound payment APIs and production workloads)

## 2) Local CLI prerequisites

Use Node.js 20 LTS.

```powershell
npm install -g firebase-tools
firebase --version
```

## 3) Authenticate and bind project

```powershell
cd "d:\work\Cab Booking\cab-booking"
firebase login
firebase use sri-travel-tours
```

## 4) Install Cloud Functions dependencies

```powershell
cd "d:\work\Cab Booking\cab-booking\functions"
npm install
npm run build
```

## 5) Deploy baseline Firebase resources

```powershell
cd "d:\work\Cab Booking\cab-booking"
firebase deploy --only firestore:rules,firestore:indexes
```

> Current baseline rules are deny-all for safety and will be replaced with strict role-based rules in Phase 3.

## 6) Frontend Firebase wiring

The web app reads Firebase config only from local env files:

- `web/.env.local`
- `web/lib/env.ts`
- `web/lib/firebase/client.ts`
- `web/lib/firebase/services.ts`

Do not hardcode project credentials in source files.

## 7) Validation

```powershell
cd "d:\work\Cab Booking\cab-booking\web"
npm run build
```

If build succeeds, Phase 2 frontend integration is complete.
