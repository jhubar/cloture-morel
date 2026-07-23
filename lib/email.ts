import "server-only";
import { site } from "@/lib/site";
import type { MaterialsQuote } from "@/lib/quote";
import type { InstallationQuoteInput, ContactInput } from "@/lib/validation";
import { formatLineAmount } from "@/lib/installation-project";

/**
 * Thin email layer over Resend.
 *
 * Designed to degrade gracefully: if RESEND_API_KEY is not configured, nothing is
 * sent — the submission still succeeds and the caller receives a warning so the UI
 * can inform the user (and, for quotes, still offer the PDF download).
 *
 * Required env (see .env.example):
 *   RESEND_API_KEY            Resend API key
 *   EMAIL_FROM                Verified sender, e.g. "Clôtures Morel <devis@clotures-morel.be>"
 *   QUOTE_NOTIFICATION_EMAIL  Nicolas inbox (Clotures-morel@outlook.com)
 *   EMAIL_TEST_REDIRECT       (optional) When set, EVERY recipient (admin and
 *                             client) is overridden with this address. Use for
 *                             testing only; leave empty in production.
 */

export interface SendResult {
  sent: boolean;
  warning?: string;
}

function recipient(intended: string): string {
  const redirect = process.env.EMAIL_TEST_REDIRECT?.trim();
  return redirect || intended;
}

const NOT_CONFIGURED =
  "L'envoi d'e-mails n'est pas encore configure. Votre demande a bien ete enregistree ; conservez le recapitulatif.";

function getConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? `${site.name} <onboarding@resend.dev>`;
  const admin = process.env.QUOTE_NOTIFICATION_EMAIL ?? site.email;
  return { apiKey, from, admin };
}

async function getResend() {
  const { apiKey } = getConfig();
  if (!apiKey) return null;
  const { Resend } = await import("resend");
  return new Resend(apiKey);
}

type ResendClient = NonNullable<Awaited<ReturnType<typeof getResend>>>;
type EmailPayload = Parameters<ResendClient["emails"]["send"]>[0];

async function sendViaResend(
  resend: ResendClient,
  payload: EmailPayload,
): Promise<SendResult> {
  const { data, error } = await resend.emails.send(payload);
  if (error) {
    console.error("[email] Resend API error", {
      name: error.name,
      message: error.message,
      to: payload.to,
      from: payload.from,
    });
    return {
      sent: false,
      warning: `L'envoi de l'e-mail a echoue (${error.message}).`,
    };
  }
  console.info("[email] Sent", { id: data?.id, to: payload.to });
  return { sent: true };
}

// --- HTML helpers ----------------------------------------------------------

function layout(title: string, body: string): string {
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#faf7f2;font-family:Arial,Helvetica,sans-serif;color:#232b25;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="border-bottom:3px solid #a8521e;padding-bottom:12px;margin-bottom:20px;">
      <span style="font-size:20px;font-weight:bold;color:#a8521e;">${site.name}</span>
      <div style="font-size:12px;color:#5b6b61;">${site.tagline}</div>
    </div>
    <h1 style="font-size:18px;color:#1e3d29;margin:0 0 16px;">${title}</h1>
    ${body}
    <div style="margin-top:28px;border-top:1px solid #e3ddd2;padding-top:12px;font-size:12px;color:#5b6b61;">
      ${site.name} &middot; ${site.address.street}, ${site.address.city}<br/>
      ${site.email} &middot; ${site.phone}
    </div>
  </div></body></html>`;
}

function htmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function row(label: string, value?: string): string {
  if (!value) return "";
  return `<tr>
    <td style="padding:4px 12px 4px 0;color:#5b6b61;vertical-align:top;white-space:nowrap;">${label}</td>
    <td style="padding:4px 0;">${htmlEscape(value)}</td>
  </tr>`;
}

function sectionRow(title: string): string {
  return `<tr><td colspan="2" style="padding:10px 0 4px;border-bottom:2px solid #e3ddd2;font-weight:bold;color:#1e3d29;">${title}</td></tr>`;
}

function projectLinesTable(
  lines: InstallationQuoteInput["projectLines"],
): string {
  if (!lines.length) return "";
  const rows = lines
    .map(
      (line) => `<tr>
        <td style="padding:6px 8px;border-bottom:1px solid #e3ddd2;">${htmlEscape(line.typeLabel)}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e3ddd2;white-space:nowrap;">${htmlEscape(formatLineAmount(line))}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e3ddd2;">${line.notes ? htmlEscape(line.notes) : "—"}</td>
      </tr>`,
    )
    .join("");

  return `<table style="font-size:13px;border-collapse:collapse;width:100%;margin-top:8px;">
    <thead>
      <tr style="background:#f1ece2;">
        <th style="padding:6px 8px;text-align:left;">Type de cloture</th>
        <th style="padding:6px 8px;text-align:left;">Quantite</th>
        <th style="padding:6px 8px;text-align:left;">Notes</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function eur(amount: number): string {
  return new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR" }).format(amount);
}

// --- Public senders --------------------------------------------------------

export async function sendMaterialsQuoteEmails(
  quote: MaterialsQuote,
  pdf: Buffer,
): Promise<SendResult> {
  const resend = await getResend();
  const { from, admin } = getConfig();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY missing — materials quote not emailed.", {
      reference: quote.reference,
      customer: quote.customer.email,
    });
    return { sent: false, warning: NOT_CONFIGURED };
  }

  const { customer } = quote;
  const fullName = `${customer.firstName} ${customer.lastName}`;
  const attachment = {
    filename: `devis-${quote.reference}.pdf`,
    content: pdf.toString("base64"),
  };

  const lineRows = quote.lines
    .map((l) => {
      const qtyLabel = l.piecesPerPalette
        ? `x${l.quantity} palette(s) - ${l.quantity * l.piecesPerPalette} pièces`
        : l.piecesPerPack
          ? l.packUnit === "carton"
            ? `x${l.quantity} carton(s) - ${l.quantity * l.piecesPerPack} pièces`
            : `x${l.quantity} sachet(s) - ${l.quantity * l.piecesPerPack} pièces`
          : `x${l.quantity}`;
      return `<tr><td style="padding:4px 0;border-bottom:1px solid #e3ddd2;">${htmlEscape(l.reference)} <span style="color:#5b6b61;">${qtyLabel}</span></td><td style="padding:4px 0;border-bottom:1px solid #e3ddd2;text-align:right;">${l.lineTotal !== null ? eur(l.lineTotal) : "Sur demande"}</td></tr>`;
    })
    .join("");

  const summaryTable = `<table style="width:100%;border-collapse:collapse;font-size:14px;margin:12px 0;">
    ${lineRows}
    <tr><td style="padding:8px 0;font-weight:bold;">Total estimatif HTVA</td><td style="padding:8px 0;text-align:right;font-weight:bold;color:#1e3d29;">${eur(quote.totalHTVA)}</td></tr>
  </table>`;

  try {
    const adminResult = await sendViaResend(resend, {
      from,
      to: recipient(admin),
      replyTo: customer.email,
      subject: `Nouvelle demande de devis materiaux - ${fullName} (${quote.reference})`,
      html: layout(
        "Nouvelle demande de devis materiaux",
        `<p>Une nouvelle demande de devis a ete soumise via le site.</p>
         <table style="font-size:14px;margin-bottom:12px;">
           ${row("Ref.", quote.reference)}
           ${row("Client", fullName)}
           ${row("Societe", customer.company)}
           ${row("N TVA", customer.vatNumber)}
           ${row("E-mail", customer.email)}
           ${row("Telephone", customer.phone)}
           ${row("Adresse", customer.address)}
         </table>
         ${summaryTable}
         ${customer.message ? `<p style="background:#f1ece2;padding:10px;border-radius:6px;"><strong>Message :</strong><br/>${htmlEscape(customer.message)}</p>` : ""}
         <p style="color:#5b6b61;font-size:13px;">Le recapitulatif PDF est joint a cet e-mail.</p>`,
      ),
      attachments: [attachment],
    });
    if (!adminResult.sent) return adminResult;

    const clientResult = await sendViaResend(resend, {
      from,
      to: recipient(customer.email),
      subject: `Votre demande de devis - ${site.name} (${quote.reference})`,
      html: layout(
        `Merci ${htmlEscape(customer.firstName)}, nous avons bien recu votre demande`,
        `<p>Voici le recapitulatif de votre selection (ref. <strong>${quote.reference}</strong>).
         Nous revenons vers vous rapidement avec un devis personnalise.</p>
         ${summaryTable}
         <p style="color:#5b6b61;font-size:13px;">Le detail complet est disponible dans le PDF joint.
         Ce message est une demande de devis sans engagement.</p>`,
      ),
      attachments: [attachment],
    });
    return clientResult;
  } catch (err) {
    console.error("[email] Failed to send materials quote emails", err);
    return {
      sent: false,
      warning:
        "Votre demande est enregistree, mais l'envoi de l'e-mail a echoue. Conservez le recapitulatif PDF.",
    };
  }
}

export async function sendInstallationEmail(
  data: InstallationQuoteInput,
): Promise<SendResult> {
  const resend = await getResend();
  const { from, admin } = getConfig();
  const fullName = `${data.firstName} ${data.lastName}`;
  if (!resend) {
    console.warn("[email] RESEND_API_KEY missing — installation request not emailed.", data);
    return { sent: false, warning: NOT_CONFIGURED };
  }

  const slopeLabel: Record<string, string> = {
    plat: "Terrain plat",
    leger: "Legere pente",
    important: "Denivele important",
  };
  const accessLabel: Record<string, string> = {
    facile: "Oui, acces facile",
    difficile: "Non, acces difficile",
    inconnu: "Inconnu",
  };
  const clearedLabel: Record<string, string> = {
    oui: "Oui, couloir disponible",
    non: "Non, couloir a preparer",
    partiel: "Partiellement",
  };

  const attachments = (data.photos ?? [])
    .map((p, i) => {
      const prefix = p.kind === "aerienne" ? "vue-aerienne" : "terrain";
      return {
        filename: `${prefix}-${i + 1}-${p.name || "photo.jpg"}`,
        content: p.data.replace(/^data:[^;]+;base64,/, ""),
      };
    })
    .filter((a) => a.content.length > 0);

  const aerialCount = (data.photos ?? []).filter((p) => p.kind === "aerienne").length;
  const terrainCount = (data.photos ?? []).filter((p) => p.kind === "terrain").length;

  const adminBody = `
    <table style="font-size:14px;border-collapse:collapse;width:100%;">
      ${sectionRow("Coordonnees")}
      ${row("Client", fullName)}
      ${row("Societe", data.company)}
      ${row("N TVA", data.vatNumber)}
      ${row("E-mail", data.email)}
      ${row("Telephone", data.phone)}
      ${sectionRow("Projet")}
      ${row("Adresse chantier", data.projectAddress)}
      ${row("Role / usage", data.fenceRole)}
      ${sectionRow("Lignes de cloture")}
    </table>
    ${projectLinesTable(data.projectLines)}
    <table style="font-size:14px;border-collapse:collapse;width:100%;margin-top:12px;">
      ${sectionRow("Etat du terrain")}
      ${row("Barrieres existantes", data.hasBarriers === "oui" ? `Oui - ${data.barriersDetails ?? "non precise"}` : data.hasBarriers === "non" ? "Non" : "")}
      ${row("Acces au chantier", data.siteAccess ? (accessLabel[data.siteAccess] ?? data.siteAccess) : "")}
      ${row("Couloir 5-6 m degage", data.terrainCleared ? (clearedLabel[data.terrainCleared] ?? data.terrainCleared) : "")}
      ${row("Denivele", data.slope ? (slopeLabel[data.slope] ?? data.slope) : "")}
      ${row("Objets sensibles / sol", data.undergroundHazards)}
      ${sectionRow("Calendrier")}
      ${row("Delai souhaite", data.timing)}
    </table>
    ${data.message ? `<p style="background:#f1ece2;padding:10px;border-radius:6px;margin-top:12px;"><strong>Informations complementaires :</strong><br/>${htmlEscape(data.message)}</p>` : ""}
    ${attachments.length > 0 ? `<p style="color:#5b6b61;font-size:13px;margin-top:8px;">${attachments.length} photo(s) jointe(s) : ${aerialCount} vue(s) aerienne(s), ${terrainCount} photo(s) terrain.</p>` : ""}
  `;

  try {
    const adminResult = await sendViaResend(resend, {
      from,
      to: recipient(admin),
      replyTo: data.email,
      subject: `Nouvelle demande de pose - ${fullName}`,
      html: layout("Nouvelle demande de pose", adminBody),
      ...(attachments.length > 0 ? { attachments } : {}),
    });
    if (!adminResult.sent) return adminResult;

    return sendViaResend(resend, {
      from,
      to: recipient(data.email),
      subject: `Votre demande de pose - ${site.name}`,
      html: layout(
        `Merci ${htmlEscape(data.firstName)}, votre demande est bien recue`,
        `<p>Nous etudions votre projet de pose et revenons vers vous rapidement
         pour organiser une visite ou etablir un devis.</p>
         <table style="font-size:14px;margin-top:12px;">
           ${row("Adresse chantier", data.projectAddress)}
           ${row("Delai souhaite", data.timing)}
         </table>
         ${projectLinesTable(data.projectLines)}
         <p style="color:#5b6b61;font-size:13px;margin-top:12px;">
           Vous pouvez repondre a cet e-mail pour joindre des photos supplementaires ou pour toute question.
         </p>`,
      ),
    });
  } catch (err) {
    console.error("[email] Failed to send installation email", err);
    return { sent: false, warning: "L'envoi de l'e-mail a echoue, mais votre demande est enregistree." };
  }
}

export async function sendContactEmail(data: ContactInput): Promise<SendResult> {
  const resend = await getResend();
  const { from, admin } = getConfig();
  const fullName = `${data.firstName} ${data.lastName}`;
  if (!resend) {
    console.warn("[email] RESEND_API_KEY missing — contact message not emailed.", data);
    return { sent: false, warning: NOT_CONFIGURED };
  }

  try {
    const adminResult = await sendViaResend(resend, {
      from,
      to: recipient(admin),
      replyTo: data.email,
      subject: `Nouveau message de contact - ${fullName}`,
      html: layout(
        "Nouveau message de contact",
        `<table style="font-size:14px;">
          ${row("Nom", fullName)}
          ${row("E-mail", data.email)}
          ${row("Telephone", data.phone)}
        </table>
        <p style="background:#f1ece2;padding:10px;border-radius:6px;margin-top:12px;">${htmlEscape(data.message)}</p>`,
      ),
    });
    if (!adminResult.sent) return adminResult;

    return sendViaResend(resend, {
      from,
      to: recipient(data.email),
      subject: `Votre message - ${site.name}`,
      html: layout(
        `Merci ${htmlEscape(data.firstName)}, nous avons bien recu votre message`,
        `<p>Nous revenons vers vous dans les meilleurs delais.</p>
         <p style="background:#f1ece2;padding:10px;border-radius:6px;margin-top:12px;color:#5b6b61;font-size:13px;">
         <strong>Votre message :</strong><br/>${htmlEscape(data.message)}</p>`,
      ),
    });
  } catch (err) {
    console.error("[email] Failed to send contact email", err);
    return { sent: false, warning: "L'envoi de l'e-mail a echoue, mais votre message est enregistre." };
  }
}
