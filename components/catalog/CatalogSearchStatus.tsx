"use client";

import { Suspense, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, X } from "lucide-react";

interface CatalogSearchStatusProps {
  familyId?: string;
  familyLabel?: string;
}

function CatalogSearchStatusInner({
  familyId,
  familyLabel,
}: CatalogSearchStatusProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const query = searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) return null;

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    const qs = params.toString();
    startTransition(() => {
      router.push(
        qs
          ? `/catalogue?${qs}`
          : familyId
            ? `/catalogue?famille=${familyId}`
            : "/catalogue",
      );
    });
  };

  const backLabel = familyId
    ? `Voir tous les produits — ${familyLabel ?? "cette famille"}`
    : "Voir toutes les familles";

  return (
    <div
      role="status"
      className="flex flex-col gap-3 rounded-card border border-forest/15 bg-white px-4 py-3 shadow-card sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-bark">
        <span className="text-bark-muted">Recherche active :</span>{" "}
        <strong className="text-forest-dark">« {query} »</strong>
        {familyLabel && (
          <span className="text-bark-muted"> dans {familyLabel}</span>
        )}
      </p>
      <button
        type="button"
        onClick={clearSearch}
        disabled={isPending}
        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-sand-300 bg-sage-soft/60 px-4 py-2.5 text-sm font-semibold text-forest-dark transition-colors hover:border-forest/30 hover:bg-sage-soft disabled:opacity-50 cursor-pointer"
      >
        {familyId ? (
          <LayoutGrid className="h-4 w-4" aria-hidden="true" />
        ) : (
          <X className="h-4 w-4" aria-hidden="true" />
        )}
        {isPending ? "…" : backLabel}
      </button>
    </div>
  );
}

export function CatalogSearchStatus(props: CatalogSearchStatusProps) {
  return (
    <Suspense fallback={null}>
      <CatalogSearchStatusInner {...props} />
    </Suspense>
  );
}
