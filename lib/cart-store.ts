"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, ResolvedCartItem } from "@/lib/types";
import { findProduct } from "@/lib/catalog";
import { getProductPricing } from "@/lib/pricing";

interface CartState {
  items: CartItem[];
  /** Becomes true once the persisted state is rehydrated (avoids SSR mismatch). */
  hydrated: boolean;
  /** Incremented to request opening the mobile cart drawer after add-to-cart. */
  drawerOpenNonce: number;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  clear: () => void;
  requestDrawerOpen: () => void;
  setHydrated: (value: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      hydrated: false,
      drawerOpenNonce: 0,
      addItem: (productId, quantity = 1) =>
        set((state) => {
          const wasEmpty = state.items.length === 0;
          const existing = state.items.find((i) => i.productId === productId);
          const items = existing
            ? state.items.map((i) =>
                i.productId === productId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              )
            : [...state.items, { productId, quantity }];

          return {
            items,
            // Ouvre le tiroir une seule fois, au premier article — pas à chaque ajout.
            ...(wasEmpty ? { drawerOpenNonce: state.drawerOpenNonce + 1 } : {}),
          };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      setQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.productId !== productId) };
          }
          return {
            items: state.items.map((i) =>
              i.productId === productId ? { ...i, quantity } : i,
            ),
          };
        }),
      increment: (productId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        })),
      decrement: (productId) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i,
            )
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      requestDrawerOpen: () =>
        set((state) => ({ drawerOpenNonce: state.drawerOpenNonce + 1 })),
      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: "clotures-morel-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

/** Total number of units across all cart lines. */
export function selectItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Resolve persisted cart items against the current catalog. Items whose product
 * no longer exists are dropped. Prices are read live from the catalog.
 */
export function resolveCartItems(items: CartItem[]): ResolvedCartItem[] {
  const resolved: ResolvedCartItem[] = [];
  for (const item of items) {
    const found = findProduct(item.productId);
    if (!found) continue;
    const { product, category } = found;
    const pricing = getProductPricing(product);
    resolved.push({
      product,
      category,
      quantity: item.quantity,
      unitPrice: pricing.unitPrice,
      lineTotal:
        pricing.unitPrice !== null ? pricing.unitPrice * item.quantity : null,
      isPalette: pricing.isPalette,
      piecesPerPalette: pricing.piecesPerPalette,
      piecePrice: pricing.piecePrice,
      unitLabel: pricing.unitLabel,
    });
  }
  return resolved;
}

/** Sum of numeric line totals only. Non-numeric ("sur demande") lines excluded. */
export function selectCartTotalHTVA(resolved: ResolvedCartItem[]): number {
  return resolved.reduce((sum, line) => sum + (line.lineTotal ?? 0), 0);
}

/** True when at least one cart line has a non-numeric price. */
export function hasOnRequestPricing(resolved: ResolvedCartItem[]): boolean {
  return resolved.some((line) => line.unitPrice === null);
}
