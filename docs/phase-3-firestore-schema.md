# Phase 3 - Firestore Schema Design

## Why this schema

- **Security-first**: all booking amount/payment state transitions happen on backend only.
- **Scale-ready**: composite indexes are declared for user and admin query paths.
- **Auditability**: timestamps and immutable payment references are required.

## Collections

### `users/{uid}`

- `uid: string` (document id match)
- `role: "user" | "admin"`
- `name: string`
- `phoneNumber: string`
- `email: string`
- `createdAt: Timestamp`
- `updatedAt: Timestamp`

### `vehicles/{vehicleId}`

- `name: string`
- `type: "hatchback" | "sedan" | "suv" | "premium"`
- `capacity: number`
- `baseFareFlat: number` (currency minor units not required yet; integer rupees for now)
- `baseFarePerKm: number`
- `baseFarePerMinute: number`
- `minimumFare: number`
- `status: "active" | "inactive"`
- `createdAt: Timestamp`
- `updatedAt: Timestamp`

### `bookings/{bookingId}`

- `userId: string`
- `vehicleId: string`
- `pickupAddress: string`
- `dropAddress: string`
- `distanceKm: number`
- `durationMinutes: number`
- `amount: number` (server-calculated only)
- `currency: "INR"`
- `status: "pending" | "payment_initiated" | "confirmed" | "cancelled" | "failed"`
- `paymentStatus: "not_started" | "pending" | "paid" | "failed"`
- `razorpayOrderId: string | null`
- `razorpayPaymentId: string | null`
- `createdAt: Timestamp`
- `updatedAt: Timestamp`

### `payments/{paymentId}`

- `bookingId: string`
- `userId: string`
- `provider: "razorpay"`
- `razorpayOrderId: string`
- `razorpayPaymentId: string`
- `razorpaySignature: string`
- `amount: number`
- `currency: "INR"`
- `status: "authorized" | "captured" | "failed"`
- `rawWebhookEventId: string | null`
- `createdAt: Timestamp`
- `updatedAt: Timestamp`

## Index requirements

Configured in `firestore.indexes.json`:

1. `bookings`: (`userId`, `createdAt desc`) for user booking history
2. `bookings`: (`status`, `createdAt desc`) for admin queue
3. `bookings`: (`userId`, `status`, `createdAt desc`) for filtered user view
4. `payments`: (`bookingId`, `createdAt desc`) for payment timeline
5. `payments`: (`userId`, `createdAt desc`) for user payment history

## Security model

- `users`: owner read/update limited fields; role escalation blocked on client.
- `vehicles`: authenticated read; admin-only writes.
- `bookings`: read by owner/admin; **client writes blocked** (backend only).
- `payments`: read by owner/admin; **all client writes blocked** (backend only).

This ensures no frontend can forge booking amount, payment state, or role claims.
