import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export const FinalCTA = ({ onBuyClick }: { onBuyClick: () => void }) => {
  return (
    <section className="py-24 md:py-40 bg-hero">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="container text-center max-w-3xl"
      >
        <h2 className="text-5xl md:text-7xl font-semibold tracking-tight text-gradient leading-[1]">
          Yours. For $59.
        </h2>
        <p className="mt-6 text-lg text-muted-foreground">
          Free worldwide shipping. Lifetime warranty. 30-day returns.
        </p>
        <Button
          size="lg"
          onClick={onBuyClick}
          className="mt-10 rounded-full bg-foreground text-background hover:bg-foreground/90 px-10 h-14 text-base font-medium"
        >
          Buy Now
        </Button>
      </motion.div>
      <footer className="container mt-24 pt-8 border-t hairline text-center text-xs text-muted-foreground">
        © 2026 ArcShield. iPhone is a trademark of Apple Inc.
      </footer>
    </section>
  );
};
