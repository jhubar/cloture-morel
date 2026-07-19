"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ImageSlot } from "@/lib/assets";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = query.matches;
    const onChange = (event: MediaQueryListEvent) => {
      reducedMotion.current = event.matches;
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (paused || images.length <= 1) return;
    if (reducedMotion.current) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % images.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [paused, images.length, interval]);

  if (images.length === 0) return null;

  return (
    <div
      className={cn("absolute inset-0 overflow-hidden", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
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
