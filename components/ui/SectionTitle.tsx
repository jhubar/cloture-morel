import { cn } from "@/lib/utils";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
}

/** Reusable section heading with optional eyebrow label and description. */
export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  as: Heading = "h2",
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-terracotta">
          {eyebrow}
        </p>
      )}
      <Heading
        className={cn(
          Heading === "h1"
            ? "text-3xl sm:text-4xl lg:text-5xl"
            : "text-2xl sm:text-3xl",
          "font-semibold",
        )}
      >
        {title}
      </Heading>
      {description && (
        <p className="mt-4 text-base text-bark-muted sm:text-lg">{description}</p>
      )}
    </div>
  );
}
