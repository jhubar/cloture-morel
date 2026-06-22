import type { Category, Product } from "@/lib/types";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ProductVariantCard } from "@/components/catalog/ProductVariantCard";

export interface ProductListingGroup {
  article: string;
  variants: Product[];
  category: Category;
  familyId?: string;
  familyLabel?: string;
}

interface ProductListingGridProps {
  groups: ProductListingGroup[];
  /** Affiche la famille (utile en recherche globale). */
  showFamilyContext?: boolean;
}

export function ProductListingGrid({
  groups,
  showFamilyContext = false,
}: ProductListingGridProps) {
  return (
    <ul className="grid list-none gap-6 p-0 grid-cols-1">
      {groups.map((group) => (
        <li key={`${group.category.id}-${group.article}`} className="min-w-0">
          {group.variants.length > 1 ? (
            <ProductVariantCard
              group={{ article: group.article, variants: group.variants }}
              category={group.category}
              familyId={group.familyId}
              familyLabel={showFamilyContext ? group.familyLabel : undefined}
            />
          ) : (
            <ProductCard
              product={group.variants[0]}
              category={group.category}
              familyId={group.familyId}
              familyLabel={showFamilyContext ? group.familyLabel : undefined}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
