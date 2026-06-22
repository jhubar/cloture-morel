"use client";

import { Suspense, useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

interface CatalogSearchBarProps {
  /** When set, new searches keep this family filter in the URL. */
  familyId?: string;
  placeholder?: string;
}

function CatalogSearchBarInner({
  familyId,
  placeholder = "Rechercher une référence, un grillage, un piquet…",
}: CatalogSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const currentQ = searchParams.get("q") ?? "";
  const [value, setValue] = useState(currentQ);

  useEffect(() => {
    setValue(currentQ);
  }, [currentQ]);

  const pushQuery = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = next.trim();
    if (trimmed.length >= 2) params.set("q", trimmed);
    else params.delete("q");
    if (familyId) params.set("famille", familyId);
    const qs = params.toString();
    startTransition(() => {
      router.push(
        qs ? `/catalogue?${qs}` : familyId ? `/catalogue?famille=${familyId}` : "/catalogue",
      );
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    pushQuery(value);
  };

  const clear = () => {
    setValue("");
    pushQuery("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setValue(next);
    // Retour automatique aux familles (ou à la famille) dès que la recherche active est effacée.
    if (next.trim().length < 2 && currentQ.trim().length >= 2) {
      pushQuery("");
    }
  };

  const canSubmit = value.trim().length >= 2;

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex max-w-xl items-center gap-1.5 rounded-full border border-sand-300 bg-white py-1.5 pl-11 pr-1.5 shadow-sm focus-within:border-forest focus-within:ring-2 focus-within:ring-forest/20"
      role="search"
    >
      <label htmlFor="catalog-search" className="sr-only">
        Rechercher dans le catalogue
      </label>
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-bark-muted"
        aria-hidden="true"
      />
      {/* type="text" — évite la croix native du navigateur (doublon avec notre bouton effacer) */}
      <input
        id="catalog-search"
        type="text"
        role="searchbox"
        name="q"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete="off"
        enterKeyHint="search"
        className="min-w-0 flex-1 border-0 bg-transparent py-2 text-base text-bark outline-none placeholder:text-bark-muted/70"
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={clear}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-bark-muted transition-colors hover:bg-sand-200 cursor-pointer"
          aria-label="Effacer la recherche"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
      <button
        type="submit"
        disabled={isPending || !canSubmit}
        className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-terracotta px-4 text-sm font-semibold text-white transition-colors hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
      >
        {isPending ? "…" : "Chercher"}
      </button>
    </form>
  );
}

export function CatalogSearchBar(props: CatalogSearchBarProps) {
  return (
    <Suspense
      fallback={
        <div className="h-12 max-w-xl animate-pulse rounded-full bg-sand-200" aria-hidden="true" />
      }
    >
      <CatalogSearchBarInner {...props} />
    </Suspense>
  );
}
