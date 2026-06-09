import Image from "next/image";
import { ImageIcon } from "lucide-react";
import type { ImageSlot as ImageSlotConfig } from "@/lib/assets";
import { cn } from "@/lib/utils";

interface ImageSlotProps {
  slot: ImageSlotConfig;
  className?: string;
  /** Shown in placeholder mode — helps Nicolas know what to shoot. */
  showHint?: boolean;
  sizes?: string;
  priority?: boolean;
}

/**
 * Renders a real image when `slot.src` is set, otherwise a styled placeholder
 * with the alt text and optional filename hint for the client.
 */
export function ImageSlot({
  slot,
  className,
  showHint = false,
  sizes = "100vw",
  priority = false,
}: ImageSlotProps) {
  if (slot.src) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={slot.src}
          alt={slot.alt}
          fill
          className="object-cover"
          sizes={sizes}
          priority={priority}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative grid place-items-center bg-gradient-to-br from-sage/25 via-sand-200 to-sand-300 text-center",
        className,
      )}
      role="img"
      aria-label={slot.alt}
    >
      <div className="px-6 py-8 sm:px-10 sm:py-12">
        <ImageIcon className="mx-auto h-10 w-10 text-sage sm:h-12 sm:w-12" aria-hidden="true" />
        <p className="mt-4 text-base font-medium text-forest-dark sm:text-lg">{slot.alt}</p>
        {showHint && (
          <p className="mt-1 text-xs text-bark-muted">Photo à fournir — {slot.hint}</p>
        )}
      </div>
    </div>
  );
}
