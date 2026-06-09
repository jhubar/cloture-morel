/**
 * Central place for company details and navigation.
 *
 * TODO(client): replace the placeholder contact details, service area and
 * social links with the real information provided by Nicolas Morel.
 */
export const site = {
  name: "Clôtures Morel",
  tagline: "Vente et pose de clôtures",
  // Address taken from the project brief (devis). Confirm with client.
  address: {
    street: "Rue d’Esneux 220",
    city: "4140 Sprimont",
    country: "Belgique",
  },
  // TODO(client): confirm public phone / e-mail to display on the site.
  phone: "+32 (0)4 00 00 00 00",
  email: "contact@clotures-morel.be",
  serviceArea: "Sprimont, Esneux, Liège et environs (province de Liège)",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://clotures-morel.be",
  social: {
    facebook: "", // TODO(client): Facebook page URL (optional)
    instagram: "", // TODO(client): Instagram profile URL (optional)
  },
} as const;

export const mainNav = [
  { href: "/", label: "Accueil" },
  { href: "/vente", label: "Vente matériaux" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/pose", label: "Pose" },
  { href: "/contact", label: "Contact" },
] as const;

export const footerLinks = {
  navigation: [
    { href: "/vente", label: "Vente de matériaux" },
    { href: "/catalogue", label: "Catalogue produits" },
    { href: "/pose", label: "Pose de clôtures" },
    { href: "/contact", label: "Contact" },
  ],
  quotes: [
    { href: "/catalogue", label: "Devis matériaux" },
    { href: "/pose#devis", label: "Devis pose" },
  ],
  legal: [{ href: "/mentions-legales", label: "Mentions légales" }],
} as const;
