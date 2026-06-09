"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ShoppingCart, X } from "lucide-react";
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

/**
 * Floating "Voir le panier" button + slide-over drawer for the catalogue page.
 * Hidden until the cart has been hydrated and contains items.
 */
export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const hydrated = useCartStore((s) => s.hydrated);
  const resolved = resolveCartItems(items);
  const total = selectCartTotalHTVA(resolved);
  const count = selectItemCount(items);
  const onRequest = hasOnRequestPricing(resolved);

  if (!hydrated || count === 0) return null;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-forest-dark cursor-pointer xl:hidden"
        >
          <ShoppingCart className="h-5 w-5" aria-hidden="true" />
          {count} · {formatEUR(total)}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-bark/40 data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-sand shadow-xl">
          <div className="flex items-center justify-between border-b border-sand-300 px-5 py-4">
            <Dialog.Title className="font-display text-lg font-semibold text-forest-dark">
              Votre sélection
            </Dialog.Title>
            <Dialog.Close
              className="grid h-10 w-10 place-items-center rounded-full text-bark-muted hover:bg-sand-200 cursor-pointer"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          <div className="flex-1 divide-y divide-sand-200 overflow-y-auto px-5">
            {resolved.map((line) => (
              <CartLineItem key={line.product.id} line={line} />
            ))}
          </div>

          <div className="border-t border-sand-300 bg-white px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-bark-muted">Total estimatif HTVA</span>
              <span className="font-display text-xl font-semibold text-forest-dark">
                {formatEUR(total)}
              </span>
            </div>
            {onRequest && (
              <p className="mt-1 text-xs text-bark-muted">
                Certains articles sont au prix « sur demande » et ne sont pas inclus dans
                le total.
              </p>
            )}
            <PrimaryButton
              href="/panier"
              size="lg"
              className="mt-4 w-full"
              onClick={() => setOpen(false)}
            >
              Demander un devis matériaux
            </PrimaryButton>
            <p className="mt-2 text-center text-xs text-bark-muted">
              Estimation indicative — ceci n’est pas une commande.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
