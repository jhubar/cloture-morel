import type { MaterialsQuote, QuoteLine } from "@/lib/quote";

/**
 * Rendu HTML du tableau des lignes de devis pour les e-mails.
 *
 * Fonction pure (pas de `server-only`) afin d'être testable et partagée par
 * les deux e-mails (admin Nicolas + confirmation client). Le niveau de détail
 * est aligné sur le PDF : article, quantité, prix unitaire HTVA, total ligne.
 */

function eur(amount: number): string {
  return new Intl.NumberFormat("fr-BE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

function htmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Ex. "2 palettes", "3 unités", "1 sachet", "1 carton". */
function quantityLabel(line: QuoteLine): string {
  const plural = line.quantity > 1;
  let unit = line.unitLabel;
  if (plural) {
    if (unit === "palette") unit = "palettes";
    else if (unit === "sachet") unit = "sachets";
    else if (unit === "carton") unit = "cartons";
    else if (unit === "unité") unit = "unités";
  }
  return `${line.quantity} ${unit}`;
}

/** Sous-ligne : catégorie + conditionnement (palette/sachet/carton de N pièces). */
function conditionnementLabel(line: QuoteLine): string {
  const parts: string[] = [];
  if (line.category) parts.push(line.category);
  if (line.piecesPerPalette) {
    parts.push(`palette de ${line.piecesPerPalette} pièces`);
  } else if (line.piecesPerPack) {
    const kind = line.packUnit === "carton" ? "carton" : "sachet";
    parts.push(`${kind} de ${line.piecesPerPack} pièces`);
  }
  return parts.join(" · ");
}

const TD = "padding:8px 6px;border-bottom:1px solid #e3ddd2;vertical-align:top;";
const TH =
  "padding:6px;border-bottom:2px solid #e3ddd2;text-align:left;font-size:12px;color:#5b6b61;text-transform:uppercase;letter-spacing:.03em;";

function lineRow(line: QuoteLine): string {
  const title = htmlEscape(line.label || line.reference);
  const sub = htmlEscape(conditionnementLabel(line));
  const unitPrice =
    line.unitPrice !== null ? eur(line.unitPrice) : "Sur demande";
  const total = line.lineTotal !== null ? eur(line.lineTotal) : "Sur demande";
  return `<tr>
    <td style="${TD}">
      <div style="font-weight:bold;color:#232b25;">${title}</div>
      ${sub ? `<div style="font-size:12px;color:#5b6b61;">${sub}</div>` : ""}
    </td>
    <td style="${TD}white-space:nowrap;">${htmlEscape(quantityLabel(line))}</td>
    <td style="${TD}text-align:right;white-space:nowrap;">${unitPrice}</td>
    <td style="${TD}text-align:right;white-space:nowrap;font-weight:bold;">${total}</td>
  </tr>`;
}

/** Tableau complet (en-têtes + lignes + total estimatif HTVA). */
export function renderQuoteLinesTable(quote: MaterialsQuote): string {
  const rows = quote.lines.map(lineRow).join("");
  // Si toutes les lignes sont "sur demande", le total à 0,00 € serait trompeur.
  const totalDisplay =
    quote.totalHTVA === 0 && quote.hasOnRequest
      ? "Sur demande"
      : eur(quote.totalHTVA);
  const onRequestNote =
    quote.hasOnRequest && quote.totalHTVA > 0
      ? `<tr><td colspan="4" style="padding:4px 6px;font-size:12px;color:#5b6b61;">Certains articles sont sur demande et ne sont pas inclus dans ce total.</td></tr>`
      : "";
  return `<table style="width:100%;border-collapse:collapse;font-size:14px;margin:12px 0;">
    <thead>
      <tr>
        <th style="${TH}">Article</th>
        <th style="${TH}">Qté</th>
        <th style="${TH}text-align:right;">P.U. HTVA</th>
        <th style="${TH}text-align:right;">Total HTVA</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
      <tr>
        <td colspan="3" style="padding:10px 6px;font-weight:bold;">Total estimatif HTVA</td>
        <td style="padding:10px 6px;text-align:right;font-weight:bold;color:#1e3d29;">${totalDisplay}</td>
      </tr>
      ${onRequestNote}
    </tbody>
  </table>`;
}
