import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  /** When false, removes default vertical padding (for flush hero sections). */
  padded?: boolean;
}

/** Consistent max-width wrapper used across every page section. */
export function PageContainer({
  children,
  className,
  padded = true,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8",
        padded && "py-12 sm:py-16",
        className,
      )}
    >
      {children}
    </div>
  );
}
