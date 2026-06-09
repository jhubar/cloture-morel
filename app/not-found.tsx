import Link from "next/link";
import { PageContainer } from "@/components/ui/PageContainer";

export default function NotFound() {
  return (
    <PageContainer className="py-20 text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-forest">404</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-forest-dark">
        Page introuvable
      </h1>
      <p className="mx-auto mt-3 max-w-md text-bark-muted">
        Cette page n’existe pas ou a été déplacée. Retrouvez nos matériaux, notre
        catalogue ou contactez-nous directement.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-full bg-forest px-5 text-sm font-semibold text-white hover:bg-forest-dark"
        >
          Accueil
        </Link>
        <Link
          href="/catalogue"
          className="inline-flex min-h-11 items-center rounded-full border border-sand-300 bg-white px-5 text-sm font-semibold text-forest-dark hover:bg-sand-200/50"
        >
          Catalogue
        </Link>
        <Link
          href="/contact"
          className="inline-flex min-h-11 items-center rounded-full border border-sand-300 bg-white px-5 text-sm font-semibold text-forest-dark hover:bg-sand-200/50"
        >
          Contact
        </Link>
      </div>
    </PageContainer>
  );
}
