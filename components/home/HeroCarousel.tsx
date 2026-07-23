"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ImageSlot } from "@/lib/assets";
import { cn } from "@/lib/utils";

/** Minimum horizontal travel (px) to register a swipe. */
const SWIPE_THRESHOLD = 40;

interface HeroCarouselProps {
  images: ImageSlot[];
  /** Autoplay interval in ms. */
  interval?: number;
  className?: string;
}

/**
 * Full-bleed background carousel for the homepage hero.
 * Crossfades between realisation photos, pauses on hover/focus,
 * and stays on the first frame when the user prefers reduced motion.
 */
export function HeroCarousel({
  images,
  interval = 5000,
  className,
}: HeroCarouselProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);
  const touchStartX = useRef<number | null>(null);

  const goNext = useCallback(() => {
    setActive((current) => (current + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setActive((current) => (current - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = query.matches;
    const onChange = (event: MediaQueryListEvent) => {
      reducedMotion.current = event.matches;
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // Depends on `active` so the timer restarts after each change (auto or
  // manual): a manual swipe/arrow gives the visitor a full interval to look.
  useEffect(() => {
    if (paused || images.length <= 1) return;
    if (reducedMotion.current) return;

    const timer = window.setInterval(goNext, interval);
    return () => window.clearInterval(timer);
  }, [paused, images.length, interval, active, goNext]);

  if (images.length === 0) return null;

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    }
  };

  return (
    <div
      className={cn("group absolute inset-0 overflow-hidden touch-pan-y", className)}
      role="group"
      aria-roledescription="carrousel"
      aria-label="Réalisations de clôtures"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {images.map((image, index) => (
        <div
          key={image.src ?? index}
          aria-hidden={index !== active}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out motion-reduce:transition-none",
            index === active ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={image.src ?? ""}
            alt={index === active ? image.alt : ""}
            fill
            priority={index === 0}
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ))}

      {/* Readability gradient — darker at the bottom where the copy sits. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-forest-dark/85 via-forest-dark/45 to-forest-dark/25"
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Réalisation précédente"
            className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-forest-dark/40 text-white opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-forest-dark/70 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white group-hover:opacity-100 sm:left-5 cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Réalisation suivante"
            className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-forest-dark/40 text-white opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-forest-dark/70 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white group-hover:opacity-100 sm:right-5 cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </>
      )}

      {images.length > 1 && (
        <div className="absolute inset-x-0 bottom-5 z-10 flex justify-center gap-2.5 sm:bottom-7">
          {images.map((image, index) => (
            <button
              key={image.src ?? index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Afficher la réalisation ${index + 1} sur ${images.length}`}
              aria-current={index === active}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                index === active
                  ? "w-7 bg-white"
                  : "w-2.5 bg-white/50 hover:bg-white/80",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
