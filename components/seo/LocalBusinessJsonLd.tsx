import { site } from "@/lib/site";

export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: site.legalName,
    alternateName: site.name,
    description: site.tagline,
    url: site.url,
    telephone: site.phoneTel,
    email: site.email,
    vatID: site.vatNumber,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: "Sprimont",
      postalCode: "4140",
      addressCountry: "BE",
    },
    areaServed: site.serviceArea,
    sameAs: [site.social.facebook, site.social.instagram].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
