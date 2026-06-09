"use client";

import { Trash2 } from "lucide-react";
import type { ResolvedCartItem } from "@/lib/types";
import { formatEUR, formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";
import { QuantityStepper } from "@/components/ui/QuantityStepper";

interface CartLineItemProps {
  line: ResolvedCartItem;
}

export function CartLineItem({ line }: CartLineItemProps) {
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const {
    product,
    category,
    quantity,
    unitPrice,
    lineTotal,
    isPalette,
    piecesPerPalette,
  } = line;

  const unitLine =
    unitPrice === null
      ? "Prix sur demande"
      : isPalette
        ? `${formatEUR(unitPrice)} / palette · ${piecesPerPalette} pièces`
        : `${formatEUR(unitPrice)} / unité HTVA`;

  return (
    <div className="flex gap-3 py-4">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-forest-dark">
          {product.reference || product.label}
        </p>
        <p className="truncate text-xs text-bark-muted">{category.title}</p>
        <p className="mt-1 text-xs text-bark-muted">{unitLine}</p>
        <div className="mt-2 flex items-center gap-3">
          <QuantityStepper
            value={quantity}
            onChange={(q) => setQuantity(product.id, q)}
            size="sm"
            label={isPalette ? "Nombre de palettes" : "Quantité"}
          />
          {isPalette && piecesPerPalette ? (
            <span className="text-xs text-bark-muted">
              = {quantity * piecesPerPalette} pièces
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => removeItem(product.id)}
            className="inline-flex items-center gap-1 text-xs text-bark-muted transition-colors hover:text-terracotta cursor-pointer"
            aria-label={`Retirer ${product.label} du panier`}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Retirer
          </button>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-forest-dark">
          {lineTotal !== null ? formatEUR(lineTotal) : formatPrice(unitPrice)}
        </p>
      </div>
    </div>
  );
}
