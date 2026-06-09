"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, CheckCircle2, Download, Trash2, ArrowLeft, Info, ArrowDown } from "lucide-react";
import {
  useCartStore,
  resolveCartItems,
  selectCartTotalHTVA,
  selectItemCount,
  hasOnRequestPricing,
} from "@/lib/cart-store";
import { formatEUR } from "@/lib/format";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { QuoteRequestForm, type QuoteSubmitResult } from "@/components/forms/QuoteRequestForm";
import { PrimaryButton, SecondaryButton, buttonClasses } from "@/components/ui/Button";
import { base64PdfToObjectUrl, prefersPdfInNewTab } from "@/lib/download-pdf";

export function PanierClient() {
  const items = useCartStore((s) => s.items);
  const hydrated = useCartStore((s) => s.hydrated);
  const clear = useCartStore((s) => s.clear);
  const [result, setResult] = useState<QuoteSubmitResult | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [formInView, setFormInView] = useState(false);

  useEffect(() => {
    const form = document.getElementById("quote-form");
    if (!form) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFormInView(entry.isIntersecting && entry.intersectionRatio >= 0.25),
      { threshold: [0, 0.25, 0.5] },
    );
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  const resolved = resolveCartItems(items);
  const total = selectCartTotalHTVA(resolved);
  const count = selectItemCount(items);
  const onRequest = hasOnRequestPricing(resolved);

  const scrollToForm = () => {
    document.getElementById("quote-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (result) {
    return <Confirmation result={result} />;
  }

  if (!hydrated) {
    return <p className="py-16 text-center text-bark-muted">Chargement de votre sélection…</p>;
  }

  if (count === 0) {
    return (
      <div className="rounded-card border border-sand-300 bg-white px-6 py-16 text-center shadow-card">
        <ShoppingCart className="mx-auto h-12 w-12 text-sage" aria-hidden="true" />
        <h2 className="mt-4 font-display text-xl font-semibold text-forest-dark">
          Votre panier est vide
        </h2>
        <p className="mx-auto mt-2 max-w-md text-bark-muted">
          Parcourez le catalogue et ajoutez les matériaux qui vous intéressent pour
          composer votre demande de devis.
        </p>
        <PrimaryButton href="/catalogue" size="lg" className="mt-6">
          Découvrir le catalogue
        </PrimaryButton>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-8 pb-[calc(10rem+env(safe-area-inset-bottom,0px))] xl:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] xl:pb-0">
        <section aria-labelledby="recap-title" className="order-1 min-w-0 xl:order-1">
          <div className="flex items-center justify-between">
            <h2 id="recap-title" className="font-display text-xl font-semibold text-forest-dark">
              Votre sélection
            </h2>
            {confirmClear ? (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-bark-muted">Tout effacer ?</span>
                <button
                  type="button"
                  onClick={() => {
                    clear();
                    setConfirmClear(false);
                  }}
                  className="font-semibold text-terracotta hover:text-terracotta-dark cursor-pointer"
                >
                  Confirmer
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="text-bark-muted hover:text-bark cursor-pointer"
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="inline-flex items-center gap-1 text-sm text-bark-muted transition-colors hover:text-terracotta cursor-pointer"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Vider
              </button>
            )}
          </div>

          <div className="mt-4 min-w-0 divide-y divide-sand-200 rounded-card border border-sand-300 bg-white px-4 shadow-card sm:px-5">
            {resolved.map((line) => (
              <CartLineItem key={line.product.id} line={line} />
            ))}
          </div>

          <div className="mt-4 rounded-card border border-sand-300 bg-sage-soft/50 px-5 py-4">
            <div className="space-y-1 sm:flex sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-4 sm:gap-y-1">
              <span className="text-sm font-medium text-forest-dark">Total estimatif HTVA</span>
              <span className="block font-display text-2xl font-semibold tabular-nums whitespace-nowrap text-forest-dark">
                {formatEUR(total)}
              </span>
            </div>
          </div>
          {onRequest && (
            <p className="mt-2 flex items-start gap-1.5 text-xs text-bark-muted">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Certains articles sont « sur demande » et ne sont pas inclus dans le total.
              Leur prix vous sera confirmé dans le devis.
            </p>
          )}

          <Link
            href="/catalogue"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-forest transition-colors hover:text-forest-dark"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Continuer mes achats
          </Link>
        </section>

        <section id="quote-form" aria-labelledby="form-title" className="order-2 min-w-0 scroll-mt-24 xl:order-2">
          <div className="rounded-card border border-sand-300 bg-white p-5 shadow-card sm:p-6">
            <h2 id="form-title" className="font-display text-xl font-semibold text-forest-dark">
              Vos coordonnées
            </h2>
            <p className="mt-1 mb-5 text-sm text-bark-muted">
              Nous revenons vers vous rapidement avec un devis personnalisé.
            </p>
            <QuoteRequestForm
              items={items}
              onSubmitted={(r) => {
                clear();
                setResult(r);
              }}
            />
          </div>
        </section>
      </div>

      <div
        aria-hidden={formInView}
        className={`fixed inset-x-0 bottom-0 z-20 border-t border-sand-300 bg-white px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-lg transition-transform duration-300 ease-out xl:hidden ${
          formInView ? "pointer-events-none translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="mx-auto max-w-6xl space-y-2">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-xs text-bark-muted">Total estimatif HTVA</p>
            <p className="shrink-0 font-display text-xl font-semibold tabular-nums whitespace-nowrap text-forest-dark">
              {formatEUR(total)}
            </p>
          </div>
          <button
            type="button"
            onClick={scrollToForm}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-forest px-5 text-sm font-semibold text-white hover:bg-forest-dark cursor-pointer"
          >
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
            Vers le formulaire
          </button>
        </div>
      </div>
    </>
  );
}

function Confirmation({ result }: { result: QuoteSubmitResult }) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [openInNewTab, setOpenInNewTab] = useState(false);
  const filename = result.pdfFilename ?? "devis-clotures-morel.pdf";

  useEffect(() => {
    if (!result.pdfBase64) return;

    let url: string | null = null;
    try {
      url = base64PdfToObjectUrl(result.pdfBase64);
      setPdfUrl(url);
      setOpenInNewTab(prefersPdfInNewTab());
    } catch {
      setPdfUrl(null);
    }

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [result.pdfBase64]);

  return (
    <div className="rounded-card border border-sand-300 bg-white px-6 py-16 text-center shadow-card">
      <CheckCircle2 className="mx-auto h-14 w-14 text-instock" aria-hidden="true" />
      <h2 className="mt-4 font-display text-2xl font-semibold text-forest-dark">
        Demande envoyée, merci !
      </h2>
      <p className="mx-auto mt-2 max-w-md text-bark-muted">
        Votre demande de devis a bien été transmise à Clôtures Morel. Vous recevrez
        un e-mail de confirmation avec le récapitulatif. Nous revenons vers vous très
        rapidement.
      </p>

      {result.emailWarning && (
        <p className="mx-auto mt-4 max-w-md rounded-lg bg-onorder/10 p-3 text-sm text-onorder">
          {result.emailWarning}
        </p>
      )}

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {pdfUrl ? (
          <div className="flex w-full max-w-sm flex-col items-center gap-2">
            <a
              href={pdfUrl}
              download={openInNewTab ? undefined : filename}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("primary", "lg", "w-full sm:w-auto")}
            >
              <Download className="h-5 w-5" aria-hidden="true" />
              {openInNewTab ? "Ouvrir le récapitulatif PDF" : "Télécharger le récapitulatif PDF"}
            </a>
            {openInNewTab ? (
              <p className="text-center text-xs text-bark-muted">
                Le PDF s&apos;ouvre dans Safari. Utilisez « Partager » puis « Enregistrer dans
                Fichiers » pour le conserver.
              </p>
            ) : null}
          </div>
        ) : null}
        <SecondaryButton href="/" size="lg">
          Retour à l&apos;accueil
        </SecondaryButton>
      </div>
    </div>
  );
}
