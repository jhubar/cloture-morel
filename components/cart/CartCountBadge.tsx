"use client";

import { useCartStore, selectItemCount } from "@/lib/cart-store";

/** Small badge shown over the cart icon. Hidden until hydrated to avoid SSR mismatch. */
export function CartCountBadge() {
  const items = useCartStore((s) => s.items);
  const hydrated = useCartStore((s) => s.hydrated);
  const count = selectItemCount(items);

  if (!hydrated || count === 0) return null;

  return (
    <span
      className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-terracotta px-1 text-xs font-semibold text-white"
      aria-label={`${count} article${count > 1 ? "s" : ""} dans le panier`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
