import {
  DoorClosed,
  DoorOpen,
  EyeOff,
  Fence,
  LayoutGrid,
  Tractor,
  TreePine,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { getCategoryTree } from "@/lib/catalog";
import type { CategoryNode } from "@/lib/types";

/**
 * Customer-facing "families" layer on top of the catalog tree.
 *
 * The catalog uses technical category titles ("Piquets en robiniers faux
 * acacia ronds", "Morel Wire", "Pin traités Nobifix") that don't speak to a
 * first-time homeowner. This module maps each navigation group (a CategoryNode
 * keyed by parent id, or a standalone category id) to a plain-language label,
 * a short real-world description and an icon, so the catalogue can open on a
 * friendly grid of choices instead of a wall of jargon. The technical title is
 * kept as a subtitle for people who already know what they want.
 *
 * Keys MUST match the ids returned by getCategoryTree() (catalog parent ids /
 * standalone category ids). When a new family appears in the catalog without an
 * entry here, getFamilies() falls back to the technical title + a generic icon.
 */
export interface FamilyMeta {
  /** Plain-language, customer-friendly name shown first. */
  label: string;
  /** Short helper sentence describing the real-world use. */
  description: string;
  icon: LucideIcon;
}

const FAMILY_META: Record<string, FamilyMeta> = {
  "piquets-en-robiniers-faux-acacia-ronds": {
    label: "Piquets bois",
    description:
      "Supports robustes en acacia pour clôtures, vignes, potagers et tuteurage.",
    icon: TreePine,
  },
  "morel-wire-grillages-barbeles-et-fils-galvanises": {
    label: "Grillages & fils",
    description:
      "Pour délimiter et clôturer un terrain : mailles, barbelés et fils galvanisés.",
    icon: LayoutGrid,
  },
  "barrieres-galvanisees": {
    label: "Barrières métal",
    description:
      "Barrières d'accès galvanisées pour champs et parcelles, avec poteaux et quincaillerie.",
    icon: DoorOpen,
  },
  "barrieres-anglaises": {
    label: "Barrières bois",
    description:
      "Barrières anglaises décoratives en bois exotique, poteaux et accessoires.",
    icon: DoorClosed,
  },
  "brandes-de-bruyere": {
    label: "Brise-vue naturel",
    description:
      "Brande de bruyère 100 % opaque pour s'isoler des regards en toute discrétion.",
    icon: EyeOff,
  },
  "outillage-et-accessoires-clotures": {
    label: "Outillage & accessoires",
    description:
      "Tout le nécessaire pour poser, tendre et entretenir vos clôtures.",
    icon: Wrench,
  },
  "ganivelles-en-robiniers-faux-acacia": {
    label: "Ganivelles bois",
    description:
      "Clôture à lattes en acacia, idéale pour jardins, allées et bords de mer.",
    icon: Fence,
  },
  "cloture-equestre": {
    label: "Clôture équestre",
    description:
      "Solutions pour prairies et chevaux : post & rail acacia, pin traité Nobifix et bois exotique.",
    icon: Tractor,
  },
};

const FALLBACK_ICON: LucideIcon = Fence;

/** A navigation family enriched with customer-friendly presentation data. */
export interface Family extends CategoryNode {
  /** Customer-friendly label (shown first). */
  label: string;
  /** Original technical title, shown as a subtitle. */
  techTitle: string;
  description: string;
  icon: LucideIcon;
  /** Total products across all sub-categories of the family. */
  productCount: number;
}

/** Build the list of families from the catalog tree + presentation metadata. */
export function getFamilies(): Family[] {
  return getCategoryTree().map((node) => {
    const meta = FAMILY_META[node.id];
    const productCount = node.categories.reduce(
      (sum, category) => sum + category.products.length,
      0,
    );
    return {
      ...node,
      label: meta?.label ?? node.title,
      techTitle: node.title,
      description: meta?.description ?? "",
      icon: meta?.icon ?? FALLBACK_ICON,
      productCount,
    };
  });
}

export function getFamilyById(id: string): Family | undefined {
  return getFamilies().find((family) => family.id === id);
}

/** Resolve the family that contains a given (technical) category id. */
export function getFamilyForCategory(categoryId: string): Family | undefined {
  return getFamilies().find((family) =>
    family.categories.some((category) => category.id === categoryId),
  );
}
