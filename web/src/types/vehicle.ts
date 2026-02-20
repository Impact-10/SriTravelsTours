export type VehicleVariant = {
  type: string;
  price: number;
  extraHourPrice: number;
};

export type Vehicle = {
  name: string;
  slug: string;
  capacity: number;
  coverImage: string;
  gallery: string[];
  durationHours: number;
  distanceKm: number;
  variants: VehicleVariant[];
};
