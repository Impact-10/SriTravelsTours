import Image from "next/image";

import { ASSETS } from "@/config/assets";

export function AboutSection() {
  return (
    <section id="about-us" className="relative min-h-screen overflow-hidden bg-primary text-secondary">
      <div className="absolute bottom-0 left-0 z-0 h-[80vh] w-[80vw] pointer-events-none">
        <Image
          src={ASSETS.hero.temple}
          alt="Temple"
          fill
          sizes="80vw"
          className="object-contain object-left-bottom"
        />
      </div>

      <div className="relative z-10 h-full w-full px-6 pt-[14vh] md:pt-[15vh] lg:px-12 lg:pt-[11vh]">
        <div className="ml-auto flex w-full max-w-[min(90vw,40rem)] flex-col items-end gap-4 text-right">
          <h2 className="font-batangas text-[clamp(1.7rem,3.7vw,3rem)]">About us:</h2>
          <p className="font-batangas text-[clamp(1rem,1.5vw,1.25rem)] leading-[1.35]">
            Sri Travels Tours offers trusted local and outstation rides with a focus on safety, comfort, and timely
            service. We provide clean vehicles, experienced drivers, and smooth booking support for every trip.
          </p>
        </div>
      </div>
    </section>
  );
}
