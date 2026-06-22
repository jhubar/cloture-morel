import Link from "next/link";
import { MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react";
import { site, footerLinks } from "@/lib/site";
import { SmartMaterialsQuoteLink } from "@/components/cart/SmartMaterialsQuoteLink";

export function Footer() {
  return (
    <footer className="border-t border-sand-300 bg-[#2e1a0e] text-sand">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-sand text-terracotta-dark font-display text-lg font-semibold">
              M
            </span>
            <span className="font-display text-lg font-semibold text-white">
              {site.name}
            </span>
          </div>
          <p className="mt-4 text-sm text-sand/80">{site.tagline}</p>
          <p className="mt-2 text-sm text-sand/70">
            Zone d’intervention : {site.serviceArea}
          </p>
          <ul className="mt-4 flex gap-3">
            <SocialLink href={site.social.facebook} label="Facebook">
              <Facebook className="h-5 w-5" aria-hidden="true" />
            </SocialLink>
            <SocialLink href={site.social.instagram} label="Instagram">
              <Instagram className="h-5 w-5" aria-hidden="true" />
            </SocialLink>
          </ul>
        </div>

        <FooterColumn title="Navigation" links={footerLinks.navigation} />
        <FooterQuotesColumn />

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-sand/90">
            Contact
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-sand/80">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                {site.address.street}
                <br />
                {site.address.city}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
              <a
                href={`tel:${site.phoneTel}`}
                className="inline-flex min-h-11 items-center hover:text-white"
              >
                {site.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
              <a
                href={`mailto:${site.email}`}
                className="inline-flex min-h-11 items-center break-all hover:text-white"
              >
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-sand/60 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {site.legalName}. Tous droits réservés.
          </p>
          <ul className="flex gap-4">
            {footerLinks.legal.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-flex min-h-11 items-center hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  if (!href) return null;
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${site.name} sur ${label}`}
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 text-sand transition-colors hover:bg-white/20 hover:text-white"
      >
        {children}
      </a>
    </li>
  );
}

function FooterQuotesColumn() {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-sand/90">
        Devis
      </h2>
      <ul className="mt-4 space-y-3 text-sm text-sand/80">
        <li>
          <SmartMaterialsQuoteLink className="inline-flex min-h-11 items-center hover:text-white">
            Devis matériaux
          </SmartMaterialsQuoteLink>
        </li>
        {footerLinks.quotes
          .filter((link) => link.href !== "/catalogue")
          .map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="inline-flex min-h-11 items-center hover:text-white">
                {link.label}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-sand/90">
        {title}
      </h2>
      <ul className="mt-4 space-y-3 text-sm text-sand/80">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="inline-flex min-h-11 items-center hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
