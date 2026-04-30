import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onBuyClick: () => void;
}

export const Navbar = ({ onBuyClick }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b hairline" : "bg-transparent"
      }`}
    >
      <nav className="container flex h-14 items-center justify-between">
        <a href="#" className="text-sm font-semibold tracking-tight">
          ARCSHIELD<span className="text-brand">.</span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#design" className="hover:text-foreground transition-colors">Design</a>
          <a href="#showcase" className="hover:text-foreground transition-colors">Showcase</a>
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
        </div>
        <Button
          size="sm"
          onClick={onBuyClick}
          className="rounded-full bg-foreground text-background hover:bg-foreground/90 font-medium"
        >
          Buy Now
        </Button>
      </nav>
    </header>
  );
};
