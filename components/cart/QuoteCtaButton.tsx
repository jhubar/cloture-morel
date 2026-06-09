"use client";

import { useCartStore, selectItemCount } from "@/lib/cart-store";
import { PrimaryButton } from "@/components/ui/Button";

interface QuoteCtaButtonProps {
  size?: "md" | "lg";
  className?: string;
  onClick?: () => void;
}

/** Routes to /panier when the cart has items, otherwise /catalogue. */
export function QuoteCtaButton({ size = "md", className, onClick }: QuoteCtaButtonProps) {
  const hydrated = useCartStore((s) => s.hydrated);
  const count = useCartStore((s) => selectItemCount(s.items));
  const hasItems = hydrated && count > 0;

  return (
    <PrimaryButton
      href={hasItems ? "/panier" : "/catalogue"}
      size={size}
      className={className}
      onClick={onClick}
    >
      {hasItems ? "Finaliser mon devis" : "Demander un devis"}
    </PrimaryButton>
  );
}
