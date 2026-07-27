import type { ReactNode } from "react";

interface LegalSectionProps {
  title: string;
  children: ReactNode;
}

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section>
      <h2 className="font-display text-lg font-semibold text-forest-dark">{title}</h2>
      <div className="mt-2 space-y-2 text-bark-muted">{children}</div>
    </section>
  );
}

export function LegalPageLayout({ children }: { children: ReactNode }) {
  return <div className="prose-clm mt-8 max-w-2xl space-y-8 text-bark">{children}</div>;
}
