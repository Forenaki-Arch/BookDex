import { LandingNav } from "@/components/landing/landing-nav";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FAQ } from "@/components/landing/faq";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

// Landing page pubblica di BookDex
export default function LandingPage() {
  return (
    <>
      <LandingNav />
      <main className="overflow-x-hidden">
        <Hero />
        <div id="features">
          <Features />
        </div>
        <div id="how">
          <HowItWorks />
        </div>
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
