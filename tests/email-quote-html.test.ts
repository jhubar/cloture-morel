import { describe, expect, it } from "vitest";

import { renderQuoteLinesTable } from "@/lib/email-quote-html";
import { buildMaterialsQuote } from "@/lib/quote";
import type { MaterialsQuote, QuoteLine } from "@/lib/quote";

/** QuoteLine minimale avec valeurs par défaut surchargées par le test. */
function line(partial: Partial<QuoteLine>): QuoteLine {
  return {
    reference: "REF",
    label: "Produit",
    category: "Catégorie",
    quantity: 1,
    unitLabel: "unité",
    piecesPerPalette: null,
    piecesPerPack: null,
    packUnit: undefined,
    piecePrice: null,
    unitPrice: null,
    lineTotal: null,
    onRequest: false,
    ...partial,
  };
}

function quoteWith(lines: QuoteLine[]): MaterialsQuote {
  const totalHTVA = lines.reduce((sum, l) => sum + (l.lineTotal ?? 0), 0);
  return {
    reference: "DM-TEST-0001",
    date: "1 janvier 2026",
    customer: {
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean@example.com",
      phone: "0470000000",
      address: "Rue de Test 1, 4000 Liège",
    },
    lines,
    totalHTVA,
    hasOnRequest: lines.some((l) => l.onRequest),
    taxNote: "Tous les prix sont HTVA",
  };
}

/** Enlève les espaces (dont insécables) pour comparer sans bruit de formatage. */
function squish(html: string): string {
  return html.replace(/\u00a0|\u202f/g, " ").replace(/\s+/g, " ");
}

describe("renderQuoteLinesTable — en-têtes", () => {
  it("affiche les 4 colonnes Article / Qté / P.U. / Total", () => {
    const html = renderQuoteLinesTable(quoteWith([line({})]));
    expect(html).toContain("Article");
    expect(html).toContain("Qté");
    expect(html).toContain("P.U. HTVA");
    expect(html).toContain("Total HTVA");
  });
});

describe("renderQuoteLinesTable — ligne palette", () => {
  const html = squish(
    renderQuoteLinesTable(
      quoteWith([
        line({
          reference: "180 cm diamètre 8/10 cm",
          label: "Piquets en robiniers faux acacia — 180 cm diamètre 8/10 cm",
          category: "Piquets en robiniers faux acacia ronds",
          quantity: 2,
          unitLabel: "palette",
          piecesPerPalette: 100,
          piecePrice: 5.95,
          unitPrice: 595,
          lineTotal: 1190,
        }),
      ]),
    ),
  );

  it("montre le nom d'article complet", () => {
    expect(html).toContain(
      "Piquets en robiniers faux acacia — 180 cm diamètre 8/10 cm",
    );
  });

  it("montre la quantité en palettes", () => {
    expect(html).toContain("2 palettes");
  });

  it("montre le conditionnement (100 pièces)", () => {
    expect(html).toContain("palette de 100 pièces");
  });

  it("montre le prix unitaire et le total", () => {
    expect(html).toContain("595,00");
    expect(html).toContain("1 190,00");
  });
});

describe("renderQuoteLinesTable — ligne à l'unité", () => {
  const html = squish(
    renderQuoteLinesTable(
      quoteWith([
        line({
          reference: "365 cm",
          label: "7 tubes fixes — 365 cm",
          category: "Barrières fixes en 7 tubes H.120 cm",
          quantity: 3,
          unitLabel: "unité",
          piecePrice: 133.53,
          unitPrice: 133.53,
          lineTotal: 400.59,
        }),
      ]),
    ),
  );

  it("montre la quantité en unités", () => {
    expect(html).toContain("3 unités");
  });

  it("montre P.U. et total", () => {
    expect(html).toContain("133,53");
    expect(html).toContain("400,59");
  });
});

describe("renderQuoteLinesTable — ligne sachet", () => {
  const html = squish(
    renderQuoteLinesTable(
      quoteWith([
        line({
          reference: "Gripple plus médium",
          label: "Gripple — Gripple plus médium",
          category: "Outillage et accessoires clôtures",
          quantity: 1,
          unitLabel: "sachet",
          piecesPerPack: 20,
          packUnit: "sachet",
          piecePrice: 0.94,
          unitPrice: 18.8,
          lineTotal: 18.8,
        }),
      ]),
    ),
  );

  it("montre la quantité en sachet", () => {
    expect(html).toContain("1 sachet");
  });

  it("montre le conditionnement (20 pièces)", () => {
    expect(html).toContain("sachet de 20 pièces");
  });
});

describe("renderQuoteLinesTable — prix sur demande", () => {
  const html = renderQuoteLinesTable(
    quoteWith([
      line({
        reference: "Protech Evo",
        label: "Autoporteur télécommandé — Protech Evo",
        category: "Outillage et accessoires clôtures",
        quantity: 1,
        unitLabel: "unité",
        unitPrice: null,
        lineTotal: null,
        onRequest: true,
      }),
    ]),
  );

  it("affiche « Sur demande » sans montant inventé", () => {
    expect(html).toContain("Sur demande");
    expect(html).not.toContain("0,00");
  });
});

describe("renderQuoteLinesTable — total", () => {
  it("affiche le total estimatif = somme des lignes", () => {
    const html = squish(
      renderQuoteLinesTable(
        quoteWith([
          line({ unitPrice: 595, lineTotal: 1190, quantity: 2, unitLabel: "palette" }),
          line({ unitPrice: 133.53, lineTotal: 400.59, quantity: 3 }),
        ]),
      ),
    );
    expect(html).toContain("Total estimatif HTVA");
    expect(html).toContain("1 590,59");
  });
});

describe("intégration — buildMaterialsQuote + rendu", () => {
  it("lit label et prix palette 2026 depuis le catalogue", () => {
    const quote = buildMaterialsQuote({
      customer: {
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean@example.com",
        phone: "0470000000",
        address: "Rue de Test 1, 4000 Liège",
      },
      items: [
        {
          productId:
            "piquets-en-robiniers-faux-acacia-ronds-180-cm-diametre-8-10-cm-2",
          quantity: 2,
        },
      ],
    });
    const html = squish(renderQuoteLinesTable(quote));
    // Prix 2026 : 5,95 €/pc × 100 = 595 €/palette × 2 = 1 190 €
    expect(html).toContain("2 palettes");
    expect(html).toContain("palette de 100 pièces");
    expect(html).toContain("595,00");
    expect(html).toContain("1 190,00");
  });
});
