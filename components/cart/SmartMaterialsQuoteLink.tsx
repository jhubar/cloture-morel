"use client";

import Link from "next/link";
import { useCartStore, selectItemCount } from "@/lib/cart-store";

export function SmartMaterialsQuoteLink({
  className,
  children = "Devis matériaux",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const hydrated = useCartStore((s) => s.hydrated);
  const count = useCartStore((s) => selectItemCount(s.items));
  const href = hydrated && count > 0 ? "/panier" : "/catalogue";

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
