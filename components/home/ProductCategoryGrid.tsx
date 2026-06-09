import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getFamilies } from "@/lib/families";

interface ProductCategoryGridProps {
  /** Limit the number of families shown (homepage preview). */
  limit?: number;
}

/**
 * Preview grid of product families, derived directly from the catalog tree.
 * Uses customer-friendly labels + icons and links into the catalogue family
 * view (?famille=). No product data is duplicated here.
 */
export function ProductCategoryGrid({ limit }: ProductCategoryGridProps) {
  const families = getFamilies();
  const shown = limit ? families.slice(0, limit) : families;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {shown.map((family) => {
        const Icon = family.icon;
        return (
          <Link
            key={family.id}
            href={`/catalogue?famille=${family.id}`}
            className="group flex items-center justify-between gap-3 rounded-card border border-sand-300 bg-white p-5 shadow-card transition-colors duration-200 hover:border-forest/40 hover:bg-sage-soft/40 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sage-soft text-forest">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-forest-dark">{family.label}</h3>
                <p className="mt-0.5 text-sm text-bark-muted">
                  {family.productCount} référence
                  {family.productCount > 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <ArrowUpRight
              className="h-5 w-5 shrink-0 text-bark-muted transition-colors group-hover:text-forest"
              aria-hidden="true"
            />
          </Link>
        );
      })}
    </div>
  );
}
