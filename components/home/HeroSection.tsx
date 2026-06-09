import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import { getCategoryCount, getProductCount } from "@/lib/catalog";

export function HeroSection() {
  const categories = getCategoryCount();
  const products = getProductCount();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sage-soft to-sand">
      {/* Decorative texture — purely presentational */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:radial-gradient(circle_at_1px_1px,rgb(46_90_60/0.12)_1px,transparent_0)] [background-size:22px_22px]"
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24 lg:px-8">
        <div>
          <p className="inline-flex items-center rounded-full bg-white px-3 py-1 text-sm font-medium text-forest ring-1 ring-inset ring-sand-300">
            Vente de matériaux &amp; pose de clôtures
          </p>
          <h1 className="mt-5 text-4xl font-semibold sm:text-5xl lg:text-6xl">
            Vos clôtures, portails et matériaux extérieurs avec un accompagnement
            professionnel
          </h1>
          <p className="mt-5 max-w-xl text-lg text-bark-muted">
            Clôtures Morel vous accompagne pour l’achat de matériaux de clôture et la
            pose de vos projets extérieurs.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryButton href="/catalogue" size="lg">
              Parcourir le catalogue
            </PrimaryButton>
            <SecondaryButton href="/pose" size="lg">
              Demander une pose
            </SecondaryButton>
          </div>

          <dl className="mt-10 flex gap-8">
            <div>
              <dt className="text-sm text-bark-muted">Références</dt>
              <dd className="font-display text-2xl font-semibold text-forest-dark">
                {products}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-bark-muted">Familles de produits</dt>
              <dd className="font-display text-2xl font-semibold text-forest-dark">
                {categories}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-bark-muted">Durabilité acacia</dt>
              <dd className="font-display text-2xl font-semibold text-forest-dark">
                25 ans+
              </dd>
            </div>
          </dl>
        </div>

        {/* Image placeholder — TODO(client): replace with a real outdoor/fencing photo */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-sand-300 bg-white shadow-card lg:aspect-[5/4]">
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-sage/30 via-sand-200 to-sand-300">
            <div className="text-center">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-forest text-white font-display text-3xl mx-auto">
                M
              </span>
              <p className="mt-4 px-6 text-sm text-bark-muted">
                Photo de réalisation à intégrer
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
