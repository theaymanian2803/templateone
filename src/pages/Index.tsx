import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { StickyShowcase } from "@/components/landing/StickyShowcase";
import { VideoShowcase } from "@/components/landing/VideoShowcase";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { BuyModal } from "@/components/landing/BuyModal";

const Index = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onBuyClick={() => setOpen(true)} />
      <main>
        <Hero onBuyClick={() => setOpen(true)} />
        <StickyShowcase />
        <VideoShowcase />
        <FeaturesGrid />
        <FinalCTA onBuyClick={() => setOpen(true)} />
      </main>
      <BuyModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default Index;
