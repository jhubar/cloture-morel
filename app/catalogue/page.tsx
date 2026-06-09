import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { TAX_NOTE } from "@/lib/catalog";
import { getFamilyById, getFamilyForCategory } from "@/lib/families";
import { FamilyGrid } from "@/components/catalog/FamilyGrid";
import { FamilyNav } from "@/components/catalog/FamilyNav";
import { ProductCard } from "@/components/catalog/ProductCard";
import { CartSummary } from "@/components/cart/CartSummary";
import { CartDrawer } from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  title: "Catalogue produits",
  description:
    "Parcourez le catalogue Clôtures Morel par famille : piquets, grillages, barrières, ganivelles et accessoires. Composez votre devis matériaux.",
};

interface CataloguePageProps {
  // `famille` is the customer-facing entry; `category` is kept for backward
  // compatibility with older deep links and resolves to its parent family.
  searchParams: Promise<{ famille?: string; category?: string }>;
}

export default async function CataloguePage({ searchParams }: CataloguePageProps) {
  const { famille, category } = await searchParams;
  const activeFamily =
    (famille ? getFamilyById(famille) : undefined) ??
    (category ? getFamilyForCategory(category) : undefined) ??
    null;

  // Landing view — friendly grid of families, no overwhelming product wall.
  if (!activeFamily) {
    return (
      <>
        <div className="border-b border-sand-300 bg-sage-soft/50">
          <div className="mx-auto max-w-[88rem] px-4 py-10 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-terracotta">
              Catalogue
            </p>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
              Que recherchez-vous ?
            </h1>
            <p className="mt-3 max-w-2xl text-bark-muted">
              Choisissez une famille de produits pour découvrir les références
              correspondantes, puis composez votre devis matériaux. {TAX_NOTE}.
              Les totaux affichés sont des estimations, sans engagement.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-[88rem] px-4 py-10 sm:px-6 lg:px-8">
          <FamilyGrid />
        </div>

        <CartDrawer />
      </>
    );
  }

  // Detail view — one family, products grouped by their (technical) categories.
  const showCategoryHeadings = activeFamily.categories.length > 1;

  return (
    <>
      <div className="border-b border-sand-300 bg-sage-soft/50">
        <div className="mx-auto max-w-[88rem] px-4 py-10 sm:px-6 lg:px-8">
          <nav aria-label="Fil d'ariane" className="text-sm text-bark-muted">
            <Link href="/catalogue" className="hover:text-forest-dark">
              Catalogue
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-forest-dark">{activeFamily.label}</span>
          </nav>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
            {activeFamily.label}
          </h1>
          <p className="mt-1 text-sm font-medium uppercase tracking-wide text-bark-muted">
            {activeFamily.techTitle}
          </p>
          {activeFamily.description && (
            <p className="mt-3 max-w-2xl text-bark-muted">
              {activeFamily.description} {TAX_NOTE}.
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-[88rem] gap-8 px-4 py-10 sm:px-6 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8 xl:grid-cols-[240px_minmax(0,1fr)_340px]">
        {/* Mobile family picker */}
        <details className="mb-6 rounded-card border border-sand-300 bg-white lg:hidden">
          <summary className="flex cursor-pointer items-center justify-between px-4 py-3 font-medium text-forest-dark">
            Familles de produits
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </summary>
          <div className="border-t border-sand-200 px-2 py-3">
            <FamilyNav activeId={activeFamily.id} />
          </div>
        </details>

        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <FamilyNav activeId={activeFamily.id} />
        </div>

        {/* Products grouped by sub-category */}
        <div className="min-w-0 space-y-10">
          {activeFamily.categories.map((category) => {
            const titleId = `category-${category.id}`;
            return (
              <section key={category.id} aria-labelledby={titleId}>
                {showCategoryHeadings && (
                  <div className="mb-5">
                    <h2 id={titleId} className="text-xl font-semibold">
                      {category.title}
                    </h2>
                    <p className="mt-1 text-sm text-bark-muted">
                      {category.products.length} référence
                      {category.products.length > 1 ? "s" : ""}
                    </p>
                  </div>
                )}
                {category.notes.length > 0 && (
                  <details className="mb-5 rounded-lg bg-white p-4 text-sm text-bark-muted ring-1 ring-inset ring-sand-300">
                    <summary className="cursor-pointer font-medium text-forest-dark">
                      Informations sur cette gamme
                    </summary>
                    <ul className="mt-3 list-disc space-y-2 pl-5">
                      {category.notes.map((note, i) => (
                        <li key={i}>{note}</li>
                      ))}
                    </ul>
                  </details>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  {category.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      category={category}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Desktop cart column */}
        <div className="hidden xl:block">
          <CartSummary />
        </div>
      </div>

      <CartDrawer />
    </>
  );
}
