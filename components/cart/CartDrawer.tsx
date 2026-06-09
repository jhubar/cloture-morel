"use client";

import { useEffect, useState } from "react";
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
 * Opens automatically only when the first item is added; later adds update the FAB
 * without reopening the drawer. Hidden until hydrated and non-empty.
 */
export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const drawerOpenNonce = useCartStore((s) => s.drawerOpenNonce);
  const items = useCartStore((s) => s.items);
  const hydrated = useCartStore((s) => s.hydrated);
  const resolved = resolveCartItems(items);
  const total = selectCartTotalHTVA(resolved);
  const count = selectItemCount(items);
  const onRequest = hasOnRequestPricing(resolved);

  useEffect(() => {
    if (drawerOpenNonce > 0 && count > 0) setOpen(true);
  }, [drawerOpenNonce, count]);

  if (!hydrated || count === 0) return null;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="fixed right-5 bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] z-30 inline-flex max-w-[calc(100vw-2.5rem)] items-center gap-2 rounded-full bg-forest px-4 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-forest-dark cursor-pointer 2xl:hidden sm:px-5"
        >
          <ShoppingCart className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span className="flex min-w-0 flex-col items-start leading-tight sm:flex-row sm:items-center sm:gap-1.5">
            <span className="whitespace-nowrap">
              {count} article{count > 1 ? "s" : ""}
            </span>
            <span className="tabular-nums">{formatEUR(total)}</span>
          </span>
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
              className="grid h-11 w-11 place-items-center rounded-full text-bark-muted hover:bg-sand-200 cursor-pointer"
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

          <div className="border-t border-sand-300 bg-white px-5 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
            <div className="space-y-1 sm:flex sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-3 sm:gap-y-1">
              <span className="text-sm text-bark-muted">Total estimatif HTVA</span>
              <span className="block font-display text-xl font-semibold tabular-nums whitespace-nowrap text-forest-dark">
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
