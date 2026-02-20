"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { ASSETS } from "@/config/assets";

function scrollToChooseRide(): void {
  document.getElementById("choose-ride")?.scrollIntoView({
    behavior: "smooth",
  });
}

export function HeroSection() {
  const router = useRouter();

  function goToBookNow(): void {
    router.push("/vehicles/innova");
  }

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-primary">
      <div className="relative z-10 w-full px-4 pb-[8vh] pt-[12vh] md:px-6 md:pb-[9vh] md:pt-[13vh] lg:hidden">
        <div className="parent grid w-full grid-cols-2 grid-rows-15 gap-2">
          <div className="div1 col-span-2 row-span-2 row-start-1 pb-[10px] text-center">
            <h1 className="font-glacial mx-auto max-w-[92%] leading-[1.06] text-[clamp(1.65rem,8.2vw,2.75rem)] text-secondary">
              <span className="block">From Thanjavur, Your Journey Begins with</span>
              <span className="font-cs-roger mt-[0.3em] block text-[0.78em] leading-[1.34] sm:text-[0.92em] sm:leading-[1.18]">Sri Travels Tours</span>
            </h1>
          </div>

          <div className="div2 col-span-2 row-start-3 pb-[10px] text-center">
            <h2 className="font-glacial mx-auto max-w-[94%] leading-[1.05] text-[clamp(1.05rem,4.9vw,1.7rem)] text-secondary">
              Safe. Comfortable. Reliable.
            </h2>
          </div>

          <div className="div3 relative col-span-2 row-span-6 row-start-4 min-h-[clamp(16rem,44vw,22rem)] overflow-visible pb-[12px] pt-[12px]">
            <Image src={ASSETS.hero.temple} alt="Temple" fill priority sizes="100vw" className="object-contain object-left-bottom" />

            <div className="absolute right-3 top-3">
              <div className="inline-flex items-center gap-0">
                <div className="pointer-events-none relative z-20 -mr-[1.6rem] w-[5.2rem] shrink-0">
                  <div className="relative aspect-[16/9] w-full scale-[1.62] origin-center">
                    <Image src={ASSETS.hero.ride} alt="Ride decoration" fill sizes="26vw" className="object-contain" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={goToBookNow}
                  className="font-bernoru relative z-10 inline-flex items-center gap-[0.5rem] rounded-full bg-secondary px-[1.2rem] py-[0.65rem] text-[clamp(0.75rem,2.8vw,0.95rem)] tracking-wide text-white transition-transform duration-300 hover:scale-[1.03]"
                >
                  <span>BOOK NOW</span>
                  <span className="inline-flex h-[1.7em] w-[1.7em] items-center justify-center rounded-full bg-white text-secondary">
                    <svg viewBox="0 0 24 24" className="h-[0.85em] w-[0.85em]" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="div4 col-span-2 row-span-6 row-start-10 space-y-4 pb-[10px] text-center">
            <p className="font-imfell text-[clamp(1rem,4.2vw,1.25rem)] uppercase tracking-[0.16em] text-secondary">Ride to</p>
            <h2 className="font-imfell italic leading-[0.95] text-[clamp(2rem,10vw,3.3rem)] text-secondary">Your Destination from Thanjai</h2>
            <p className="font-imfell px-1 text-center text-[clamp(1.05rem,4.5vw,1.35rem)] leading-[1.26] text-secondary/90">
              A UNESCO World Heritage Site and one of India’s greatest architectural wonders. Whether you’re visiting
              for devotion, tourism, or history — we ensure a smooth journey right to the temple entrance.
            </p>
            <p className="font-imfell italic text-[clamp(1rem,4.4vw,1.25rem)] text-secondary/95">Thanjavur, Tamil Nadu</p>

            <div className="mx-auto w-fit">
              <button
                type="button"
                onClick={scrollToChooseRide}
                className="font-bernoru relative inline-flex items-center gap-[0.7rem] rounded-full bg-secondary px-[1.35rem] py-[0.75rem] text-[clamp(0.78rem,3.2vw,1rem)] tracking-wide text-white transition-transform duration-300 hover:scale-[1.03]"
              >
                <span className="inline-flex flex-col leading-[1.05]">
                  <span>VIEW MY RIDE</span>
                  <span>OPTIONS</span>
                </span>
                <span className="inline-flex h-[1.8em] w-[1.8em] items-center justify-center rounded-full bg-white text-secondary">
                  <svg viewBox="0 0 24 24" className="h-[0.9em] w-[0.9em]" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 hidden h-full w-full px-6 pb-[8vh] pt-[11vh] lg:block lg:px-12">
        <div className="parent grid min-h-[78vh] w-full grid-cols-5 grid-rows-8 gap-2">
          <div className="div1 col-span-3 row-span-2 space-y-3 pb-[10px] text-left">
            <h1 className="font-glacial max-w-[95%] leading-[1.08] text-[clamp(2rem,3.5vw,3.35rem)] text-secondary lg:max-w-[92%]">
              <span className="block">Begins with</span>
              <span className="font-cs-roger mt-[0.24em] block leading-[1.18]">Sri Travels Tours</span>
            </h1>
            <h2 className="font-glacial max-w-[85%] leading-[1.08] text-[clamp(1.3rem,2.2vw,2.25rem)] text-secondary lg:max-w-[85%]">
              Safe. Comfortable. Reliable.
            </h2>
          </div>

          <div className="div2 relative col-span-3 row-span-6 col-start-1 row-start-3 overflow-visible pb-[10px]">
            <div className="pointer-events-none absolute bottom-0 left-0 h-full w-[80vw]">
              <Image src={ASSETS.hero.temple} alt="Temple" fill priority sizes="80vw" className="object-contain object-left-bottom" />
            </div>

            <div className="absolute right-[6%] top-[8%] z-20 inline-block w-fit">
              <div className="inline-flex items-center gap-0">
                <div className="pointer-events-none relative z-20 -mr-[3.1rem] w-[7.4rem] shrink-0 md:-mr-[3.4rem] md:w-[8.2rem] lg:-mr-[3.7rem] lg:w-[8.8rem]">
                  <div className="relative aspect-[16/9] w-full scale-[2] origin-center">
                    <Image src={ASSETS.hero.ride} alt="Ride decoration" fill sizes="(max-width: 1024px) 38vw, 13vw" className="object-contain" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={goToBookNow}
                  className="font-bernoru relative z-10 inline-flex items-center gap-[0.72rem] rounded-full bg-secondary px-[1.8rem] py-[0.95rem] text-[clamp(0.9rem,1.05vw,1.06rem)] tracking-wide text-white transition-transform duration-300 hover:scale-[1.03] md:px-[2.35rem] md:py-[1.08rem]"
                >
                  <span>BOOK NOW</span>
                  <span className="inline-flex h-[1.9em] w-[1.9em] items-center justify-center rounded-full bg-white text-secondary">
                    <svg viewBox="0 0 24 24" className="h-[0.95em] w-[0.95em]" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="div3 col-span-2 row-span-8 col-start-4 row-start-1 flex items-center pb-[10px] text-left">
            <div className="w-full space-y-7">
              <p className="font-imfell text-[clamp(1rem,1.15vw,1.2rem)] uppercase tracking-[0.16em] text-secondary">Ride to</p>
              <h2 className="font-imfell italic leading-[0.95] text-[clamp(2rem,4vw,4.1rem)] text-secondary">Your Destination from Thanjai</h2>
              <p className="font-imfell text-justify text-[clamp(1.05rem,1.2vw,1.42rem)] leading-[1.28] text-secondary/90">
                A UNESCO World Heritage Site and one of India’s greatest architectural wonders. Whether you’re
                visiting for devotion, tourism, or history — we ensure a smooth journey right to the temple entrance.
              </p>
              <p className="font-imfell italic text-[clamp(1rem,1.2vw,1.28rem)] text-secondary/95">Thanjavur, Tamil Nadu</p>

              <div className="mx-auto w-fit lg:ml-auto lg:mr-0">
                <button
                  type="button"
                  onClick={scrollToChooseRide}
                  className="font-bernoru relative inline-flex items-center gap-[0.75rem] rounded-full bg-secondary px-[1.75rem] py-[0.95rem] text-[clamp(0.78rem,1.1vw,1rem)] tracking-wide text-white transition-transform duration-300 hover:scale-[1.03] md:px-[2.3rem] md:py-[1.1rem]"
                >
                  <span className="inline-flex flex-col leading-[1.05]">
                    <span>VIEW MY RIDE</span>
                    <span>OPTIONS</span>
                  </span>
                  <span className="inline-flex h-[1.9em] w-[1.9em] items-center justify-center rounded-full bg-white text-secondary">
                    <svg viewBox="0 0 24 24" className="h-[0.95em] w-[0.95em]" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </span>
                </button>
              </div>

              <div className="font-batangas pt-1 text-right leading-[1.05] text-secondary">
                <p className="text-[clamp(1rem,1.15vw,1.2rem)]">call us on</p>
                <p className="text-[clamp(1.4rem,1.8vw,1.9rem)]">77088 44200</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
