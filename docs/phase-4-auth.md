# Phase 4 - Authentication and Authorization

## Implemented

### Web (Phone OTP)

- Route: `/login`
- Uses Firebase Auth phone OTP with invisible reCAPTCHA
- Signs in user and exposes current UID for verification

### Cloud Functions JWT validation middleware

- `withAuth`: verifies Firebase ID token (Bearer token)
- `withAdmin`: enforces admin claim (`admin: true` or `role: "admin"`)

### Role-based claims

- `syncRoleClaims` Firestore trigger keeps Auth custom claims in sync when `users/{uid}.role` changes.

### Admin role assignment strategy

1. **First admin bootstrap (one-time)**
   - Function: `bootstrapFirstAdmin`
   - Requires authenticated caller + `x-bootstrap-secret`
   - Refuses if any admin already exists
2. **Ongoing role management**
   - Function: `setUserRole` (admin-only)
   - Also available as secure local script with backend credentials:
     - `npm run role:set -- <uid> <user|admin>`

## Required secret before deploy

Set one-time bootstrap secret in Firebase Functions:

```powershell
cd "d:\work\Cab Booking\cab-booking"
npx firebase-tools functions:secrets:set ADMIN_BOOTSTRAP_SECRET
```

## Security notes

- Frontend role is never trusted.
- Backend validates JWT on every protected endpoint.
- Claims are controlled server-side only.
- First admin creation is explicitly guarded with a secret and single-admin existence check.
