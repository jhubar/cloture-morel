"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { SelectField, TextAreaField } from "@/components/forms/FormField";
import { compressImage } from "@/components/forms/installation/photo-utils";
import type { InstallationFormState, PhotoFile } from "@/components/forms/installation/types";

const timingOptions = [
  { value: "Dès que possible", label: "Dès que possible" },
  { value: "Dans les 3 mois", label: "Dans les 3 mois" },
  { value: "Dans les 6 mois", label: "Dans les 6 mois" },
  { value: "Pas de date précise", label: "Pas de date précise" },
];

interface StepPhotosProps {
  state: InstallationFormState;
  errors: Record<string, string>;
  onChange: (patch: Partial<InstallationFormState>) => void;
}

export function StepPhotos({ state, errors, onChange }: StepPhotosProps) {
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    setPhotoError(null);
    const remaining = 5 - state.photos.length;
    if (remaining <= 0) {
      setPhotoError("Maximum 5 photos atteint.");
      return;
    }
    const toProcess = Array.from(files).slice(0, remaining);
    setCompressing(true);
    try {
      const results: PhotoFile[] = [];
      for (const file of toProcess) {
        if (file.size > 15 * 1024 * 1024) {
          setPhotoError(`"${file.name}" dépasse 15 MB. Veuillez réduire la taille.`);
          continue;
        }
        const { data, type } = await compressImage(file);
        results.push({
          name: file.name.replace(/[^a-zA-Z0-9._-]/g, "_"),
          data,
          type,
          previewUrl: data,
        });
      }
      onChange({ photos: [...state.photos, ...results] });
    } finally {
      setCompressing(false);
    }
  };

  const removePhoto = (index: number) => {
    onChange({ photos: state.photos.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold uppercase tracking-wider text-bark-muted">
          Photos (optionnel)
        </legend>
        <p className="text-xs text-bark-muted">
          Joignez une vue aérienne (Géoportail, Google Earth…) et/ou des photos du terrain.
          Max&nbsp;5 photos, 15 Mo chacune — compressées automatiquement.
        </p>

        {state.photos.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {state.photos.map((p, i) => (
              <li key={i} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.previewUrl}
                  alt={p.name}
                  className="h-20 w-20 rounded-lg border border-sand-300 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-terracotta text-white shadow"
                  aria-label={`Supprimer ${p.name}`}
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {state.photos.length < 5 && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={compressing}
              className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-sand-300 bg-sand-200/40 px-4 py-3 text-sm text-bark-muted transition-colors hover:border-terracotta/40 hover:bg-terracotta/5 hover:text-terracotta disabled:opacity-60"
            >
              {compressing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Compression…
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4" aria-hidden="true" />
                  <Upload className="h-4 w-4" aria-hidden="true" />
                  Ajouter des photos ({state.photos.length}/5)
                </>
              )}
            </button>
          </>
        )}

        {photoError && <p className="text-xs text-terracotta-dark">{photoError}</p>}
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold uppercase tracking-wider text-bark-muted">
          Calendrier & informations complémentaires
        </legend>
        <SelectField
          label="Délai souhaité (optionnel)"
          name="timing"
          placeholder="Sélectionnez…"
          options={timingOptions}
          value={state.timing}
          onChange={(e) => onChange({ timing: e.target.value })}
          error={errors.timing}
        />
        <TextAreaField
          label="Informations complémentaires (optionnel)"
          name="message"
          placeholder="Précisions sur votre projet, contraintes particulières, questions…"
          value={state.message}
          onChange={(e) => onChange({ message: e.target.value })}
          error={errors.message}
        />
      </fieldset>
    </div>
  );
}
