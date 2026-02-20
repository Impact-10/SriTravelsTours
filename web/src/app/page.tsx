import { Navbar } from "@/components/layout/Navbar";
import { AboutSection } from "@/components/sections/AboutSection";
import { ChooseRideSection } from "@/components/sections/ChooseRideSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";

export default function HomePage() {
  return (
    <main className="bg-primary text-secondary">
      <Navbar />
      <HeroSection />
      <ChooseRideSection />
      <ReviewsSection />
      <AboutSection />
    </main>
  );
}
