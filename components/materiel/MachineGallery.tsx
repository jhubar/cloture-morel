"use client";

import { useState } from "react";
import { Lightbox, GalleryThumb, type LightboxImage } from "@/components/ui/Lightbox";

interface MachineGalleryProps {
  images: LightboxImage[];
  className?: string;
}

/**
 * Single-image thumbnail with lightbox browsing for machine/equipment photos.
 * Renders a preview of the first photo; clicking opens all photos in a lightbox.
 */
export function MachineGallery({ images, className }: MachineGalleryProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) return null;

  return (
    <>
      <GalleryThumb
        images={images}
        index={0}
        onOpen={(i) => {
          setActiveIndex(i);
          setOpen(true);
        }}
        className={className}
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <Lightbox
        images={images}
        initialIndex={activeIndex}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
