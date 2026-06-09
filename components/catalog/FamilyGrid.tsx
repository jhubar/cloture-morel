import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getFamilyImage } from "@/lib/assets";
import { getFamilies } from "@/lib/families";
import { ImageSlot } from "@/components/ui/ImageSlot";

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
        const familyImage = getFamilyImage(family.id, family.label);
        return (
          <Link
            key={family.id}
            href={`/catalogue?famille=${family.id}`}
            className="group flex h-full flex-col overflow-hidden rounded-card border border-sand-300 bg-white shadow-card transition-colors duration-200 hover:border-forest/40 cursor-pointer"
          >
            <div className="relative">
              <ImageSlot
                slot={familyImage}
                className="aspect-[16/10] w-full border-b border-sand-200 transition-transform duration-300 group-hover:scale-[1.02]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <span className="pointer-events-none absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-bark-muted shadow-sm backdrop-blur-sm transition-colors group-hover:text-forest">
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6 transition-colors group-hover:bg-sage-soft/40">
            <h3 className="text-lg font-semibold text-forest-dark">
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
            </div>
          </Link>
        );
      })}
    </div>
  );
}
