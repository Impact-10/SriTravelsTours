import Image from "next/image";

import { ASSETS } from "@/config/assets";

export function ReviewsSection() {
  return (
    <section
      id="reviews"
      className="w-full min-h-screen overflow-hidden border-b-4 border-secondary bg-primary text-secondary sm:overflow-x-hidden sm:overflow-y-visible"
    >
      <div
        className="parent grid min-h-screen w-full gap-2 p-0 sm:hidden"
        style={{
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gridTemplateRows: "repeat(12, minmax(0, 1fr))",
        }}
      >
        <div
          className="div3 relative h-full overflow-visible"
          style={{ gridColumn: "2 / span 3", gridRow: "1 / span 12" }}
        >
          <div className="absolute inset-0 flex items-center justify-end">
            <Image
              src={ASSETS.review.lowerWheelRotated}
              alt="Review wheel lower layer"
              width={900}
              height={900}
              className="absolute right-0 top-1/2 h-[34.4%] w-auto -translate-y-1/2 object-contain"
            />
          </div>

          <div className="absolute inset-0 flex items-center justify-end">
            <Image
              src={ASSETS.review.upperWheelRotated}
              alt="Review wheel upper layer"
              width={900}
              height={900}
              className="absolute right-0 top-1/2 h-[100%] w-auto -translate-y-1/2 object-contain"
            />
          </div>
        </div>

        <div
          className="div1 relative z-20 overflow-visible pl-2"
          style={{ gridColumnStart: 1, gridRow: "1 / span 6" }}
        >
          <svg
            viewBox="0 0 700 250"
            className="absolute left-0 top-[6%] h-[clamp(8.8rem,19vh,13rem)] w-[clamp(15.5rem,68vw,22rem)] -rotate-[12deg]"
            role="img"
            aria-label="Your Ride , Your Review"
          >
            <defs>
              <path id="review-arc-top-mobile" d="M 24 172 Q 250 5 530 112" />
              <path id="review-arc-bottom-mobile" d="M 24 234 Q 254 68 536 176" />
            </defs>
            <text fill="currentColor" style={{ fontFamily: "Batangas", fontWeight: 700, fontSize: "104px" }}>
              <textPath href="#review-arc-top-mobile" startOffset="0%">
                Your Ride,
              </textPath>
            </text>
            <text fill="currentColor" style={{ fontFamily: "Batangas", fontWeight: 700, fontSize: "104px" }}>
              <textPath href="#review-arc-bottom-mobile" startOffset="0%">
                Your Review
              </textPath>
            </text>
          </svg>
        </div>

        <div
          className="div4 relative z-20 flex flex-col justify-end overflow-visible pb-5 pl-2"
          style={{ gridColumnStart: 1, gridRow: "7 / span 6" }}
        >
          <div className="relative mb-2 h-[clamp(2.1rem,7vh,3.4rem)] w-[clamp(5.2rem,22vw,7.6rem)]">
            <Image src={ASSETS.hero.ride} alt="Ride icon" fill sizes="24vw" className="object-contain" />
          </div>
          <p className="font-batangas text-left leading-[1.05] text-[clamp(1.4rem,4.3vw,2rem)]">Your feedback fuels</p>
          <p className="font-batangas text-left leading-[1.05] text-[clamp(1.4rem,4.3vw,2rem)]">better trips</p>
        </div>
      </div>

      <div className="parent hidden min-h-screen w-full grid-cols-2 grid-rows-[auto_auto_repeat(8,auto)] gap-0 p-0 sm:grid">
        <div className="div1 row-span-2 col-start-1 row-start-1 relative z-20 flex items-end overflow-visible pl-[clamp(1rem,3vw,3rem)] pr-[2%] pb-0">
          <svg
            viewBox="0 0 700 250"
            className="h-[clamp(11rem,24vw,20rem)] w-[clamp(22rem,54vw,44rem)] origin-bottom-left -rotate-[12deg] translate-x-[clamp(0.5rem,2.5vw,2.5rem)] translate-y-[clamp(30%,38%,46%)]"
            role="img"
            aria-label="Your Ride , Your Review"
          >
            <defs>
              <path id="review-arc-top" d="M 24 172 Q 250 5 530 112" />
              <path id="review-arc-bottom" d="M 24 234 Q 254 68 536 176" />
            </defs>
            <text fill="currentColor" style={{ fontFamily: "Batangas", fontWeight: 700, fontSize: "104px" }}>
              <textPath href="#review-arc-top" startOffset="0%">
                Your Ride,
              </textPath>
            </text>
            <text fill="currentColor" style={{ fontFamily: "Batangas", fontWeight: 700, fontSize: "104px" }}>
              <textPath href="#review-arc-bottom" startOffset="0%">
                Your Review
              </textPath>
            </text>
          </svg>
        </div>

        <div className="div3 row-span-2 col-start-2 row-start-1 grid grid-cols-2 grid-rows-3 gap-2 overflow-visible px-[2%] pb-0">
          <p className="font-batangas col-span-2 row-start-1 self-end text-right leading-[1.05] text-[clamp(1.7rem,3.8vw,4.4rem)]">
            Your feedback fuels
          </p>

          <div className="relative row-span-2 row-start-2 col-start-1 overflow-visible">
            <Image
              src={ASSETS.hero.ride}
              alt="Ride icon"
              width={176}
              height={88}
              sizes="(max-width: 768px) 28vw, 12vw"
              className="absolute right-0 bottom-0 z-10 h-[clamp(6rem,11.5vw,11rem)] w-[clamp(10.8rem,23vw,23rem)] object-contain"
            />
          </div>

          <p className="font-batangas row-span-2 row-start-2 col-start-2 relative z-20 self-start text-right leading-[1.05] text-[clamp(1.7rem,3.8vw,4.4rem)]">
            better trips
          </p>
        </div>

        <div className="div2 col-span-2 row-span-8 col-start-1 row-start-3 relative flex items-end justify-center overflow-visible">
          <Image
            src={ASSETS.review.lowerWheel}
            alt="Review wheel lower layer"
            width={2022}
            height={1011}
            sizes="100vw"
            className="absolute left-1/2 bottom-0 h-auto w-[30%] -translate-x-1/2 object-contain"
          />
          <Image
            src={ASSETS.review.upperWheel}
            alt="Review wheel upper layer"
            width={1011}
            height={505}
            sizes="100vw"
            className="relative z-10 h-auto w-[94%] object-contain"
          />
        </div>
      </div>
    </section>
  );
}
