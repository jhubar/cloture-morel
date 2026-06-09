import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";

interface CTAAction {
  href: string;
  label: string;
}

interface CTASectionProps {
  title: string;
  description?: string;
  primary: CTAAction;
  secondary?: CTAAction;
}

/** Reusable conversion band used at the bottom of pages. */
export function CTASection({ title, description, primary, secondary }: CTASectionProps) {
  return (
    <section className="bg-forest">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">{title}</h2>
          {description && <p className="mt-3 text-sand/85">{description}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          <PrimaryButton href={primary.href} size="lg">
            {primary.label}
          </PrimaryButton>
          {secondary && (
            <SecondaryButton href={secondary.href} size="lg">
              {secondary.label}
            </SecondaryButton>
          )}
        </div>
      </div>
    </section>
  );
}
