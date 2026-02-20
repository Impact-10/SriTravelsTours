import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

type VehicleSeed = {
  slug: string;
  name: string;
  capacity: number;
  coverImage: string;
  gallery: string[];
  durationHours: number;
  distanceKm: number;
  variants: Array<{
    type: "AC" | "NON_AC";
    price: number;
    extraHourPrice: number;
  }>;
};

const vehicles: VehicleSeed[] = [
  {
    slug: "innova",
    name: "Innova",
    capacity: 8,
    coverImage: "innova/cover.svg",
    gallery: [
      "innova/1.jpeg",
      "innova/2.jpeg",
      "innova/3.jpeg",
      "innova/4.jpeg",
      "innova/5.jpeg",
      "innova/6.jpeg",
      "innova/7.jpeg",
      "innova/8.jpeg",
      "innova/9.jpeg",
    ],
    durationHours: 12,
    distanceKm: 200,
    variants: [
      { type: "AC", price: 5500, extraHourPrice: 18 },
      { type: "NON_AC", price: 0, extraHourPrice: 17 },
    ],
  },
  {
    slug: "xylo",
    name: "Xylo",
    capacity: 8,
    coverImage: "xylo/cover.svg",
    gallery: ["xylo/1.jpeg", "xylo/2.jpeg", "xylo/3.jpeg", "xylo/4.jpeg", "xylo/5.jpeg", "xylo/6.jpeg", "xylo/7.jpeg"],
    durationHours: 12,
    distanceKm: 200,
    variants: [
      { type: "AC", price: 4800, extraHourPrice: 16 },
      { type: "NON_AC", price: 0, extraHourPrice: 15 },
    ],
  },
  {
    slug: "tempo",
    name: "Tempo Traveller",
    capacity: 15,
    coverImage: "tempo/cover.svg",
    gallery: ["tempo/1.jpeg", "tempo/2.jpeg", "tempo/3.jpeg", "tempo/4.jpeg"],
    durationHours: 12,
    distanceKm: 200,
    variants: [
      { type: "AC", price: 7500, extraHourPrice: 24 },
      { type: "NON_AC", price: 6500, extraHourPrice: 22 },
    ],
  },
];

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function initializeAdmin(): void {
  if (getApps().length > 0) {
    return;
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (serviceAccountJson) {
    const serviceAccount = JSON.parse(serviceAccountJson) as {
      project_id: string;
      client_email: string;
      private_key: string;
    };

    initializeApp({
      credential: cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
      }),
      projectId: serviceAccount.project_id,
    });

    return;
  }

  const googleCredentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!googleCredentialsPath) {
    throw new Error(
      "No admin credentials found. Set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_JSON.",
    );
  }

  initializeApp({
    credential: applicationDefault(),
    projectId: getRequiredEnv("FIREBASE_PROJECT_ID"),
  });
}

async function seedVehicles(): Promise<void> {
  initializeAdmin();
  const db = getFirestore();
  const batch = db.batch();

  for (const vehicle of vehicles) {
    const docRef = db.collection("vehicles").doc(vehicle.slug);
    batch.set(docRef, {
      ...vehicle,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
  }

  await batch.commit();
  process.stdout.write(`Seeded ${vehicles.length} vehicles successfully.\n`);
}

seedVehicles().catch((error: unknown) => {
  process.stderr.write(`Vehicle seeding failed: ${String(error)}\n`);
  process.exit(1);
});
