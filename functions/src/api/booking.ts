import { FieldValue } from "firebase-admin/firestore";
import { onRequest } from "firebase-functions/v2/https";

import { db } from "../firebase";
import { withAuth } from "../middleware/auth";
import { calculateBookingAmount, validatePricingInput } from "../domain/pricing";

const region = "asia-south1";

type BookingPayload = {
  vehicleId?: string;
  pickupAddress?: string;
  dropAddress?: string;
  distanceKm?: number;
  durationMinutes?: number;
};

type VehicleDoc = {
  name: string;
  type: "hatchback" | "sedan" | "suv" | "premium";
  capacity: number;
  baseFareFlat: number;
  baseFarePerKm: number;
  baseFarePerMinute: number;
  minimumFare: number;
  status: "active" | "inactive";
};

async function getActiveVehicle(vehicleId: string): Promise<{ id: string; data: VehicleDoc }> {
  const doc = await db.collection("vehicles").doc(vehicleId).get();

  if (!doc.exists) {
    throw new Error("Vehicle not found");
  }

  const data = doc.data() as VehicleDoc;

  if (data.status !== "active") {
    throw new Error("Vehicle is not active");
  }

  return { id: doc.id, data };
}

function parseBookingPayload(raw: unknown): Required<BookingPayload> {
  const payload = raw as BookingPayload;

  const vehicleId = payload.vehicleId?.trim();
  const pickupAddress = payload.pickupAddress?.trim();
  const dropAddress = payload.dropAddress?.trim();

  if (!vehicleId || !pickupAddress || !dropAddress) {
    throw new Error("vehicleId, pickupAddress and dropAddress are required");
  }

  const validatedPricing = validatePricingInput({
    distanceKm: Number(payload.distanceKm),
    durationMinutes: Number(payload.durationMinutes),
  });

  return {
    vehicleId,
    pickupAddress,
    dropAddress,
    distanceKm: validatedPricing.distanceKm,
    durationMinutes: validatedPricing.durationMinutes,
  };
}

export const listActiveVehicles = onRequest({ region, cors: true }, withAuth(async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const snapshot = await db
    .collection("vehicles")
    .where("status", "==", "active")
    .orderBy("createdAt", "asc")
    .get();

  const vehicles = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as VehicleDoc) }));

  res.status(200).json({ vehicles });
}));

export const calculateAmount = onRequest({ region, cors: true }, withAuth(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const payload = parseBookingPayload(req.body);
    const { data: vehicle } = await getActiveVehicle(payload.vehicleId);

    const amount = calculateBookingAmount(vehicle, {
      distanceKm: payload.distanceKm,
      durationMinutes: payload.durationMinutes,
    });

    res.status(200).json({
      amount,
      currency: "INR",
      vehicle: {
        id: payload.vehicleId,
        name: vehicle.name,
        type: vehicle.type,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Invalid request" });
  }
}));

export const createBooking = onRequest({ region, cors: true }, withAuth(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const payload = parseBookingPayload(req.body);
    const { id: vehicleId, data: vehicle } = await getActiveVehicle(payload.vehicleId);

    const amount = calculateBookingAmount(vehicle, {
      distanceKm: payload.distanceKm,
      durationMinutes: payload.durationMinutes,
    });

    const bookingRef = db.collection("bookings").doc();

    await bookingRef.set({
      userId: req.auth.uid,
      vehicleId,
      pickupAddress: payload.pickupAddress,
      dropAddress: payload.dropAddress,
      distanceKm: payload.distanceKm,
      durationMinutes: payload.durationMinutes,
      amount,
      currency: "INR",
      status: "pending",
      paymentStatus: "not_started",
      razorpayOrderId: null,
      razorpayPaymentId: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      bookingId: bookingRef.id,
      amount,
      currency: "INR",
      status: "pending",
    });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Invalid request" });
  }
}));
