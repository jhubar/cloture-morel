import { poseGalleryImages } from "@/lib/assets";
import { ImageSlot } from "@/components/ui/ImageSlot";

/**
 * Gallery of completed projects. Shows placeholders until photos are added
 * under public/images/pose-gallery/ (see lib/assets.ts).
 */
export function ProjectGallery() {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {poseGalleryImages.map((slot, i) => (
        <ImageSlot
          key={i}
          slot={slot}
          showHint
          className="aspect-[4/3] rounded-card border border-sand-300 shadow-card"
          sizes="(max-width: 640px) 100vw, 25vw"
        />
      ))}
    </div>
  );
}
