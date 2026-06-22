import type { ProjectLine } from "@/lib/installation-project";

export type PhotoFile = { name: string; data: string; type: string; previewUrl: string };

export type InstallationFormState = {
  projectAddress: string;
  fenceRole: string;
  projectLines: ProjectLine[];
  hasBarriers: "" | "oui" | "non";
  barriersDetails: string;
  siteAccess: "" | "facile" | "difficile" | "inconnu";
  terrainCleared: "" | "oui" | "non" | "partiel";
  slope: "" | "plat" | "leger" | "important";
  undergroundHazards: string;
  timing: string;
  message: string;
  photos: PhotoFile[];
  firstName: string;
  lastName: string;
  company: string;
  vatNumber: string;
  email: string;
  phone: string;
  disclaimerAccepted: boolean;
};

export const emptyInstallationForm: InstallationFormState = {
  projectAddress: "",
  fenceRole: "",
  projectLines: [],
  hasBarriers: "",
  barriersDetails: "",
  siteAccess: "",
  terrainCleared: "",
  slope: "",
  undergroundHazards: "",
  timing: "",
  message: "",
  photos: [],
  firstName: "",
  lastName: "",
  company: "",
  vatNumber: "",
  email: "",
  phone: "",
  disclaimerAccepted: false,
};

export const WIZARD_STEPS = [
  { id: 1, label: "Votre clôture" },
  { id: 2, label: "Terrain" },
  { id: 3, label: "Photos" },
  { id: 4, label: "Coordonnées" },
] as const;
