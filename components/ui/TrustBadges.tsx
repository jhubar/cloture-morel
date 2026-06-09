import { ShieldCheck, Truck, TreePine, MapPin } from "lucide-react";

const badges = [
  {
    icon: TreePine,
    title: "Qualité sélectionnée",
    text: "Piquets d’acacia choisis chez les producteurs pour leur densité et durabilité (+25 ans).",
  },
  {
    icon: Truck,
    title: "Livraison & camion complet",
    text: "Tarifs dégressifs et livraison possible par achat de camion complet.",
  },
  {
    icon: ShieldCheck,
    title: "Accompagnement pro",
    text: "Conseil sur le choix des matériaux et la mise en œuvre de votre projet.",
  },
  {
    icon: MapPin,
    title: "Acteur local",
    text: "Vente et pose dans la région de Sprimont, Esneux et Liège.",
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
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-sage-soft text-forest">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <h3 className="mt-4 text-base font-semibold text-forest-dark">{title}</h3>
          <p className="mt-1 text-sm text-bark-muted">{text}</p>
        </li>
      ))}
    </ul>
  );
}
