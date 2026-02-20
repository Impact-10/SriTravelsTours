"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ASSETS } from "@/config/assets";
import { getVehicles } from "@/lib/firebase/vehicles";
import type { Vehicle } from "@/types/vehicle";

function buildVehicleImage(path: string): string {
  return `/assets/vehicles/${path}`;
}

function getVisibleCount(width: number): number {
  if (width < 640) {
    return 1;
  }

  if (width < 1024) {
    return 2;
  }

  return 3;
}

export function ChooseRideSection() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    let isMounted = true;

    async function loadVehicles(): Promise<void> {
      const data = await getVehicles();

      if (!isMounted) {
        return;
      }

      setVehicles(data);
    }

    void loadVehicles();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    function updateVisibleCount(): void {
      setVisibleCount(getVisibleCount(window.innerWidth));
    }

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);

    return () => {
      window.removeEventListener("resize", updateVisibleCount);
    };
  }, []);

  const visibleVehicles = useMemo(() => {
    if (vehicles.length === 0) {
      return [] as Vehicle[];
    }

    const count = Math.min(visibleCount, vehicles.length);

    return Array.from({ length: count }, (_, offset) => {
      const index = (activeIndex + offset) % vehicles.length;
      return vehicles[index];
    });
  }, [vehicles, activeIndex, visibleCount]);

  function goPrevious(): void {
    if (vehicles.length === 0) {
      return;
    }

    setActiveIndex((previous) => (previous - 1 + vehicles.length) % vehicles.length);
  }

  function goNext(): void {
    if (vehicles.length === 0) {
      return;
    }

    setActiveIndex((previous) => (previous + 1) % vehicles.length);
  }

  return (
    <section id="choose-ride" className="min-h-screen w-full overflow-x-hidden bg-primary text-secondary">
      <div className="parent relative grid min-h-screen w-full grid-cols-1 grid-rows-6 gap-2">
        <div className="div1 row-span-2 overflow-hidden">
          <div className="relative grid h-full w-full grid-cols-[1fr_auto] items-center overflow-visible">
            <div className="relative z-10 flex h-full items-end pl-3 pr-2 md:pl-4 lg:pl-5">
              <h2 className="font-batangas text-[clamp(3rem,14vw,6.4rem)] leading-[0.92] lg:hidden">
                <span className="block">Choose.</span>
                <span className="block">Cruise.</span>
                <span className="block">Arrive.</span>
              </h2>

              <h2 className="font-batangas hidden text-[clamp(2.8rem,5.2vw,6rem)] leading-[0.95] lg:block">Choose. Cruise. Arrive.</h2>
            </div>

            <div className="relative z-20 h-[125%] w-[clamp(10rem,42vw,24rem)] -translate-x-[24%] overflow-visible">
              <Image src={ASSETS.hero.ride} alt="Ride" fill sizes="(max-width: 1024px) 46vw, 24vw" className="object-contain -scale-x-100" />
            </div>
          </div>
        </div>

        <div className="div2 relative row-start-3 overflow-visible">
          <div className="absolute inset-x-0 top-0 z-20 h-[calc(200%+0.5rem)]">
            <div className="grid h-full w-full grid-cols-1 items-end justify-items-center gap-3 pb-2 sm:grid-cols-2 lg:grid-cols-3">
              {visibleVehicles.map((vehicle, index) => {
                const isPrimary = index === 0;
                const isSingleMobileCard = visibleCount === 1;

                const cardClass = isSingleMobileCard
                  ? "relative h-[96%] w-[min(92vw,36rem)]"
                  : isPrimary
                    ? "relative h-[90%] w-[clamp(11rem,26vw,22rem)]"
                    : "relative h-[80%] w-[clamp(10rem,22vw,18rem)] opacity-90";

                return (
                  <div
                    key={`${vehicle.slug}-${index}`}
                    className={cardClass}
                    style={{
                      transform: isPrimary ? "scale(1)" : "scale(0.97)",
                      transition: "transform 420ms cubic-bezier(0.22, 1.2, 0.36, 1)",
                    }}
                  >
                    <Image
                      src={buildVehicleImage(vehicle.coverImage)}
                      alt={vehicle.name}
                      fill
                      sizes="(max-width: 640px) 72vw, (max-width: 1024px) 36vw, 24vw"
                      className="object-contain"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="div3 relative row-start-4 overflow-visible">
          <div className="absolute inset-x-0 top-0 z-0 h-[calc(200%+0.5rem)] overflow-hidden">
            <Image src={ASSETS.chooseYourRide.road} alt="Road" fill sizes="100vw" className="object-cover object-center" />
          </div>

          <div className="absolute inset-x-0 top-0 z-30 flex h-[calc(200%+0.5rem)] items-center justify-between">
            <button
              type="button"
              onClick={goPrevious}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white"
              aria-label="Previous vehicle"
            >
              ←
            </button>
            <button
              type="button"
              onClick={goNext}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white"
              aria-label="Next vehicle"
            >
              →
            </button>
          </div>
        </div>

        <div className="div4 relative row-start-5 z-20">
          <div className="grid h-full w-full grid-cols-1 items-center justify-items-center gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleVehicles.map((vehicle) => (
              <p key={`name-${vehicle.slug}`} className="font-batangas bg-primary/80 px-3 py-1 text-[clamp(1.4rem,3.2vw,2.2rem)]">
                {vehicle.name}
              </p>
            ))}
          </div>
        </div>

        <div className="div5 row-start-6 z-20">
          <div className="grid h-full w-full grid-cols-1 items-center justify-items-center gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleVehicles.map((vehicle) => (
              <button
                key={`btn-${vehicle.slug}`}
                type="button"
                onClick={() => router.push(`/vehicles/${vehicle.slug}`)}
                className="font-bernoru rounded-full bg-secondary px-8 py-3 text-xl tracking-wide text-white"
              >
                BOOK NOW
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
