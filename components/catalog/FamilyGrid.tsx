import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getFamilies } from "@/lib/families";

/**
 * Friendly entry point for the catalogue: a grid of the ~8 product families,
 * each with a plain-language label, the technical title as a subtitle, a short
 * real-world description and a product count. Clicking a card opens that
 * family (?famille=) instead of dropping the visitor into a raw category list.
 */
export function FamilyGrid() {
  const families = getFamilies();

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {families.map((family) => {
        const Icon = family.icon;
        return (
          <Link
            key={family.id}
            href={`/catalogue?famille=${family.id}`}
            className="group flex h-full flex-col rounded-card border border-sand-300 bg-white p-6 shadow-card transition-colors duration-200 hover:border-forest/40 hover:bg-sage-soft/40 cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage-soft text-forest">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <ArrowUpRight
                className="h-5 w-5 shrink-0 text-bark-muted transition-colors group-hover:text-forest"
                aria-hidden="true"
              />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-forest-dark">
              {family.label}
            </h3>
            <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-bark-muted">
              {family.techTitle}
            </p>
            {family.description && (
              <p className="mt-2 flex-1 text-sm text-bark-muted">
                {family.description}
              </p>
            )}
            <p className="mt-4 text-sm font-medium text-forest">
              {family.productCount} produit{family.productCount > 1 ? "s" : ""}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
