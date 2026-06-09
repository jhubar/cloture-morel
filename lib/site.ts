/**
 * Central place for company details and navigation.
 */
export const site = {
  name: "Clôtures Morel",
  legalName: "Clôtures et travaux Morel SRL",
  tagline: "Vente et pose de clôtures",
  address: {
    street: "Rue d’Esneux 220",
    city: "4140 Sprimont",
    country: "Belgique",
  },
  mapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3678.8129570868987!2d5.596542277458994!3d50.53042457160757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c0586f5f4370a1%3A0x4e435a222c37cd92!2sRue%20d%27Esneux%20220%2C%204140%20Sprimont!5e1!3m2!1sfr!2sbe!4v1781033766247!5m2!1sfr!2sbe",
  mapsLink:
    "https://www.google.com/maps/search/?api=1&query=Rue+d%27Esneux+220,+4140+Sprimont,+Belgique",
  phone: "0497 91 77 39",
  phoneTel: "+32497917739",
  email: "Clotures-morel@outlook.com",
  /** Set `confirmed: true` and fill `lines` once Nicolas validates opening hours. */
  hours: {
    confirmed: false,
    label: "Horaires sur demande",
    lines: [] as string[],
  },
  vatNumber: "BE 0707.588.769",
  serviceArea: "Sprimont, Esneux, Liège et environs (province de Liège)",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://clotures-morel.be",
  hosting: {
    name: "Vercel Inc.",
    address: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
    website: "https://vercel.com",
  },
  social: {
    facebook: "https://www.facebook.com/cloturesmorel/",
    instagram: "https://www.instagram.com/cloturesmorel/",
  },
} as const;

export const mainNav = [
  { href: "/", label: "Accueil" },
  { href: "/vente", label: "Vente matériaux" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/panier", label: "Ma sélection" },
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
