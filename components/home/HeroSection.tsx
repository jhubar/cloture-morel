import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { heroCarouselImages } from "@/lib/assets";

export function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[88vh] flex-col justify-end overflow-hidden bg-forest-dark lg:min-h-[100svh]">
      <HeroCarousel images={heroCarouselImages} />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-20 pt-28 sm:px-6 sm:pb-24 lg:px-8 lg:pb-28">
        <p className="font-display text-4xl font-semibold tracking-tight text-white drop-shadow-sm sm:text-5xl lg:text-6xl">
          Clôtures Morel
        </p>
        <p className="mt-3 max-w-md text-sm font-medium uppercase tracking-[0.2em] text-white/80">
          Vente de matériaux &amp; pose de clôtures
        </p>

        <h1 className="mt-6 max-w-2xl text-3xl font-semibold leading-tight text-white drop-shadow-sm sm:text-4xl lg:text-5xl">
          Vos clôtures et travaux extérieurs, du projet à la pose
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/85">
          Découvrez nos réalisations en Belgique et pays limitrophes — matériaux,
          accessoires et pose professionnelle par une équipe spécialisée.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <PrimaryButton href="/catalogue" size="lg">
            Parcourir le catalogue
          </PrimaryButton>
          <SecondaryButton href="/pose" size="lg">
            Demander une pose
          </SecondaryButton>
        </div>
      </div>
    </section>
  );
}
