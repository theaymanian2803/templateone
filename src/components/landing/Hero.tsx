import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onBuyClick: () => void;
}

export const Hero = ({ onBuyClick }: HeroProps) => {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-12 bg-hero overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-4xl px-6"
      >
        <span className="inline-block text-xs uppercase tracking-[0.2em] text-brand mb-6">
          For iPhone 17 Pro Max
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-gradient leading-[0.95]">
          Ultimate Protection.
          <br />
          Zero Compromise.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Engineered from aerospace-grade materials. Designed to disappear in your hand and stand up to anything life throws at it.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={onBuyClick}
            className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-8 h-12 text-base font-medium"
          >
            Buy Now — $59
          </Button>
          <a href="#design" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Learn more →
          </a>
        </div>
      </motion.div>
    </section>
  );
};
