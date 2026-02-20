type VehiclePricing = {
  baseFareFlat: number;
  baseFarePerKm: number;
  baseFarePerMinute: number;
  minimumFare: number;
};

type PricingInput = {
  distanceKm: number;
  durationMinutes: number;
};

export function validatePricingInput(input: PricingInput): PricingInput {
  if (!Number.isFinite(input.distanceKm) || input.distanceKm <= 0) {
    throw new Error("distanceKm must be a positive number");
  }

  if (!Number.isFinite(input.durationMinutes) || input.durationMinutes <= 0) {
    throw new Error("durationMinutes must be a positive number");
  }

  return {
    distanceKm: Number(input.distanceKm),
    durationMinutes: Number(input.durationMinutes),
  };
}

export function calculateBookingAmount(pricing: VehiclePricing, input: PricingInput): number {
  const validatedInput = validatePricingInput(input);

  const subtotal =
    pricing.baseFareFlat +
    pricing.baseFarePerKm * validatedInput.distanceKm +
    pricing.baseFarePerMinute * validatedInput.durationMinutes;

  const boundedTotal = Math.max(subtotal, pricing.minimumFare);

  return Math.round(boundedTotal);
}
