import {
  DoorOpen,
  EyeOff,
  Fence,
  HelpCircle,
  ShieldCheck,
  Trees,
  TreePine,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type MeasureKind = "linear" | "quantity";

const MAT = "/images/site/photos-materiaux";
const REAL =
  "/images/site/realisations-de-clotures-par-clotures-et-travaux-morel-photos-a-fournir";

/**
 * Macro fence types offered in the installation ("pose") quote flow.
 *
 * Unlike the materials catalogue (which exposes precise product families and
 * references), the pose form is oriented around what the customer wants to
 * build. No tooling / accessories here — only fence types.
 */
export interface FenceType {
  id: string;
  label: string;
  icon: LucideIcon;
  measureKind: MeasureKind;
  /** Short helper shown under the label to guide the choice. */
  helper: string;
  /** Representative photo (public path) to help the visitor recognise it. */
  image: string | null;
  /** Alt text / caption for the representative photo. */
  imageAlt: string;
  /** Plain-language cue: "choisissez-moi si…". Guides non-expert visitors. */
  forWhom: string;
  /**
   * Advisory card ("I don't know yet"): rendered without a photo, styled apart,
   * so a lambda visitor can still move forward and let Nicolas advise.
   */
  advisory?: boolean;
}

export const FENCE_TYPES: FenceType[] = [
  {
    id: "grillage",
    label: "Grillage agricole & forestier",
    icon: Trees,
    measureKind: "linear",
    helper: "Bovins, ovins, caprins, équidés, prairies et pistes.",
    forWhom: "Délimiter une prairie, un pré ou un bois, garder vos animaux.",
    image: `${REAL}/1.webp`,
    imageAlt: "Clôture en grillage galvanisé le long d'un pré",
  },
  {
    id: "anti-gibier",
    label: "Anti-gibier",
    icon: ShieldCheck,
    measureKind: "linear",
    helper: "Sangliers, cervidés, loups, parcs animaliers.",
    forWhom: "Protéger des cultures ou une propriété du gros gibier.",
    image: `${MAT}/grillage-et-barbele/grillage-a-mailles-progressives/produit/1.webp`,
    imageAlt: "Grillage haute résistance anti-gibier à mailles progressives",
  },
  {
    id: "equestre",
    label: "Clôture équestre en bois",
    icon: Fence,
    measureKind: "linear",
    helper: "Post and rail robinier, Nobifix ou bois exotique.",
    forWhom: "Un paddock ou un pré à chevaux, esthétique et solide.",
    image: `${REAL}/9.webp`,
    imageAlt: "Clôture équestre post and rail en bois avec chevaux au pré",
  },
  {
    id: "electrique",
    label: "Clôture électrique",
    icon: Zap,
    measureKind: "linear",
    helper: "Adaptée à vos animaux et à votre terrain.",
    forWhom: "Contenir vos animaux avec un fil ou ruban électrifié.",
    image: `${REAL}/30.webp`,
    imageAlt: "Clôture avec fils électrifiés et poteaux bois dans un pré",
  },
  {
    id: "ganivelles-barbeles",
    label: "Ganivelles & fils barbelés",
    icon: TreePine,
    measureKind: "linear",
    helper: "Ganivelles, échalas et fils barbelés.",
    forWhom: "Un décor naturel en châtaignier ou une clôture agricole simple.",
    image: `${MAT}/ganivelles/ganivelles/produit/1.webp`,
    imageAlt: "Ganivelles en robinier faux acacia",
  },
  {
    id: "brise-vue",
    label: "Brise-vue naturel",
    icon: EyeOff,
    measureKind: "linear",
    helper: "Brande de bruyère 100 % opaque.",
    forWhom: "Vous cacher du vis-à-vis avec un brise-vue naturel et opaque.",
    image: `${MAT}/brise-vue-naturels/brandes-de-bruyeres/1.webp`,
    imageAlt: "Brande de bruyère — brise-vue naturel opaque",
  },
  {
    id: "barrieres",
    label: "Barrières & portails",
    icon: DoorOpen,
    measureKind: "quantity",
    helper: "Barrières anglaises, galvanisées, portillons, passages canadiens.",
    forWhom: "Un accès : portail, portillon, barrière ou passage canadien.",
    image: `${MAT}/barrieres-galvanisees/7-tubes-fixes/1.webp`,
    imageAlt: "Barrière galvanisée 7 tubes",
  },
  {
    id: "je-ne-sais-pas",
    label: "Je ne sais pas encore",
    icon: HelpCircle,
    measureKind: "linear",
    helper: "Décrivez votre besoin, Nicolas vous conseille la solution adaptée.",
    forWhom: "Vous connaissez la longueur mais pas la solution ? On vous guide.",
    image: null,
    imageAlt: "",
    advisory: true,
  },
];

const FENCE_TYPE_BY_ID = new Map(FENCE_TYPES.map((t) => [t.id, t]));

export function getFenceType(id: string): FenceType | undefined {
  return FENCE_TYPE_BY_ID.get(id);
}

export function getMeasureLabel(kind: MeasureKind): string {
  return kind === "linear" ? "Longueur (m)" : "Quantité";
}

export function getMeasurePlaceholder(kind: MeasureKind): string {
  return kind === "linear" ? "Ex. 150" : "Ex. 2";
}
