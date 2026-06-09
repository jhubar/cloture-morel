import { Upload } from "lucide-react";
import { site } from "@/lib/site";

/**
 * Placeholder for future file upload on pose quotes.
 * When storage is wired (UploadThing, S3, etc.), replace the inner content
 * with an <input type="file" /> or dropzone — API: app/api/devis-pose/route.ts
 */
export function PhotoUploadSlot() {
  return (
    <div
      className="rounded-lg border border-dashed border-sand-300 bg-sand-200/40 px-4 py-5 text-center text-sm text-bark-muted"
      aria-labelledby="photo-upload-title"
    >
      <Upload className="mx-auto mb-1.5 h-5 w-5 text-sage" aria-hidden="true" />
      <p id="photo-upload-title" className="font-medium text-forest-dark">
        Photos du terrain (bientôt en ligne)
      </p>
      <p className="mt-1">
        En attendant, envoyez vos photos à{" "}
        <a
          href={`mailto:${site.email}`}
          className="inline-flex min-h-11 items-center break-all text-forest hover:underline"
        >
          {site.email}
        </a>{" "}
        en indiquant votre nom et l&apos;adresse du chantier.
      </p>
      <p className="mt-2 text-xs text-bark-muted">
        Emplacement prévu : upload direct dans ce formulaire (à brancher).
      </p>
    </div>
  );
}
