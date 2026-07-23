import {
  Bird,
  DoorOpen,
  EyeOff,
  HelpCircle,
  Landmark,
  PawPrint,
  Rabbit,
  ShieldCheck,
  Trees,
  type LucideIcon,
} from "lucide-react";

/**
 * Guided questionnaire for the pose flow.
 *
 * A lambda visitor rarely knows whether they need "grillage", "post and rail"
 * or "anti-gibier". Instead of dropping them in front of 7 product cards, we
 * ask 1–2 plain-language questions and recommend the right fence type(s).
 *
 * This module is pure data + logic (no UI) so it stays easy to reason about.
 */

/** A top-level project goal (question 1). */
export interface ProjectGoal {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Short cue shown under the label. */
  helper: string;
  /** When true, we ask the follow-up "which animals?" question. */
  needsAnimal?: boolean;
}

export const PROJECT_GOALS: ProjectGoal[] = [
  {
    id: "animaux",
    label: "Garder / contenir des animaux",
    icon: PawPrint,
    helper: "Chevaux, bovins, moutons, volailles…",
    needsAnimal: true,
  },
  {
    id: "gibier",
    label: "Me protéger du gibier sauvage",
    icon: ShieldCheck,
    helper: "Sangliers, cervidés, loups, parcs animaliers.",
  },
  {
    id: "delimiter",
    label: "Délimiter un terrain",
    icon: Trees,
    helper: "Prairie, bois, parcelle, chemin.",
  },
  {
    id: "intimite",
    label: "Me cacher du vis-à-vis",
    icon: EyeOff,
    helper: "Brise-vue naturel et opaque.",
  },
  {
    id: "acces",
    label: "Créer un accès",
    icon: DoorOpen,
    helper: "Portail, portillon, barrière, passage canadien.",
  },
  {
    id: "autre",
    label: "Je ne sais pas encore",
    icon: HelpCircle,
    helper: "On vous guide vers la meilleure solution.",
  },
];

/** Follow-up options when the goal is "animaux". */
export interface AnimalOption {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const ANIMAL_OPTIONS: AnimalOption[] = [
  { id: "chevaux", label: "Chevaux, poneys, ânes", icon: Rabbit },
  { id: "bovins", label: "Bovins (vaches)", icon: PawPrint },
  { id: "ovins", label: "Moutons, chèvres", icon: PawPrint },
  { id: "volailles", label: "Volailles, basse-cour", icon: Bird },
  { id: "autres", label: "Autres / plusieurs", icon: Landmark },
];

/** Result of the guided questionnaire. */
export interface Recommendation {
  /** Ordered fence-type ids (first = primary recommendation). Empty = show all. */
  fenceTypeIds: string[];
  /** Human explanation shown to the visitor. */
  reason: string;
  /** Suggested text to pre-fill the "usage" field (editable). */
  usageHint: string;
}

const ANIMAL_RECOMMENDATIONS: Record<string, Recommendation> = {
  chevaux: {
    fenceTypeIds: ["equestre", "electrique"],
    reason:
      "Pour les chevaux, la clôture équestre en bois (post and rail) est la référence : robuste, esthétique et sûre. L'électrique est un bon complément.",
    usageHint: "Contenir des chevaux / poneys",
  },
  bovins: {
    fenceTypeIds: ["grillage", "electrique"],
    reason:
      "Pour les bovins, un grillage agricole solide (éventuellement complété d'un fil électrique) contient efficacement le troupeau.",
    usageHint: "Contenir des bovins",
  },
  ovins: {
    fenceTypeIds: ["grillage", "electrique"],
    reason:
      "Pour les moutons et chèvres, un grillage à mailles adaptées, souvent doublé d'un fil électrique, est la solution idéale.",
    usageHint: "Contenir des moutons / chèvres",
  },
  volailles: {
    fenceTypeIds: ["grillage"],
    reason:
      "Pour la basse-cour, un grillage à mailles fines et bien tendu protège et contient vos volailles.",
    usageHint: "Contenir des volailles / basse-cour",
  },
  autres: {
    fenceTypeIds: ["grillage", "equestre"],
    reason:
      "Selon vos animaux, un grillage agricole ou une clôture bois convient le mieux. Nicolas affinera avec vous.",
    usageHint: "Contenir des animaux",
  },
};

const GOAL_RECOMMENDATIONS: Record<string, Recommendation> = {
  gibier: {
    fenceTypeIds: ["anti-gibier"],
    reason:
      "Contre le gibier (sangliers, cervidés…), un grillage anti-gibier haute résistance est indispensable.",
    usageHint: "Protection contre le gibier sauvage",
  },
  delimiter: {
    fenceTypeIds: ["grillage", "ganivelles-barbeles"],
    reason:
      "Pour délimiter simplement une parcelle, un grillage agricole ou des ganivelles / fils barbelés font parfaitement l'affaire.",
    usageHint: "Délimiter un terrain",
  },
  intimite: {
    fenceTypeIds: ["brise-vue"],
    reason:
      "Pour vous protéger des regards, un brise-vue naturel en brande de bruyère est 100 % opaque et esthétique.",
    usageHint: "Se cacher du vis-à-vis",
  },
  acces: {
    fenceTypeIds: ["barrieres"],
    reason:
      "Pour un accès, choisissez parmi nos barrières et portails : anglaises, galvanisées, portillons ou passages canadiens.",
    usageHint: "Créer un accès (portail / barrière)",
  },
  autre: {
    fenceTypeIds: [],
    reason:
      "Pas de souci : parcourez les projets ci-dessous ou choisissez « Je ne sais pas encore » — Nicolas vous conseillera la solution adaptée.",
    usageHint: "",
  },
};

/**
 * Recommend fence type(s) from the questionnaire answers.
 * Returns an empty `fenceTypeIds` when we can't narrow it down (show all).
 */
export function recommendFenceTypes(
  goalId: string,
  animalId?: string,
): Recommendation {
  if (goalId === "animaux") {
    if (animalId && ANIMAL_RECOMMENDATIONS[animalId]) {
      return ANIMAL_RECOMMENDATIONS[animalId];
    }
    return ANIMAL_RECOMMENDATIONS.autres;
  }
  return (
    GOAL_RECOMMENDATIONS[goalId] ?? {
      fenceTypeIds: [],
      reason: "",
      usageHint: "",
    }
  );
}
