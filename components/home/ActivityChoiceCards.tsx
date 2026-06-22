import Link from "next/link";
import { Package, Hammer, ArrowRight } from "lucide-react";

const activities = [
  {
    href: "/catalogue",
    icon: Package,
    title: "Acheter des matériaux",
    description:
      "Parcourez le catalogue de piquets, grillages, barrières et accessoires. Composez votre sélection et demandez un devis matériaux.",
    cta: "Voir le catalogue",
  },
  {
    href: "/pose",
    icon: Hammer,
    title: "Demander une pose",
    description:
      "Confiez l’installation de votre clôture à des professionnels. Décrivez votre projet et recevez un devis pose adapté.",
    cta: "Découvrir la pose",
  },
] as const;

/** The two-activity split that anchors the homepage (Path A). */
export function ActivityChoiceCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {activities.map(({ href, icon: Icon, title, description, cta }) => (
        <Link
          key={href}
          href={href}
          className="group flex flex-col rounded-card border border-sand-300 bg-white p-8 shadow-card transition-colors duration-200 hover:border-forest/40 hover:bg-sage-soft/40 cursor-pointer"
        >
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-terracotta text-white">
            <Icon className="h-7 w-7" aria-hidden="true" />
          </span>
          <h3 className="mt-6 text-2xl font-semibold text-forest-dark">{title}</h3>
          <p className="mt-3 flex-1 text-bark-muted">{description}</p>
          <span className="mt-6 inline-flex items-center gap-2 font-semibold text-terracotta">
            {cta}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </Link>
      ))}
    </div>
  );
}
