"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, CheckCircle2, Download, Trash2, ArrowLeft, Info } from "lucide-react";
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
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";

export function PanierClient() {
  const items = useCartStore((s) => s.items);
  const hydrated = useCartStore((s) => s.hydrated);
  const clear = useCartStore((s) => s.clear);
  const [result, setResult] = useState<QuoteSubmitResult | null>(null);

  const resolved = resolveCartItems(items);
  const total = selectCartTotalHTVA(resolved);
  const count = selectItemCount(items);
  const onRequest = hasOnRequestPricing(resolved);

  // --- Confirmation screen -------------------------------------------------
  if (result) {
    return <Confirmation result={result} />;
  }

  // --- Loading (pre-hydration) --------------------------------------------
  if (!hydrated) {
    return <p className="py-16 text-center text-bark-muted">Chargement de votre sélection…</p>;
  }

  // --- Empty cart ----------------------------------------------------------
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

  // --- Review + form -------------------------------------------------------
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
      {/* Cart recap (editable) */}
      <section aria-labelledby="recap-title">
        <div className="flex items-center justify-between">
          <h2 id="recap-title" className="font-display text-xl font-semibold text-forest-dark">
            Votre sélection
          </h2>
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-1 text-sm text-bark-muted transition-colors hover:text-terracotta cursor-pointer"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Vider
          </button>
        </div>

        <div className="mt-4 divide-y divide-sand-200 rounded-card border border-sand-300 bg-white px-5 shadow-card">
          {resolved.map((line) => (
            <CartLineItem key={line.product.id} line={line} />
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-card border border-sand-300 bg-sage-soft/50 px-5 py-4">
          <span className="text-sm font-medium text-forest-dark">Total estimatif HTVA</span>
          <span className="font-display text-2xl font-semibold text-forest-dark">
            {formatEUR(total)}
          </span>
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

      {/* Customer form */}
      <section aria-labelledby="form-title">
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
  );
}

function Confirmation({ result }: { result: QuoteSubmitResult }) {
  const downloadPdf = () => {
    if (!result.pdfBase64) return;
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${result.pdfBase64}`;
    link.download = result.pdfFilename ?? "devis-clotures-morel.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        {result.pdfBase64 && (
          <PrimaryButton onClick={downloadPdf} size="lg">
            <Download className="h-5 w-5" aria-hidden="true" />
            Télécharger le récapitulatif PDF
          </PrimaryButton>
        )}
        <SecondaryButton href="/" size="lg">
          Retour à l’accueil
        </SecondaryButton>
      </div>
    </div>
  );
}
