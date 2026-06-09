"use client";

import { ShoppingCart } from "lucide-react";
import {
  useCartStore,
  resolveCartItems,
  selectCartTotalHTVA,
  selectItemCount,
  hasOnRequestPricing,
} from "@/lib/cart-store";
import { formatEUR } from "@/lib/format";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { PrimaryButton } from "@/components/ui/Button";

/** Sticky cart summary (desktop sidebar on the catalogue page). */
export function CartSummary() {
  const items = useCartStore((s) => s.items);
  const hydrated = useCartStore((s) => s.hydrated);
  const resolved = resolveCartItems(items);
  const total = selectCartTotalHTVA(resolved);
  const count = selectItemCount(items);
  const onRequest = hasOnRequestPricing(resolved);

  return (
    <aside className="sticky top-20 rounded-card border border-sand-300 bg-white shadow-card">
      <div className="flex items-center gap-2 border-b border-sand-200 px-5 py-4">
        <ShoppingCart className="h-5 w-5 text-forest" aria-hidden="true" />
        <h2 className="font-display text-lg font-semibold text-forest-dark">
          Votre sélection
        </h2>
      </div>

      {!hydrated ? (
        <p className="px-5 py-8 text-sm text-bark-muted">Chargement…</p>
      ) : count === 0 ? (
        <p className="px-5 py-8 text-sm text-bark-muted">
          Votre panier est vide. Ajoutez des produits pour composer votre devis.
        </p>
      ) : (
        <>
          <div className="max-h-[50vh] divide-y divide-sand-200 overflow-y-auto px-5">
            {resolved.map((line) => (
              <CartLineItem key={line.product.id} line={line} />
            ))}
          </div>
          <div className="border-t border-sand-200 px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-bark-muted">Total estimatif HTVA</span>
              <span className="font-display text-xl font-semibold text-forest-dark">
                {formatEUR(total)}
              </span>
            </div>
            {onRequest && (
              <p className="mt-1 text-xs text-bark-muted">
                Articles « sur demande » non inclus dans le total.
              </p>
            )}
            <PrimaryButton href="/panier" size="lg" className="mt-4 w-full">
              Demander un devis matériaux
            </PrimaryButton>
            <p className="mt-2 text-center text-xs text-bark-muted">
              Estimation indicative — ceci n’est pas une commande.
            </p>
          </div>
        </>
      )}
    </aside>
  );
}
