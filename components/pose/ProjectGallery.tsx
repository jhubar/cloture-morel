"use client";

import { useState } from "react";
import { poseGalleryImages } from "@/lib/assets";
import { Lightbox, GalleryThumb } from "@/components/ui/Lightbox";

const lightboxImages = poseGalleryImages
  .filter((s) => s.src !== null)
  .map((s) => ({ src: s.src!, alt: s.alt }));

/**
 * Grid of 42 completed project photos.
 * Clicking any photo opens a full-screen lightbox with prev/next navigation.
 */
export function ProjectGallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const open = (i: number) => {
    setActiveIndex(i);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {lightboxImages.map((img, i) => (
          <GalleryThumb
            key={i}
            images={lightboxImages}
            index={i}
            onOpen={open}
            className="aspect-[4/3] rounded-card border border-sand-300 shadow-card"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ))}
      </div>

      <Lightbox
        images={lightboxImages}
        initialIndex={activeIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
