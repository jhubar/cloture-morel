import { ChevronDown } from "lucide-react";
import { PageContainer } from "@/components/ui/PageContainer";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import type { FaqItem } from "@/lib/faq";
import { cn } from "@/lib/utils";

interface FaqSectionProps {
  items: FaqItem[];
  id?: string;
  title?: string;
  description?: string;
  className?: string;
  /** When false, renders without PageContainer wrapper (e.g. inside panier layout). */
  contained?: boolean;
}

export function FaqSection({
  items,
  id = "faq",
  title = "Questions fréquentes",
  description = "Tout ce qu’il faut savoir sur nos prix, la livraison et les demandes de devis.",
  className,
  contained = true,
}: FaqSectionProps) {
  const content = (
    <>
      <FaqJsonLd items={items} />
      <SectionTitle eyebrow="FAQ" title={title} description={description} />
      <div className="mt-8 max-w-3xl space-y-3">
        {items.map((item) => (
          <details
            key={item.id}
            id={item.id}
            className="group rounded-card border border-sand-300 bg-white shadow-card open:shadow-md"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-medium text-forest-dark marker:content-none [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <ChevronDown
                className="h-5 w-5 shrink-0 text-forest transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="border-t border-sand-200 px-5 pb-4 pt-3 text-sm leading-relaxed text-bark-muted">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </>
  );

  if (!contained) {
    return (
      <section id={id} className={cn(className)}>
        {content}
      </section>
    );
  }

  return (
    <section id={id} className={cn("bg-sand-200/50", className)}>
      <PageContainer className="py-14 sm:py-16">{content}</PageContainer>
    </section>
  );
}
