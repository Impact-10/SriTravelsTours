"use client";

import { useEffect, useMemo, useState } from "react";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "choose-ride", label: "Choose your ride" },
  { id: "reviews", label: "Reviews" },
  { id: "about-us", label: "About us" },
] as const;

function scrollToSection(sectionId: string): void {
  const section = document.getElementById(sectionId);

  if (!section) {
    return;
  }

  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Navbar() {
  const [activeSection, setActiveSection] = useState<(typeof NAV_ITEMS)[number]["id"]>("home");

  useEffect(() => {
    const observedSections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (value): value is HTMLElement => value !== null,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id as (typeof NAV_ITEMS)[number]["id"]);
        }
      },
      {
        root: null,
        rootMargin: "-25% 0px -45% 0px",
        threshold: [0.2, 0.45, 0.7],
      },
    );

    observedSections.forEach((section) => observer.observe(section));

    return () => {
      observedSections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, []);

  const navItems = useMemo(() => NAV_ITEMS, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[1000] w-full">
      <nav className="flex w-full bg-secondary py-[1.1%]">
        <div className="flex w-full items-center justify-end px-[1.5%]">
          <ul className="flex w-full flex-wrap items-center justify-end gap-[0.75%]">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`font-batangas rounded-full px-[1.1rem] py-[0.45rem] text-[clamp(0.74rem,1.15vw,0.95rem)] transition-all duration-300 ${
                    isActive ? "bg-white text-secondary" : "bg-transparent text-white"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
          </ul>
        </div>
      </nav>
    </header>
  );
}
