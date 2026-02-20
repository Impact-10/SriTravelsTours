"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ASSETS } from "@/config/assets";
import { getVehicleBySlug, getVehicles } from "@/lib/firebase/vehicles";
import type { Vehicle } from "@/types/vehicle";

function buildVehicleImage(path: string): string {
  return `/assets/Vehicles/${path}`;
}

type VehicleViewModel = {
  slug: string;
  name: string;
  coverImage: string;
  gallery: string[];
  variants: Array<{
    type: string;
    price: number;
    extraHourPrice: number;
  }>;
  durationHours: number;
  distanceKm: number;
  capacity: number;
};

type GalleryEntry = {
  path: string;
  index: number;
};

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function formatPassengerDisplay(capacity: number): string {
  const passengerSeats = Math.max(capacity - 1, 0);
  return `${passengerSeats}+1`;
}

function normalizeVehicle(vehicle: Vehicle | null, expectedSlug: string): VehicleViewModel | null {
  if (!vehicle || typeof vehicle !== "object") {
    return null;
  }

  const slug = typeof vehicle.slug === "string" && vehicle.slug.length > 0 ? vehicle.slug : expectedSlug;

  if (slug !== expectedSlug) {
    return null;
  }

  if (typeof vehicle.name !== "string") {
    return null;
  }

  if (typeof vehicle.coverImage !== "string") {
    return null;
  }

  if (!Array.isArray(vehicle.gallery)) {
    return null;
  }

  if (!Array.isArray(vehicle.variants)) {
    return null;
  }

  if (!isNumber(vehicle.durationHours) || !isNumber(vehicle.distanceKm)) {
    return null;
  }

  const gallery = vehicle.gallery.filter((item): item is string => typeof item === "string" && item.length > 0);
  const variants = vehicle.variants
    .filter((variant) => variant && typeof variant === "object")
    .map((variant) => ({
      type: typeof variant.type === "string" ? variant.type : "N/A",
      price: isNumber(variant.price) ? variant.price : 0,
      extraHourPrice: isNumber(variant.extraHourPrice) ? variant.extraHourPrice : 0,
    }));

  return {
    slug,
    name: vehicle.name,
    coverImage: vehicle.coverImage,
    gallery,
    variants,
    durationHours: vehicle.durationHours,
    distanceKm: vehicle.distanceKm,
    capacity: isNumber(vehicle.capacity) ? vehicle.capacity : 0,
  };
}

function VehicleImage({
  path,
  alt,
  sizes,
  className,
}: {
  path: string;
  alt: string;
  sizes: string;
  className: string;
}) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [path]);

  if (!path || hasError) {
    return <div className="flex h-full w-full items-center justify-center rounded-md bg-secondary/10 text-center text-sm">Image unavailable</div>;
  }

  return <Image src={buildVehicleImage(path)} alt={alt} fill sizes={sizes} className={className} onError={() => setHasError(true)} />;
}

function CaretLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M10 12.796V3.204L4.519 8zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753" />
    </svg>
  );
}

function CaretRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6 12.796V3.204L11.481 8zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753" />
    </svg>
  );
}

function CaretUpIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.204 11h9.592L8 5.519zm-.753-.659 4.796-5.48a1 1 0 0 1 1.506 0l4.796 5.48c.566.647.106 1.659-.753 1.659H3.204a1 1 0 0 1-.753-1.659" />
    </svg>
  );
}

function CaretDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.204 5h9.592L8 10.481zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659" />
    </svg>
  );
}

function getCarouselItems(gallery: string[], startIndex: number, count: number): GalleryEntry[] {
  if (gallery.length === 0) {
    return [];
  }

  const safeCount = Math.min(count, gallery.length);

  return Array.from({ length: safeCount }, (_, offset) => {
    const index = (startIndex + offset) % gallery.length;
    return {
      path: gallery[index],
      index,
    };
  });
}

export default function VehicleDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const [vehicles, setVehicles] = useState<VehicleViewModel[]>([]);
  const [activeVehicleIndex, setActiveVehicleIndex] = useState(0);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [galleryWindowStart, setGalleryWindowStart] = useState(0);
  const [overlayImagePath, setOverlayImagePath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isInvalidData, setIsInvalidData] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadVehicles(): Promise<void> {
      try {
        const slug = params.slug;
        const [fetchedVehicle, allVehicles] = await Promise.all([getVehicleBySlug(slug), getVehicles()]);

        if (!isMounted) {
          return;
        }

        if (!fetchedVehicle) {
          setIsNotFound(true);
          setIsInvalidData(false);
          setVehicles([]);
          setActiveVehicleIndex(0);
          setActiveGalleryIndex(0);
          setGalleryWindowStart(0);
          return;
        }

        const currentVehicle = normalizeVehicle(fetchedVehicle, slug);

        if (!currentVehicle) {
          setIsNotFound(false);
          setIsInvalidData(true);
          setVehicles([]);
          setActiveVehicleIndex(0);
          setActiveGalleryIndex(0);
          setGalleryWindowStart(0);
          return;
        }

        const validVehicles = allVehicles
          .map((item) => normalizeVehicle(item, item.slug))
          .filter((item): item is VehicleViewModel => item !== null);

        const mergedVehicles = validVehicles.some((item) => item.slug === currentVehicle.slug) ? validVehicles : [currentVehicle, ...validVehicles];
        const index = mergedVehicles.findIndex((item) => item.slug === currentVehicle.slug);

        if (index === -1) {
          setIsNotFound(true);
          setIsInvalidData(false);
          setVehicles([]);
          setActiveVehicleIndex(0);
          setActiveGalleryIndex(0);
          setGalleryWindowStart(0);
          return;
        }

        setVehicles(mergedVehicles);
        setActiveVehicleIndex(index);
        setActiveGalleryIndex(0);
        setGalleryWindowStart(0);
        setIsNotFound(false);
        setIsInvalidData(false);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadVehicles();

    return () => {
      isMounted = false;
    };
  }, [params.slug]);

  const currentVehicle = useMemo(() => vehicles[activeVehicleIndex] ?? null, [vehicles, activeVehicleIndex]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-primary text-secondary">
        <p className="font-glacial text-xl">Loading vehicle details...</p>
      </main>
    );
  }

  if (isNotFound || !currentVehicle) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-primary text-secondary">
        <p className="font-glacial text-2xl">Vehicle not found.</p>
        <Link href="/" className="font-bernoru rounded-full bg-secondary px-6 py-3 text-white">
          Back to Home
        </Link>
      </main>
    );
  }

  if (isInvalidData) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-primary px-4 text-center text-secondary">
        <p className="font-glacial text-2xl">Vehicle data is unavailable right now.</p>
        <Link href="/" className="font-bernoru rounded-full bg-secondary px-6 py-3 text-white">
          Back to Home
        </Link>
      </main>
    );
  }

  const selectedImage = currentVehicle.gallery[activeGalleryIndex] ?? currentVehicle.gallery[0] ?? currentVehicle.coverImage;
  const galleryItems = currentVehicle.gallery.length > 0 ? currentVehicle.gallery : [currentVehicle.coverImage];
  const desktopGalleryItems = getCarouselItems(galleryItems, galleryWindowStart, 2);
  const mobileGalleryItems = getCarouselItems(galleryItems, galleryWindowStart, 2);
  const pricingSlots: Array<VehicleViewModel["variants"][number] | null> = currentVehicle.variants.length > 0
    ? [currentVehicle.variants[0], currentVehicle.variants[1] ?? null]
    : [{ type: "N/A", price: 0, extraHourPrice: 0 }, null];

  function goPreviousVehicle(): void {
    if (vehicles.length === 0) {
      return;
    }

    const nextIndex = (activeVehicleIndex - 1 + vehicles.length) % vehicles.length;
    const nextVehicle = vehicles[nextIndex];

    setActiveVehicleIndex(nextIndex);
    setActiveGalleryIndex(0);
    setGalleryWindowStart(0);
    router.replace(`/vehicles/${nextVehicle.slug}`);
  }

  function goNextVehicle(): void {
    if (vehicles.length === 0) {
      return;
    }

    const nextIndex = (activeVehicleIndex + 1) % vehicles.length;
    const nextVehicle = vehicles[nextIndex];

    setActiveVehicleIndex(nextIndex);
    setActiveGalleryIndex(0);
    setGalleryWindowStart(0);
    router.replace(`/vehicles/${nextVehicle.slug}`);
  }

  function goPreviousGallery(): void {
    if (galleryItems.length <= 1) {
      return;
    }

    setGalleryWindowStart((previous) => (previous - 1 + galleryItems.length) % galleryItems.length);
  }

  function goNextGallery(): void {
    if (galleryItems.length <= 1) {
      return;
    }

    setGalleryWindowStart((previous) => (previous + 1) % galleryItems.length);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-primary text-secondary">
      <Image src={ASSETS.bookNow.bgMobile} alt="Book now mobile background" fill priority sizes="100vw" className="object-cover sm:hidden" />
      <Image src={ASSETS.bookNow.bg} alt="Book now background" fill priority sizes="100vw" className="hidden object-cover sm:block" />

      <section className="relative z-10 min-h-screen w-full p-2">
        <div className="parent hidden min-h-[calc(100vh-1rem)] w-full grid-cols-8 grid-rows-6 gap-2 sm:grid">
          <div className="div1 col-span-4 row-span-4 overflow-hidden rounded-[8px]">
            <div className="flex h-full w-full items-center justify-start pl-3">
              <button type="button" onClick={() => setOverlayImagePath(selectedImage)} className="relative h-full w-3/4">
                <VehicleImage path={selectedImage} alt={currentVehicle.name} sizes="38vw" className="object-contain" />
              </button>
            </div>
          </div>

          <div className="div2 col-start-5 row-span-2 rounded-[8px]" />

          <div className="div3 col-span-3 col-start-6 row-span-2 rounded-[8px]">
            <div className="flex h-full w-full flex-col items-center justify-center gap-3">
              <div className="flex items-center justify-center gap-4">
                <button type="button" onClick={() => setOverlayImagePath(currentVehicle.coverImage)} className="relative h-24 w-32">
                  <VehicleImage path={currentVehicle.coverImage} alt={`${currentVehicle.name} cover`} sizes="18vw" className="object-contain" />
                </button>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={goPreviousVehicle} className="text-secondary" aria-label="Previous vehicle">
                    <CaretLeftIcon />
                  </button>
                  <p className="font-batangas text-[clamp(1.8rem,3vw,3.2rem)] leading-[1]">{currentVehicle.name}</p>
                  <button type="button" onClick={goNextVehicle} className="text-secondary" aria-label="Next vehicle">
                    <CaretRightIcon />
                  </button>
                </div>
              </div>

              <p className="font-glacial text-[clamp(1.5rem,2.3vw,2.4rem)] leading-none tracking-[0.08em]">
                PASSENGERS : {formatPassengerDisplay(currentVehicle.capacity)}
              </p>
            </div>
          </div>

          <div className="div4 col-span-4 col-start-5 row-span-4 row-start-3 overflow-hidden rounded-[8px]">
            <div className="relative grid h-full w-full grid-rows-[auto_1fr]">
              <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-px -translate-x-1/2 bg-secondary/40" />

              <div className="grid grid-cols-2 bg-secondary text-white">
                {pricingSlots.map((variant, index) => (
                  <div key={`head-${currentVehicle.slug}-${index}`} className="flex h-14 items-center justify-center">
                    <p className="font-bernoru text-[clamp(1.1rem,1.5vw,1.6rem)] tracking-wide">
                      {variant ? (variant.type === "NON_AC" ? "NON A/C" : variant.type) : "-"}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid h-full grid-cols-2">
                {pricingSlots.map((variant, index) => (
                  <div
                    key={`body-${currentVehicle.slug}-${index}`}
                    className="flex h-full flex-col items-center justify-center gap-3 px-3 text-center"
                  >
                    {variant ? (
                      <>
                        <p className="font-glacial text-[clamp(1rem,1.25vw,1.25rem)]">One Day Package:</p>
                        <p className="font-glacial text-[clamp(1.7rem,2.2vw,2.2rem)] leading-none">₹{variant.price}</p>
                        <p className="font-glacial text-[clamp(1rem,1.2vw,1.2rem)]">Duration: {currentVehicle.durationHours} Hours</p>
                        <p className="font-glacial text-[clamp(1rem,1.2vw,1.2rem)]">Distance: {currentVehicle.distanceKm} KM</p>
                        <p className="font-glacial text-[clamp(1rem,1.2vw,1.2rem)]">+ ₹{variant.extraHourPrice} per extra hour</p>

                        <button
                          type="button"
                          onClick={() => console.log("Selected:", currentVehicle.slug, variant.type)}
                          className="font-bernoru mt-1 inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2 text-[clamp(0.95rem,1.1vw,1.15rem)] tracking-wide text-white"
                        >
                          <span>BOOK NOW</span>
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-secondary">
                            <CaretRightIcon />
                          </span>
                        </button>
                      </>
                    ) : (
                      <p className="font-glacial text-base">-</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="div5 col-span-3 row-span-2 row-start-5 overflow-hidden rounded-[8px]">
            <div className="grid h-full grid-cols-[auto_1fr_auto] items-center gap-2">
              <button type="button" onClick={goPreviousGallery} className="text-white" aria-label="Previous gallery images">
                <CaretLeftIcon />
              </button>

              <div className="grid h-full grid-cols-2 gap-2">
                {desktopGalleryItems.map((item) => (
                  <button
                    key={`desktop-gallery-${item.index}-${item.path}`}
                    type="button"
                    onClick={() => {
                      setActiveGalleryIndex(item.index);
                      setOverlayImagePath(item.path);
                    }}
                    className="relative h-full w-full overflow-hidden rounded-[8px]"
                  >
                    <div className="relative h-full w-full">
                      <VehicleImage path={item.path} alt={`${currentVehicle.name} ${item.index + 1}`} sizes="20vw" className="object-cover" />
                    </div>
                  </button>
                ))}
              </div>

              <button type="button" onClick={goNextGallery} className="text-white" aria-label="Next gallery images">
                <CaretRightIcon />
              </button>
            </div>
          </div>

          <div className="div6 col-start-4 row-span-2 row-start-5 rounded-[8px]" />
        </div>

        <div className="parent grid min-h-[calc(100vh-1rem)] w-full grid-cols-3 grid-rows-10 gap-2 sm:hidden">
          <div className="div1 col-span-3 rounded-[8px]">
            <div className="grid h-full grid-cols-[5.5rem_1fr] items-center gap-2">
              <button type="button" onClick={() => setOverlayImagePath(currentVehicle.coverImage)} className="relative h-full w-full overflow-hidden rounded-[8px]">
                <VehicleImage path={currentVehicle.coverImage} alt={`${currentVehicle.name} cover`} sizes="30vw" className="object-contain" />
              </button>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <button type="button" onClick={goPreviousVehicle} className="text-secondary" aria-label="Previous vehicle">
                    <CaretLeftIcon />
                  </button>
                  <p className="font-batangas text-[clamp(1.3rem,5.2vw,2rem)] leading-none">{currentVehicle.name}</p>
                  <button type="button" onClick={goNextVehicle} className="text-secondary" aria-label="Next vehicle">
                    <CaretRightIcon />
                  </button>
                </div>
                <p className="font-glacial mt-1 text-[clamp(1rem,3.9vw,1.4rem)] leading-none">PASSENGERS : {formatPassengerDisplay(currentVehicle.capacity)}</p>
              </div>
            </div>
          </div>

          <div className="div2 col-span-3 row-span-4 row-start-2 overflow-hidden rounded-[8px]">
            <div className="relative grid h-full w-full grid-rows-[auto_1fr]">
              <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-px -translate-x-1/2 bg-secondary/40" />

              <div className="grid grid-cols-2 bg-secondary text-white">
                {pricingSlots.map((variant, index) => (
                  <div key={`mobile-head-${currentVehicle.slug}-${index}`} className="flex h-11 items-center justify-center">
                    <p className="font-bernoru text-[clamp(0.95rem,3.7vw,1.1rem)]">{variant ? (variant.type === "NON_AC" ? "NON A/C" : variant.type) : "-"}</p>
                  </div>
                ))}
              </div>

              <div className="grid h-full grid-cols-2">
                {pricingSlots.map((variant, index) => (
                  <div key={`mobile-body-${currentVehicle.slug}-${index}`} className="flex h-full flex-col items-center justify-center gap-2 px-2 text-center">
                    {variant ? (
                      <>
                        <p className="font-glacial text-[clamp(0.82rem,3.1vw,0.95rem)]">One Day Package:</p>
                        <p className="font-glacial text-[clamp(1.2rem,4.2vw,1.5rem)] leading-none">₹{variant.price}</p>
                        <p className="font-glacial text-[clamp(0.78rem,2.8vw,0.9rem)]">Duration: {currentVehicle.durationHours} Hours</p>
                        <p className="font-glacial text-[clamp(0.78rem,2.8vw,0.9rem)]">Distance: {currentVehicle.distanceKm} KM</p>
                        <p className="font-glacial text-[clamp(0.78rem,2.8vw,0.9rem)]">+ ₹{variant.extraHourPrice} per extra hour</p>

                        <button
                          type="button"
                          onClick={() => console.log("Selected:", currentVehicle.slug, variant.type)}
                          className="font-bernoru inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-[clamp(0.78rem,3vw,0.9rem)] tracking-wide text-white"
                        >
                          <span>BOOK NOW</span>
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-secondary">
                            <CaretRightIcon />
                          </span>
                        </button>
                      </>
                    ) : (
                      <p className="font-glacial text-sm">-</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="div3 col-span-2 row-span-5 row-start-6 overflow-hidden rounded-[8px]">
            <div className="relative h-full w-full">
              <button type="button" onClick={() => setOverlayImagePath(selectedImage)} className="relative h-full w-full">
                <VehicleImage path={selectedImage} alt={currentVehicle.name} sizes="66vw" className="object-contain" />
              </button>
            </div>
          </div>

          <div className="div4 col-start-3 row-span-5 row-start-6 overflow-hidden rounded-[8px]">
            <div className="grid h-full grid-rows-[auto_1fr_auto] items-center gap-2">
              <button type="button" onClick={goPreviousGallery} className="mx-auto text-white" aria-label="Previous gallery images">
                <CaretUpIcon />
              </button>

              <div className="grid h-full grid-rows-2 gap-2">
                {mobileGalleryItems.map((item) => (
                  <button
                    key={`mobile-gallery-${item.index}-${item.path}`}
                    type="button"
                    onClick={() => {
                      setActiveGalleryIndex(item.index);
                      setOverlayImagePath(item.path);
                    }}
                    className="relative h-full w-full overflow-hidden rounded-[8px]"
                  >
                    <div className="relative h-full w-full">
                      <VehicleImage path={item.path} alt={`${currentVehicle.name} ${item.index + 1}`} sizes="22vw" className="object-cover" />
                    </div>
                  </button>
                ))}
              </div>

              <button type="button" onClick={goNextGallery} className="mx-auto text-white" aria-label="Next gallery images">
                <CaretDownIcon />
              </button>
            </div>
          </div>
        </div>
      </section>

      {overlayImagePath ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <button
            type="button"
            onClick={() => setOverlayImagePath(null)}
            className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-2 text-sm text-white"
          >
            Close
          </button>
          <div className="relative h-[85vh] w-[92vw]">
            <VehicleImage path={overlayImagePath} alt="Vehicle preview" sizes="92vw" className="object-contain" />
          </div>
        </div>
      ) : null}
    </main>
  );
}
