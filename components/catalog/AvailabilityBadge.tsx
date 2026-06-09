import { cn } from "@/lib/utils";

interface AvailabilityBadgeProps {
  availability: string | null | undefined;
  className?: string;
}

/** Colored pill reflecting stock state ("En stock", "Sur commande", ...). */
export function AvailabilityBadge({ availability, className }: AvailabilityBadgeProps) {
  // Many catalog rows have no availability set: render nothing rather than an
  // empty/misleading pill.
  if (!availability || !availability.trim()) return null;

  const normalized = availability.toLowerCase();
  const inStock = normalized.includes("stock");
  const onOrder = normalized.includes("commande");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        inStock && "bg-emerald-50 text-instock",
        onOrder && "bg-amber-50 text-onorder",
        !inStock && !onOrder && "bg-sand-200 text-bark-muted",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          inStock ? "bg-instock" : onOrder ? "bg-onorder" : "bg-bark-muted",
        )}
      />
      {availability}
    </span>
  );
}
