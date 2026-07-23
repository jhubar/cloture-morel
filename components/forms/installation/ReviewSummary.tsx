"use client";

import { Camera, MapPin } from "lucide-react";
import {
  computeTotalLinearMeters,
  formatLineAmount,
} from "@/lib/installation-project";
import { getFenceType } from "@/lib/fence-types";
import { ImageSlot } from "@/components/ui/ImageSlot";
import type { InstallationFormState } from "@/components/forms/installation/types";

interface ReviewSummaryProps {
  state: InstallationFormState;
  className?: string;
}

const BARRIERS_LABEL: Record<string, string> = {
  oui: "Barrières / portails à intégrer",
  non: "Sans barrière",
};

const ACCESS_LABEL: Record<string, string> = {
  facile: "Accès facile",
  difficile: "Accès difficile",
  inconnu: "Accès à confirmer",
};

const CLEARED_LABEL: Record<string, string> = {
  oui: "Couloir dégagé",
  non: "Couloir à préparer",
  partiel: "Couloir partiel",
};

const SLOPE_LABEL: Record<string, string> = {
  plat: "Terrain plat",
  leger: "Légère pente",
  important: "Dénivelé important",
};

/** Read-only recap of the whole request, shown before the final submit. */
export function ReviewSummary({ state, className }: ReviewSummaryProps) {
  const totalLinear = computeTotalLinearMeters(state.projectLines);
  const aerialCount = state.photos.filter((p) => p.kind === "aerienne").length;
  const terrainCount = state.photos.filter((p) => p.kind === "terrain").length;

  const terrainChips = [
    BARRIERS_LABEL[state.hasBarriers],
    ACCESS_LABEL[state.siteAccess],
    CLEARED_LABEL[state.terrainCleared],
    SLOPE_LABEL[state.slope],
  ].filter(Boolean) as string[];

  return (
    <div
      className={`rounded-card border border-sand-300 bg-sand/40 p-4 sm:p-5 ${className ?? ""}`}
    >
      <p className="text-sm font-semibold text-forest-dark">
        Récapitulatif de votre demande
      </p>
      <p className="mt-0.5 text-xs text-bark-muted">
        Vérifiez avant l&apos;envoi — vous pourrez tout ajuster en revenant en arrière.
      </p>

      {state.projectAddress && (
        <p className="mt-3 flex items-start gap-2 text-sm text-bark">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" aria-hidden="true" />
          {state.projectAddress}
        </p>
      )}

      {state.projectLines.length > 0 && (
        <ul className="mt-3 space-y-2">
          {state.projectLines.map((line, index) => {
            const type = getFenceType(line.fenceTypeId);
            const Icon = type?.icon;
            return (
              <li
                key={`${line.fenceTypeId}-${index}`}
                className="flex items-center gap-3 rounded-md bg-white px-3 py-2 ring-1 ring-inset ring-sand-200"
              >
                <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-md bg-sand-200">
                  {type?.image ? (
                    <ImageSlot
                      slot={{
                        src: type.image,
                        alt: type.imageAlt || line.typeLabel,
                        hint: type.image,
                      }}
                      className="h-full w-full"
                      sizes="40px"
                    />
                  ) : Icon ? (
                    <Icon className="h-4 w-4 text-terracotta" aria-hidden="true" />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-forest-dark">
                    {line.typeLabel}
                  </span>
                  <span className="block text-xs text-bark-muted">
                    {formatLineAmount(line)}
                    {line.notes ? ` · ${line.notes}` : ""}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {totalLinear > 0 && (
        <p className="mt-2 text-xs font-medium text-bark-muted">
          Total linéaire : {totalLinear} m
        </p>
      )}

      {terrainChips.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {terrainChips.map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs text-bark-muted ring-1 ring-inset ring-sand-200"
            >
              {chip}
            </span>
          ))}
        </div>
      )}

      {(aerialCount > 0 || terrainCount > 0) && (
        <p className="mt-3 flex items-center gap-2 text-xs text-bark-muted">
          <Camera className="h-4 w-4 shrink-0 text-terracotta" aria-hidden="true" />
          {aerialCount} vue{aerialCount > 1 ? "s" : ""} aérienne
          {aerialCount > 1 ? "s" : ""} · {terrainCount} photo
          {terrainCount > 1 ? "s" : ""} du terrain
        </p>
      )}
    </div>
  );
}
