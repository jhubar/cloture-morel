"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, Plus, Sparkles } from "lucide-react";
import {
  ANIMAL_OPTIONS,
  PROJECT_GOALS,
  recommendFenceTypes,
} from "@/lib/fence-guide";
import { getFenceType } from "@/lib/fence-types";
import { ImageSlot } from "@/components/ui/ImageSlot";

interface FenceGuideProps {
  /** Add a line for the chosen fence type. */
  onPick: (fenceTypeId: string) => void;
  /** Suggest a usage text (pre-fills the editable "usage" field). */
  onUsageHint: (text: string) => void;
  /**
   * Skip the quiz / browse the full list of fence types. When called from the
   * recommendation screen, the recommended ids are forwarded so the picker can
   * surface them first.
   */
  onBrowseAll: (recommendedIds?: string[]) => void;
}

/**
 * Guided 1–2 question quiz that recommends the right fence type(s) for a
 * visitor who doesn't know what to choose. The choice always stays free:
 * every screen offers a way to browse all types.
 */
export function FenceGuide({ onPick, onUsageHint, onBrowseAll }: FenceGuideProps) {
  const [goal, setGoal] = useState<string | null>(null);
  const [animal, setAnimal] = useState<string | null>(null);

  const currentGoal = PROJECT_GOALS.find((g) => g.id === goal);
  const needsAnimal = currentGoal?.needsAnimal ?? false;
  const showReco = Boolean(goal) && (!needsAnimal || Boolean(animal));

  const reco = useMemo(() => {
    if (!goal || !showReco) return null;
    return recommendFenceTypes(goal, animal ?? undefined);
  }, [goal, animal, showReco]);

  const pick = (fenceTypeId: string, usageHint: string) => {
    if (usageHint) onUsageHint(usageHint);
    onPick(fenceTypeId);
  };

  const resetToStart = () => {
    setGoal(null);
    setAnimal(null);
  };

  // ── Screen 1 — main goal ────────────────────────────────────────────────
  if (!goal) {
    return (
      <QuizShell
        step={1}
        total={2}
        title="Quel est votre projet ?"
        subtitle="Dites-nous ce que vous voulez faire, on vous oriente vers la bonne solution."
        onBrowseAll={onBrowseAll}
      >
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECT_GOALS.map((g) => {
            const Icon = g.icon;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setGoal(g.id)}
                className="group flex items-start gap-3 rounded-xl border border-sand-300 bg-white p-3.5 text-left transition-all hover:border-terracotta/50 hover:bg-terracotta/5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50 cursor-pointer"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-terracotta/10 text-terracotta transition-colors group-hover:bg-terracotta group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-forest-dark">
                    {g.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-bark-muted">
                    {g.helper}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </QuizShell>
    );
  }

  // ── Screen 2 — animals (only when goal = animaux) ───────────────────────
  if (needsAnimal && !animal) {
    return (
      <QuizShell
        step={2}
        total={2}
        title="Quels animaux principalement ?"
        subtitle="Le type de clôture idéal dépend des animaux à contenir."
        onBack={resetToStart}
        onBrowseAll={onBrowseAll}
      >
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {ANIMAL_OPTIONS.map((a) => {
            const Icon = a.icon;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => setAnimal(a.id)}
                className="group flex items-center gap-3 rounded-xl border border-sand-300 bg-white p-3.5 text-left transition-all hover:border-terracotta/50 hover:bg-terracotta/5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50 cursor-pointer"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-terracotta/10 text-terracotta transition-colors group-hover:bg-terracotta group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-forest-dark">
                  {a.label}
                </span>
              </button>
            );
          })}
        </div>
      </QuizShell>
    );
  }

  // ── Screen 3 — recommendation ───────────────────────────────────────────
  if (reco) {
    const recommendedTypes = reco.fenceTypeIds
      .map((id) => getFenceType(id))
      .filter((t): t is NonNullable<ReturnType<typeof getFenceType>> => Boolean(t));

    return (
      <QuizShell
        title="Notre recommandation"
        subtitle={reco.reason}
        onBack={() => (needsAnimal ? setAnimal(null) : resetToStart())}
        onBrowseAll={() => {
          if (reco.usageHint) onUsageHint(reco.usageHint);
          onBrowseAll(reco.fenceTypeIds);
        }}
        badge
      >
        {recommendedTypes.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {recommendedTypes.map((type, index) => (
              <button
                key={type.id}
                type="button"
                onClick={() => pick(type.id, reco.usageHint)}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-sand-300 bg-white text-left shadow-sm transition-all hover:border-terracotta/60 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50 cursor-pointer"
              >
                {index === 0 && (
                  <span className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-terracotta px-2 py-1 text-[11px] font-semibold text-white shadow-sm">
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    Recommandé
                  </span>
                )}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <ImageSlot
                    slot={{
                      src: type.image,
                      alt: type.imageAlt || type.label,
                      hint: type.image ?? "",
                    }}
                    className="h-full w-full transition-transform duration-300 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <span className="block text-sm font-semibold text-forest-dark">
                    {type.label}
                  </span>
                  <span className="mt-1 block flex-1 text-xs text-bark-muted">
                    {type.forWhom}
                  </span>
                  <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-terracotta transition-colors group-hover:text-terracotta-dark">
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    Choisir ce projet
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (reco.usageHint) onUsageHint(reco.usageHint);
              onBrowseAll();
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-terracotta px-5 text-sm font-semibold text-white transition-colors hover:bg-terracotta-dark cursor-pointer"
          >
            Voir tous les types de clôtures
          </button>
        )}
      </QuizShell>
    );
  }

  return null;
}

// ── Layout shell shared by every quiz screen ───────────────────────────────

interface QuizShellProps {
  title: string;
  subtitle?: string;
  step?: number;
  total?: number;
  badge?: boolean;
  onBack?: () => void;
  onBrowseAll: () => void;
  children: React.ReactNode;
}

function QuizShell({
  title,
  subtitle,
  step,
  total,
  badge,
  onBack,
  onBrowseAll,
  children,
}: QuizShellProps) {
  return (
    <div className="rounded-xl border border-sand-300 bg-sand-200/40 p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-bark-muted transition-colors hover:bg-white hover:text-forest-dark cursor-pointer"
              aria-label="Question précédente"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          {step && total ? (
            <span className="text-xs font-semibold uppercase tracking-wide text-terracotta">
              Question {step} / {total}
            </span>
          ) : badge ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-terracotta">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Sur mesure
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onBrowseAll()}
          className="text-xs font-medium text-bark-muted underline underline-offset-2 hover:text-forest-dark cursor-pointer"
        >
          Je sais déjà ce que je veux
        </button>
      </div>

      <p className="text-base font-semibold text-forest-dark">{title}</p>
      {subtitle && (
        <p className="mt-1 mb-4 text-sm leading-relaxed text-bark-muted">{subtitle}</p>
      )}
      {!subtitle && <div className="mb-4" />}

      {children}
    </div>
  );
}
