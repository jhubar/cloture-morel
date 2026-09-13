import { describe, expect, it } from "vitest";

import { findProduct } from "@/lib/catalog";
import { getProductPricing } from "@/lib/pricing";
import { isNumericPrice } from "@/lib/format";
import {
  BATEMAN_2026,
  PIQUETS_2026,
  PIQUETS_HORS_PDF,
  STOCKADE_EXISTANT_2026,
  STOCKADE_NOUVEAUX_2026,
} from "./prix-2026.fixture";

/** Arrondi 2 décimales pour comparer des montants EUR sans bruit flottant. */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

describe("Piquets acacia — tarif palette 2026", () => {
  for (const t of PIQUETS_2026) {
    describe(`${t.hauteur} cm Ø ${t.diametre}`, () => {
      const entry = findProduct(t.id);

      it("existe dans le catalogue", () => {
        expect(entry, `produit introuvable: ${t.id}`).toBeDefined();
      });

      it("a le prix par pièce 2026", () => {
        expect(entry!.product.prixUnitaireHTVA).toBe(t.prixPiece);
      });

      it("a le bon nombre par palette", () => {
        expect(entry!.product.details?.nombre_par_palette).toBe(String(t.nombreParPalette));
      });

      it("a le prix camion complet 2026", () => {
        expect(entry!.product.prixCamionCompletHTVA).toBe(t.prixPieceCamion);
      });

      it("facture le prix palette = pièce × nombre", () => {
        const pricing = getProductPricing(entry!.product);
        expect(pricing.isPalette).toBe(true);
        expect(pricing.piecesPerPalette).toBe(t.nombreParPalette);
        expect(round2(pricing.unitPrice!)).toBe(round2(t.prixPalette));
      });
    });
  }
});

describe("Piquets 12/14 cm hors PDF — prix actuels conservés", () => {
  for (const t of PIQUETS_HORS_PDF) {
    it(`${t.hauteur} cm Ø ${t.diametre} garde ${t.prixPiece} €/pc × ${t.nombreParPalette}`, () => {
      const entry = findProduct(t.id);
      expect(entry, `produit introuvable: ${t.id}`).toBeDefined();
      expect(entry!.product.prixUnitaireHTVA).toBe(t.prixPiece);
      expect(entry!.product.details?.nombre_par_palette).toBe(String(t.nombreParPalette));
      expect(entry!.product.prixCamionCompletHTVA).toBe(t.prixPieceCamion);
    });
  }
});

describe("Barrières galvanisées Bateman LM + poteaux (inchangés 2026)", () => {
  for (const t of BATEMAN_2026) {
    it(`${t.id} = ${t.prix} € HTVA`, () => {
      const entry = findProduct(t.id);
      expect(entry, `produit introuvable: ${t.id}`).toBeDefined();
      expect(entry!.product.prixUnitaireHTVA).toBe(t.prix);
    });
  }
});

describe("Clameuse Stockade — existant inchangé", () => {
  for (const t of STOCKADE_EXISTANT_2026) {
    it(`${t.id} = ${t.prix} € HTVA`, () => {
      const entry = findProduct(t.id);
      expect(entry, `produit introuvable: ${t.id}`).toBeDefined();
      expect(entry!.product.prixUnitaireHTVA).toBe(t.prix);
    });
  }
});

describe("Clameuse Stockade — nouveaux consommables 2026", () => {
  for (const t of STOCKADE_NOUVEAUX_2026) {
    describe(t.reference, () => {
      const entry = findProduct(t.id);

      it("existe dans le catalogue", () => {
        expect(entry, `produit introuvable: ${t.id}`).toBeDefined();
      });

      it("est dans l'article Clameuse avec le bon prix", () => {
        expect(entry!.product.article).toBe("Clameuse");
        expect(entry!.product.reference).toBe(t.reference);
        expect(entry!.product.prixUnitaireHTVA).toBe(t.prix);
      });

      it("est vendu à l'unité (pas de logique palette/sachet)", () => {
        const pricing = getProductPricing(entry!.product);
        expect(pricing.isPalette).toBe(false);
        expect(pricing.isPack).toBe(false);
        expect(pricing.unitLabel).toBe("unité");
        expect(isNumericPrice(entry!.product.prixUnitaireHTVA)).toBe(true);
        expect(pricing.unitPrice).toBe(t.prix);
      });
    });
  }
});
