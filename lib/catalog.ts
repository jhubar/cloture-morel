import catalogData from "@/data/catalog.json";
import type { Catalog, Category, CategoryNode, Product } from "@/lib/types";

/**
 * Catalog access layer. The JSON is imported statically so the whole catalog is
 * bundled at build time — no database, no runtime fetch. All derived data
 * (categories, navigation tree, product lookups) comes from here so components
 * never duplicate product data.
 */
const catalog = catalogData as Catalog;

export function getCatalog(): Catalog {
  return catalog;
}

export function getCategories(): Category[] {
  return catalog.categories;
}

export function getCategoryById(id: string): Category | undefined {
  return catalog.categories.find((c) => c.id === id);
}

export function getAllProducts(): Product[] {
  return catalog.categories.flatMap((c) => c.products);
}

/** Fast id → { product, category } lookup, built once per module load. */
const productIndex: Map<string, { product: Product; category: Category }> = (() => {
  const map = new Map<string, { product: Product; category: Category }>();
  for (const category of catalog.categories) {
    for (const product of category.products) {
      map.set(product.id, { product, category });
    }
  }
  return map;
})();

export function findProduct(
  productId: string,
): { product: Product; category: Category } | undefined {
  return productIndex.get(productId);
}

/**
 * Build the navigation tree, grouping categories under their parent group when
 * present (e.g. "Barrières galvanisées"), otherwise as standalone nodes.
 * Insertion order from the catalog is preserved.
 */
export function getCategoryTree(): CategoryNode[] {
  const nodes: CategoryNode[] = [];
  const indexByKey = new Map<string, CategoryNode>();

  for (const category of catalog.categories) {
    const key = category.parent ?? category.id;
    const title = category.parent ? category.parentTitle ?? category.title : category.title;

    let node = indexByKey.get(key);
    if (!node) {
      node = { id: key, title: title ?? category.title, categories: [] };
      indexByKey.set(key, node);
      nodes.push(node);
    }
    node.categories.push(category);
  }

  return nodes;
}

export function getCategoryCount(): number {
  return catalog.categories.length;
}

export function getProductCount(): number {
  return getAllProducts().length;
}

export const TAX_NOTE = catalog.taxNote;
export const CURRENCY = catalog.currency;
