"use client";

import { Trash2 } from "lucide-react";
import type { ResolvedCartItem } from "@/lib/types";
import { formatEUR, formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";
import {
  getProductDisplaySubtitle,
  getProductDisplayTitle,
} from "@/lib/product-display";
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
    isPack,
    piecesPerPack,
    unitLabel,
    packUnit,
  } = line;

  const unitLine =
    unitPrice === null
      ? "Prix sur demande"
      : isPalette
        ? `${formatEUR(unitPrice)} / palette · ${piecesPerPalette} pièces`
        : isPack
          ? packUnit === "carton"
            ? `${formatEUR(unitPrice)} / carton · ${piecesPerPack} pièces`
            : `${formatEUR(unitPrice)} / sachet · ${piecesPerPack} pièces`
          : `${formatEUR(unitPrice)} / ${unitLabel} HTVA`;

  const quantityLabel = isPalette
    ? "Nombre de palettes"
    : isPack
      ? packUnit === "carton"
        ? "Nombre de cartons"
        : "Nombre de sachets"
      : "Quantité";

  const piecesTotal =
    isPalette && piecesPerPalette
      ? quantity * piecesPerPalette
      : isPack && piecesPerPack
        ? quantity * piecesPerPack
        : null;

  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start">
      <div className="min-w-0 flex-1">
        <p className="break-words text-sm font-semibold text-forest-dark">
          {getProductDisplayTitle(product)}
        </p>
        {getProductDisplaySubtitle(product) && (
          <p className="break-words text-xs text-bark-muted">
            {getProductDisplaySubtitle(product)}
          </p>
        )}
        <p className="break-words text-xs text-bark-muted">{category.title}</p>
        <p className="mt-1 break-words text-xs text-bark-muted">{unitLine}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
          <QuantityStepper
            value={quantity}
            onChange={(q) => setQuantity(product.id, q, packUnit)}
            size="sm"
            label={quantityLabel}
          />
          {piecesTotal !== null ? (
            <span className="text-xs text-bark-muted">
              = {piecesTotal} pièce{piecesTotal > 1 ? "s" : ""}
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => removeItem(product.id, packUnit)}
            className="inline-flex min-h-11 items-center gap-1 text-xs text-bark-muted transition-colors hover:text-terracotta cursor-pointer"
            aria-label={`Retirer ${product.label} du panier`}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Retirer
          </button>
        </div>
      </div>
      <div className="flex w-full shrink-0 items-center justify-between gap-3 border-t border-sand-200 pt-3 sm:w-auto sm:block sm:border-0 sm:pt-0 sm:text-right">
        <span className="text-xs font-medium text-bark-muted sm:hidden">Sous-total</span>
        <p className="text-base font-semibold tabular-nums whitespace-nowrap text-forest-dark sm:text-sm">
          {lineTotal !== null ? formatEUR(lineTotal) : formatPrice(unitPrice)}
        </p>
      </div>
    </div>
  );
}
