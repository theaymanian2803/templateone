import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useProducts } from "@/lib/products";

interface BuyModalProps {
  open: boolean;
  onClose: () => void;
}

export const BuyModal = ({ open, onClose }: BuyModalProps) => {
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const products = useProducts();
  const featured = products[0];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Order placed",
      description: `Cash on Delivery confirmed for ${form.name}. We'll call ${form.phone} to schedule.`,
    });
    onClose();
    setForm({ name: "", phone: "", address: "" });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md rounded-3xl bg-surface border hairline shadow-card overflow-hidden"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-surface-elevated flex items-center justify-center transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-semibold tracking-tight">Complete your order</h3>

              <div className="mt-2 inline-flex items-center gap-2 text-xs text-brand">
                <span className="w-1.5 h-1.5 rounded-full bg-brand" /> Cash on Delivery
              </div>

              <div className="mt-4 flex items-center gap-4 p-4 rounded-2xl bg-surface-elevated">
                <img
                  src={featured?.image ?? "https://placehold.co/200x200/0a0a0a/1a1a1a?text=Case"}
                  alt={featured?.name ?? "Case"}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{featured?.name ?? "iPhone 17 Pro Max Case"}</p>
                  <p className="text-xs text-muted-foreground">Pay on delivery</p>
                </div>
                <p className="text-sm font-semibold">${(featured?.price ?? 59).toFixed(2)}</p>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    required
                    maxLength={100}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    maxLength={20}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 555 123 4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Shipping address</Label>
                  <Input
                    id="address"
                    required
                    maxLength={250}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="123 Main St, City, Country"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90 h-12 font-medium mt-2"
                >
                  Place Order — ${(featured?.price ?? 59).toFixed(2)} COD
                </Button>
                <p className="text-[11px] text-center text-muted-foreground">
                  Cash on Delivery. No payment now. 30-day returns.
                </p>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
