import { CheckCircle2, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";

interface FormSuccessPanelProps {
  title: string;
  message: string;
  emailWarning?: string | null;
  children?: React.ReactNode;
}

export function FormSuccessPanel({
  title,
  message,
  emailWarning,
  children,
}: FormSuccessPanelProps) {
  return (
    <div className="rounded-card border border-sand-300 bg-white px-6 py-12 text-center shadow-card">
      <CheckCircle2 className="mx-auto h-12 w-12 text-instock" aria-hidden="true" />
      <h3 className="mt-4 font-display text-xl font-semibold text-forest-dark">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-bark-muted">{message}</p>

      {emailWarning && (
        <p className="mx-auto mt-4 max-w-md rounded-lg bg-onorder/10 p-3 text-sm text-onorder">
          {emailWarning}
        </p>
      )}

      <p className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 text-sm text-bark">
        <Phone className="h-4 w-4 shrink-0 text-forest" aria-hidden="true" />
        Besoin d&apos;une réponse rapide ?{" "}
        <a href={`tel:${site.phoneTel}`} className="font-medium text-forest hover:text-forest-dark">
          {site.phone}
        </a>
      </p>

      {children && <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">{children}</div>}

      {!children && (
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <PrimaryButton href="/catalogue" size="lg">
            Parcourir le catalogue
          </PrimaryButton>
          <SecondaryButton href="/" size="lg">
            Retour à l&apos;accueil
          </SecondaryButton>
        </div>
      )}
    </div>
  );
}
