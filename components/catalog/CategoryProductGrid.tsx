import type { Category } from "@/lib/types";
import { groupCategoryProducts } from "@/lib/product-variants";
import { ProductListingGrid } from "@/components/catalog/ProductListingGrid";

interface CategoryProductGridProps {
  category: Category;
  familyId?: string;
}

export function CategoryProductGrid({ category, familyId }: CategoryProductGridProps) {
  const groups = groupCategoryProducts(category).map((group) => ({
    article: group.article,
    variants: group.variants,
    category,
    familyId,
  }));

  return <ProductListingGrid groups={groups} />;
}
