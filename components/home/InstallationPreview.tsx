import { PrimaryButton } from "@/components/ui/Button";
import { PhoneCall, ClipboardList, FileText, Hammer } from "lucide-react";

const steps = [
  { icon: PhoneCall, title: "Contact", text: "Vous nous décrivez votre projet." },
  { icon: ClipboardList, title: "Analyse", text: "Étude du terrain et des besoins." },
  { icon: FileText, title: "Devis", text: "Proposition claire et détaillée." },
  { icon: Hammer, title: "Pose", text: "Installation par nos équipes." },
] as const;

/** Homepage teaser for the installation (pose) activity. */
export function InstallationPreview() {
  return (
    <section className="rounded-card bg-forest-dark px-6 py-12 text-sand sm:px-10">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-sage">
            Service de pose
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            Une clôture posée dans les règles de l’art
          </h2>
          <p className="mt-4 text-sand/85">
            De l’analyse du terrain à l’installation finale, nous prenons en charge
            votre projet extérieur de bout en bout.
          </p>
          <div className="mt-8">
            <PrimaryButton href="/pose#devis" size="lg">
              Demander un devis pose
            </PrimaryButton>
          </div>
        </div>

        <ol className="grid grid-cols-2 gap-4">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li
              key={title}
              className="rounded-xl bg-white/5 p-5 ring-1 ring-inset ring-white/10"
            >
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-sage text-forest-dark">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-sand/70">
                  Étape {i + 1}
                </span>
              </div>
              <h3 className="mt-3 font-semibold text-white">{title}</h3>
              <p className="mt-1 text-sm text-sand/75">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
