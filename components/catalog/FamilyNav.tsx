import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getFamilies } from "@/lib/families";
import { cn } from "@/lib/utils";

export interface SubCategoryItem {
  id: string;
  title: string;
  productCount: number;
}

/** Optional sub-family grouping (3rd level) for the active family. */
export interface SubFamilyNavGroup {
  key: string;
  title: string | null;
  items: SubCategoryItem[];
}

interface FamilyNavProps {
  activeId: string;
  /** Sub-categories of the active family — rendered as anchor links below it. */
  subCategories?: SubCategoryItem[];
  /** When set, sub-categories are grouped under sub-family headers. */
  subFamilies?: SubFamilyNavGroup[];
}

/**
 * Sidebar for the family detail view: a short, plain-language list of the ~8
 * families (instead of the ~20 technical categories) plus a link back to the
 * family grid. When a family is active and has multiple sub-categories, they are
 * shown as indented anchor links so the visitor can jump directly to a section.
 */
export function FamilyNav({ activeId, subCategories, subFamilies }: FamilyNavProps) {
  const families = getFamilies();

  return (
    <nav aria-label="Familles de produits" className="space-y-1">
      <Link
        href="/catalogue"
        className="mb-2 flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-bark-muted transition-colors duration-200 hover:bg-sand-200 hover:text-forest-dark"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Toutes les familles
      </Link>
      <ul className="space-y-0.5">
        {families.map((family) => {
          const active = family.id === activeId;
          const hasSubFamilies = active && subFamilies && subFamilies.length > 1;
          const showSubs = active && subCategories && subCategories.length > 1;
          return (
            <li key={family.id}>
              <Link
                href={`/catalogue?famille=${family.id}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center justify-between gap-2 rounded-lg px-3 text-sm transition-colors duration-200",
                  active
                    ? "bg-terracotta text-white"
                    : "text-bark hover:bg-sand-200",
                )}
              >
                <span className="truncate">{family.label}</span>
                <span
                  className={cn(
                    "shrink-0 text-xs",
                    active ? "text-white/80" : "text-bark-muted",
                  )}
                >
                  {family.productCount}
                </span>
              </Link>

              {/* Sub-families → one quick-access anchor per sub-family (3rd level) */}
              {hasSubFamilies && (
                <ul className="mt-1 ml-3 space-y-0.5 border-l-2 border-terracotta/25 pl-2">
                  {subFamilies!.map((group) => {
                    const count = group.items.reduce((sum, item) => sum + item.productCount, 0);
                    return (
                      <li key={group.key}>
                        <a
                          href={`#subfamily-${group.key}`}
                          title={group.title ?? undefined}
                          className="flex min-h-9 items-center justify-between gap-2 rounded-md px-2 text-xs text-bark-muted transition-colors duration-150 hover:bg-terracotta/15 hover:text-terracotta-dark"
                        >
                          <span className="truncate leading-snug">{group.title}</span>
                          <span className="shrink-0 text-bark-muted/60">{count}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Flat sub-categories as anchor jump links */}
              {!hasSubFamilies && showSubs && (
                <ul className="mt-1 ml-3 space-y-0.5 border-l-2 border-terracotta/25 pl-2">
                  {subCategories!.map((sub) => (
                    <li key={sub.id}>
                      <a
                        href={`#category-${sub.id}`}
                        title={sub.title}
                        className="flex min-h-9 items-center justify-between gap-2 rounded-md px-2 text-xs text-bark-muted transition-colors duration-150 hover:bg-terracotta/15 hover:text-terracotta-dark"
                      >
                        <span className="truncate leading-snug">{sub.title}</span>
                        <span className="shrink-0 text-bark-muted/60">{sub.productCount}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
