import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { TAX_NOTE } from "@/lib/catalog";
import { getFamilyById, getFamilyForCategory } from "@/lib/families";
import { searchCatalog } from "@/lib/search";
import { FamilyGrid } from "@/components/catalog/FamilyGrid";
import { FamilyNav } from "@/components/catalog/FamilyNav";
import { CategoryProductGrid } from "@/components/catalog/CategoryProductGrid";
import { SearchResultsPanel } from "@/components/catalog/SearchResultsPanel";
import {
  groupCategoryProducts,
  supportsVariantGrouping,
} from "@/lib/product-variants";
import { CatalogSearchBar } from "@/components/catalog/CatalogSearchBar";
import { CatalogSearchStatus } from "@/components/catalog/CatalogSearchStatus";
import { CartSummary } from "@/components/cart/CartSummary";
import { CartDrawer } from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  title: "Catalogue produits",
  description:
    "Parcourez le catalogue Clôtures Morel par famille : piquets, grillages, barrières, ganivelles et accessoires. Composez votre devis matériaux.",
};

interface CataloguePageProps {
  searchParams: Promise<{ famille?: string; category?: string; q?: string }>;
}

export default async function CataloguePage({ searchParams }: CataloguePageProps) {
  const { famille, category, q } = await searchParams;
  const query = q?.trim() ?? "";
  const hasSearch = query.length >= 2;
  const landingSearchResults = hasSearch ? searchCatalog(query) : [];
  const unknownFamily = Boolean(famille && !getFamilyById(famille) && !category);

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
              Recherchez une référence ou choisissez une famille de produits pour composer
              votre devis matériaux. {TAX_NOTE}. Les totaux affichés sont des estimations,
              sans engagement.
            </p>
            <div className="mt-6 space-y-4">
              <CatalogSearchBar />
              {hasSearch && <CatalogSearchStatus />}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[88rem] px-4 py-10 sm:px-6 lg:px-8">
          {unknownFamily && (
            <p
              role="status"
              className="mb-6 rounded-lg border border-onorder/30 bg-onorder/10 px-4 py-3 text-sm text-bark"
            >
              Cette famille de produits est introuvable. Parcourez le catalogue ci-dessous
              ou utilisez la recherche.
            </p>
          )}

          {hasSearch ? (
            <div className="space-y-10">
              <SearchResultsPanel query={query} />
              {landingSearchResults.length === 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-forest-dark">
                    Parcourez par famille
                  </h2>
                  <div className="mt-5">
                    <FamilyGrid />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <FamilyGrid />
          )}
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
            <Link
              href="/catalogue"
              className="inline-flex min-h-11 items-center hover:text-forest-dark"
            >
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
          <div className="mt-6 space-y-4">
            <CatalogSearchBar
              familyId={activeFamily.id}
              placeholder={`Rechercher dans ${activeFamily.label}…`}
            />
            {hasSearch && (
              <CatalogSearchStatus
                familyId={activeFamily.id}
                familyLabel={activeFamily.label}
              />
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[88rem] gap-8 px-4 py-10 pb-[calc(6rem+env(safe-area-inset-bottom,0px))] sm:px-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8 2xl:grid-cols-[220px_minmax(0,1fr)_300px] 2xl:pb-10">
        {/* Sub-categories fed to both mobile accordion and desktop sidebar */}
        {(() => {
          const subCategories = activeFamily.categories.map((c) => ({
            id: c.id,
            title: c.title,
            productCount: c.products.length,
          }));
          return (
            <>
              <details className="mb-6 rounded-card border border-sand-300 bg-white lg:hidden">
                <summary className="flex cursor-pointer items-center justify-between px-4 py-3 font-medium text-forest-dark">
                  Familles de produits
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </summary>
                <div className="border-t border-sand-200 px-2 py-3">
                  <FamilyNav activeId={activeFamily.id} subCategories={subCategories} />
                </div>
              </details>

              <div className="hidden lg:block">
                <FamilyNav activeId={activeFamily.id} subCategories={subCategories} />
              </div>
            </>
          );
        })()}

        <div className="min-w-0 space-y-10">
          {hasSearch ? (
            <>
              <SearchResultsPanel query={query} familyId={activeFamily.id} />
              <p className="text-sm text-bark-muted">
                <Link
                  href={`/catalogue?q=${encodeURIComponent(query)}`}
                  className="text-forest hover:underline"
                >
                  Élargir la recherche à tout le catalogue
                </Link>
              </p>
            </>
          ) : (
          activeFamily.categories.map((category) => {
            const titleId = `category-${category.id}`;
            const products = category.products;
            const groups = groupCategoryProducts(category);
            const itemCount = supportsVariantGrouping(category.format)
              ? groups.length
              : products.length;
            const itemLabel = supportsVariantGrouping(category.format)
              ? itemCount > 1
                ? "articles"
                : "article"
              : itemCount > 1
                ? "références"
                : "référence";

            return (
              <section key={category.id} id={`category-${category.id}`} aria-labelledby={titleId} className="scroll-mt-24">
                {showCategoryHeadings && (
                  <div className="mb-5">
                    <h2 id={titleId} className="text-xl font-semibold">
                      {category.title}
                    </h2>
                    <p className="mt-1 text-sm text-bark-muted">
                      {itemCount} {itemLabel}
                      {supportsVariantGrouping(category.format) &&
                        products.length > itemCount && (
                          <> ({products.length} déclinaisons)</>
                        )}
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
                <CategoryProductGrid
                  category={category}
                  familyId={activeFamily.id}
                />
              </section>
            );
          })
          )}
        </div>

        <div className="hidden 2xl:block">
          <CartSummary />
        </div>
      </div>

      <CartDrawer />
    </>
  );
}
