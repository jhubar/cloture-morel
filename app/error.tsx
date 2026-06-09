"use client";

import { useEffect } from "react";
import { PageContainer } from "@/components/ui/PageContainer";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageContainer className="py-20 text-center">
      <h1 className="font-display text-2xl font-semibold text-forest-dark">
        Une erreur est survenue
      </h1>
      <p className="mx-auto mt-3 max-w-md text-bark-muted">
        Le chargement de la page a échoué. Vous pouvez réessayer ou revenir à
        l&apos;accueil.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <PrimaryButton onClick={reset} size="lg">
          Réessayer
        </PrimaryButton>
        <SecondaryButton href="/" size="lg">
          Retour à l&apos;accueil
        </SecondaryButton>
      </div>
    </PageContainer>
  );
}
