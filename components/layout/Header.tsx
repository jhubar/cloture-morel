"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart } from "lucide-react";
import { mainNav, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { CartCountBadge } from "@/components/cart/CartCountBadge";
import { QuoteCtaButton } from "@/components/cart/QuoteCtaButton";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-30 border-b border-sand-300 bg-sand/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-h-11 min-w-0 shrink items-center gap-2 py-1"
          aria-label={`${site.name} — accueil`}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-forest font-display text-lg font-semibold text-white">
            M
          </span>
          <span className="truncate font-display text-base font-semibold text-forest-dark sm:text-lg">
            {site.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex min-h-11 items-center rounded-full px-3 text-sm font-medium transition-colors duration-200 hover:text-forest",
                isActive(item.href) ? "text-forest" : "text-bark-muted",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/panier"
            aria-label="Voir le panier"
            className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full text-bark-muted transition-colors hover:bg-sand-200 hover:text-forest"
          >
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            <CartCountBadge />
          </Link>

          <div className="hidden sm:block">
            <QuoteCtaButton size="md" />
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full text-forest-dark hover:bg-sand-200 md:hidden cursor-pointer"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="border-t border-sand-300 bg-sand md:hidden"
          aria-label="Navigation mobile"
        >
          <div className="space-y-1 px-4 py-4">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block rounded-lg px-3 py-3 text-base font-medium",
                  isActive(item.href)
                    ? "bg-sage-soft text-forest"
                    : "text-bark hover:bg-sand-200",
                )}
              >
                {item.label}
              </Link>
            ))}
            <QuoteCtaButton
              size="lg"
              className="mt-2 w-full"
              onClick={() => setOpen(false)}
            />
          </div>
        </nav>
      )}
    </header>
  );
}
