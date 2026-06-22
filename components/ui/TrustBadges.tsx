import { ShieldCheck, Truck, TreePine, Globe } from "lucide-react";

const badges = [
  {
    icon: TreePine,
    title: "Matériaux & accessoires",
    text: "Piquets, grillages, barrières, ganivelles, machines et accessoires de pose — sélectionnés pour leur qualité et durabilité.",
  },
  {
    icon: Truck,
    title: "Livraison & camion complet",
    text: "Tarifs dégressifs et livraison possible par achat de camion complet.",
  },
  {
    icon: ShieldCheck,
    title: "Pose & accompagnement",
    text: "Conseil, fourniture et pose de vos clôtures, portails et aménagements extérieurs — de A à Z.",
  },
  {
    icon: Globe,
    title: "Zone d'intervention étendue",
    text: "Vente et pose dans toute la Belgique et les pays limitrophes (France, Luxembourg, Allemagne, Pays-Bas).",
  },
] as const;

export function TrustBadges() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {badges.map(({ icon: Icon, title, text }) => (
        <li
          key={title}
          className="rounded-card border border-sand-300 bg-white p-5 shadow-card"
        >
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-terracotta/10 text-terracotta">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <h3 className="mt-4 text-base font-semibold text-forest-dark">{title}</h3>
          <p className="mt-1 text-sm text-bark-muted">{text}</p>
        </li>
      ))}
    </ul>
  );
}
