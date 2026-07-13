"use client";

import { useCallback, useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LightboxImage {
  src: string;
  alt: string;
}

interface LightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
}

export function Lightbox({ images, initialIndex = 0, open, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);

  // Reset index when opened at a new position
  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, prev, next]);

  if (!images.length) return null;
  const current = images[index];

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/85 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed inset-0 z-50 flex flex-col items-center justify-center outline-none"
        >
          <Dialog.Title className="sr-only">
            {images.length > 1
              ? `Galerie photo — ${current.alt} (${index + 1} sur ${images.length})`
              : current.alt}
          </Dialog.Title>
          {/* Close */}
          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute right-4 top-4 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </Dialog.Close>

          {/* Counter */}
          {images.length > 1 && (
            <p className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-sm font-medium text-white">
              {index + 1} / {images.length}
            </p>
          )}

          {/* Image */}
          <div className="relative mx-auto max-h-[80vh] w-full max-w-5xl px-14">
            <div className="relative flex items-center justify-center" style={{ height: "80vh" }}>
              <Image
                key={current.src}
                src={current.src}
                alt={current.alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
              />
            </div>
          </div>

          {/* Caption */}
          <p className="mt-3 px-4 text-center text-sm text-white/70">{current.alt}</p>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 sm:left-4"
                aria-label="Image précédente"
              >
                <ChevronLeft className="h-6 w-6" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 sm:right-4"
                aria-label="Image suivante"
              >
                <ChevronRight className="h-6 w-6" aria-hidden="true" />
              </button>
            </>
          )}

          {/* Thumbnail strip (when ≥ 3 images) */}
          {images.length >= 3 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 px-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Voir ${img.alt}`}
                  className={cn(
                    "h-1.5 cursor-pointer rounded-full transition-all",
                    i === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70",
                  )}
                />
              ))}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ── Gallery thumbnail that opens the lightbox on click ────────────────────────

interface GalleryThumbProps {
  images: LightboxImage[];
  index?: number;
  className?: string;
  sizes?: string;
  fit?: "cover" | "contain";
  onOpen: (index: number) => void;
}

export function GalleryThumb({
  images,
  index = 0,
  className,
  sizes = "100vw",
  fit = "cover",
  onOpen,
}: GalleryThumbProps) {
  const img = images[index];
  if (!img) return null;

  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      className={cn(
        "group relative cursor-zoom-in overflow-hidden",
        fit === "contain" && "bg-sand-200",
        className,
      )}
      aria-label={`Agrandir : ${img.alt}`}
    >
      <Image
        src={img.src}
        alt={img.alt}
        fill
        className={cn(
          fit === "contain"
            ? "object-contain p-4"
            : "object-cover transition-transform duration-300 group-hover:scale-105",
        )}
        sizes={sizes}
      />
      {/* Badge multi-photos */}
      {images.length > 1 && (
        <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
          <span aria-hidden="true">⊞</span>
          {images.length}
        </span>
      )}
    </button>
  );
}
