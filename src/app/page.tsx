import { MaxWrapper } from "@/components/max-wrapper";
import HeroSection from "./_components/hero-section";

export default function Home() {
  return (
    <MaxWrapper className="flex flex-col gap-3 md:gap-5">
      <HeroSection />
    </MaxWrapper>
  );
}
