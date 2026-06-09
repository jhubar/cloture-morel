import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { site, footerLinks } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-sand-300 bg-forest-dark text-sand">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-sand text-forest-dark font-display text-lg font-semibold">
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
        </div>

        <FooterColumn title="Navigation" links={footerLinks.navigation} />
        <FooterColumn title="Devis" links={footerLinks.quotes} />

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
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-white">
                {site.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-sand/60 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {site.name}. Tous droits réservés.
          </p>
          <ul className="flex gap-4">
            {footerLinks.legal.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
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
            <Link href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
