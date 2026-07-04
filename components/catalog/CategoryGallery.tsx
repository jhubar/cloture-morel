"use client";

import { useState } from "react";
import { GalleryThumb, Lightbox, type LightboxImage } from "@/components/ui/Lightbox";

interface CategoryGalleryProps {
  images: LightboxImage[];
}

/** Thumbnail grid + lightbox, used for categories without product cards yet. */
export function CategoryGallery({ images }: CategoryGalleryProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img, i) => (
          <GalleryThumb
            key={img.src}
            images={images}
            index={i}
            onOpen={(idx) => {
              setIndex(idx);
              setOpen(true);
            }}
            className="aspect-[4/3] rounded-card border border-sand-300 shadow-card"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ))}
      </div>
      <Lightbox images={images} initialIndex={index} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
