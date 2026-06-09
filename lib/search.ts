import { getFamilies } from "@/lib/families";
import { getProductCommercialReference } from "@/lib/product-display";
import type { Category, Product } from "@/lib/types";

export interface CatalogSearchHit {
  product: Product;
  category: Category;
  familyId: string;
  familyLabel: string;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

let cachedIndex: CatalogSearchHit[] | null = null;

export function getCatalogSearchIndex(): CatalogSearchHit[] {
  if (cachedIndex) return cachedIndex;
  const hits: CatalogSearchHit[] = [];
  for (const family of getFamilies()) {
    for (const category of family.categories) {
      for (const product of category.products) {
        hits.push({
          product,
          category,
          familyId: family.id,
          familyLabel: family.label,
        });
      }
    }
  }
  cachedIndex = hits;
  return hits;
}

export interface SearchResultGroup {
  article: string;
  category: Category;
  familyId: string;
  familyLabel: string;
  variants: Product[];
}

/** Regroupe les hits de recherche par catégorie + article (comme le catalogue). */
export function groupSearchHits(hits: CatalogSearchHit[]): SearchResultGroup[] {
  const buckets = new Map<string, CatalogSearchHit[]>();

  for (const hit of hits) {
    const article = hit.product.article?.trim() || hit.product.label;
    const key = `${hit.category.id}::${article}`;
    const list = buckets.get(key) ?? [];
    list.push(hit);
    buckets.set(key, list);
  }

  return [...buckets.values()].map((bucket) => {
    const first = bucket[0];
    const variants = [
      ...new Map(bucket.map((hit) => [hit.product.id, hit.product])).values(),
    ];
    return {
      article: first.product.article?.trim() || first.product.label,
      category: first.category,
      familyId: first.familyId,
      familyLabel: first.familyLabel,
      variants,
    };
  });
}

export function searchCatalog(
  query: string,
  options?: { familyId?: string; limit?: number },
): CatalogSearchHit[] {
  const raw = query.trim();
  if (raw.length < 2) return [];

  const tokens = normalize(raw).split(/\s+/).filter(Boolean);
  let index = getCatalogSearchIndex();
  if (options?.familyId) {
    index = index.filter((hit) => hit.familyId === options.familyId);
  }

  const matches = index.filter((hit) => {
    const haystack = normalize(
      [
        hit.product.label,
        hit.product.reference,
        getProductCommercialReference(hit.product),
        hit.product.article,
        hit.category.title,
        hit.familyLabel,
        ...Object.values(hit.product.details ?? {}),
      ]
        .filter(Boolean)
        .join(" "),
    );
    return tokens.every((token) => haystack.includes(token));
  });

  const limit = options?.limit ?? 80;
  return matches.slice(0, limit);
}
