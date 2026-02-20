import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";

import { firestore } from "@/lib/firebase/services";
import type { Vehicle } from "@/types/vehicle";

const VEHICLES_COLLECTION = "vehicles";

export async function getVehicles(): Promise<Vehicle[]> {
  const vehiclesQuery = query(collection(firestore, VEHICLES_COLLECTION));
  const snapshot = await getDocs(vehiclesQuery);

  return snapshot.docs
    .map((item) => ({ ...(item.data() as Vehicle), slug: item.id }))
    .sort((left, right) => String(left.name ?? "").localeCompare(String(right.name ?? "")));
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const vehicleRef = doc(firestore, VEHICLES_COLLECTION, slug);
  const vehicleSnapshot = await getDoc(vehicleRef);

  if (!vehicleSnapshot.exists()) {
    return null;
  }

  return {
    ...(vehicleSnapshot.data() as Vehicle),
    slug: vehicleSnapshot.id,
  };
}
