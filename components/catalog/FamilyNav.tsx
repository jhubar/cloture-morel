import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getFamilies } from "@/lib/families";
import { cn } from "@/lib/utils";

interface FamilyNavProps {
  activeId: string;
}

/**
 * Sidebar for the family detail view: a short, plain-language list of the ~8
 * families (instead of the ~20 technical categories) plus a link back to the
 * family grid. Each entry sets ?famille= so the catalogue stays server-rendered.
 */
export function FamilyNav({ activeId }: FamilyNavProps) {
  const families = getFamilies();

  return (
    <nav aria-label="Familles de produits" className="space-y-1">
      <Link
        href="/catalogue"
        className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-bark-muted transition-colors duration-200 hover:bg-sand-200 hover:text-forest-dark"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Toutes les familles
      </Link>
      <ul className="space-y-0.5">
        {families.map((family) => {
          const active = family.id === activeId;
          return (
            <li key={family.id}>
              <Link
                href={`/catalogue?famille=${family.id}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-200",
                  active
                    ? "bg-forest text-white"
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
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
