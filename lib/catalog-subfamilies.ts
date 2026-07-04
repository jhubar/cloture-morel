import type { Category } from "@/lib/types";

/**
 * A grouping of leaf categories under an optional sub-family (3rd level).
 * Families without sub-parents yield a single group with a null title, so the
 * catalogue rendering stays uniform.
 */
export interface SubFamilyGroup {
  /** Stable key (subParent id, or "__flat__" when the family is flat). */
  key: string;
  /** Sub-family title, or null when the family has no sub-parents. */
  title: string | null;
  categories: Category[];
}

const FLAT_KEY = "__flat__";

/** Group a family's categories by their subParent, preserving order. */
export function groupBySubFamily(categories: Category[]): SubFamilyGroup[] {
  const hasSubFamilies = categories.some((c) => c.subParent);
  if (!hasSubFamilies) {
    return [{ key: FLAT_KEY, title: null, categories }];
  }

  const groups: SubFamilyGroup[] = [];
  const byKey = new Map<string, SubFamilyGroup>();

  for (const category of categories) {
    const key = category.subParent ?? FLAT_KEY;
    let group = byKey.get(key);
    if (!group) {
      group = {
        key,
        title: category.subParentTitle ?? null,
        categories: [],
      };
      byKey.set(key, group);
      groups.push(group);
    }
    group.categories.push(category);
  }

  return groups;
}
