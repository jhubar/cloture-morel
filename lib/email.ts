import "server-only";
import { site } from "@/lib/site";
import type { MaterialsQuote } from "@/lib/quote";
import type { InstallationQuoteInput, ContactInput } from "@/lib/validation";

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

/**
 * Resolve the actual recipient. In test mode (EMAIL_TEST_REDIRECT set), all
 * mail is funnelled to a single inbox regardless of the intended address.
 */
function recipient(intended: string): string {
  const redirect = process.env.EMAIL_TEST_REDIRECT?.trim();
  return redirect || intended;
}

const NOT_CONFIGURED =
  "L’envoi d’e-mails n’est pas encore configuré. Votre demande a bien été enregistrée ; conservez le récapitulatif.";

function getConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? `${site.name} <onboarding@resend.dev>`;
  const admin = process.env.QUOTE_NOTIFICATION_EMAIL ?? site.email;
  return { apiKey, from, admin };
}

async function getResend() {
  const { apiKey } = getConfig();
  if (!apiKey) return null;
  // Lazy import so the SDK is only loaded when actually configured.
  const { Resend } = await import("resend");
  return new Resend(apiKey);
}

type ResendClient = NonNullable<Awaited<ReturnType<typeof getResend>>>;
type EmailPayload = Parameters<ResendClient["emails"]["send"]>[0];

/**
 * Resend returns `{ data, error }` and does not throw on API errors — we must
 * inspect `error` or failures stay invisible (empty dashboard, false success).
 */
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
      warning: `L’envoi de l’e-mail a échoué (${error.message}).`,
    };
  }
  console.info("[email] Sent", { id: data?.id, to: payload.to });
  return { sent: true };
}

// --- HTML helpers ----------------------------------------------------------

function layout(title: string, body: string): string {
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#faf7f2;font-family:Arial,Helvetica,sans-serif;color:#232b25;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="border-bottom:3px solid #1e3d29;padding-bottom:12px;margin-bottom:20px;">
      <span style="font-size:20px;font-weight:bold;color:#1e3d29;">${site.name}</span>
      <div style="font-size:12px;color:#5b6b61;">${site.tagline}</div>
    </div>
    <h1 style="font-size:18px;color:#1e3d29;margin:0 0 16px;">${title}</h1>
    ${body}
    <div style="margin-top:28px;border-top:1px solid #e3ddd2;padding-top:12px;font-size:12px;color:#5b6b61;">
      ${site.name} · ${site.address.street}, ${site.address.city}<br/>
      ${site.email} · ${site.phone}
    </div>
  </div></body></html>`;
}

function escape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function row(label: string, value?: string): string {
  if (!value) return "";
  return `<tr>
    <td style="padding:4px 12px 4px 0;color:#5b6b61;vertical-align:top;white-space:nowrap;">${label}</td>
    <td style="padding:4px 0;">${escape(value)}</td>
  </tr>`;
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
        ? `×${l.quantity} palette(s) — ${l.quantity * l.piecesPerPalette} pièces`
        : `×${l.quantity}`;
      return `<tr><td style="padding:4px 0;border-bottom:1px solid #e3ddd2;">${escape(l.reference)} <span style="color:#5b6b61;">${qtyLabel}</span></td><td style="padding:4px 0;border-bottom:1px solid #e3ddd2;text-align:right;">${l.lineTotal !== null ? eur(l.lineTotal) : "Sur demande"}</td></tr>`;
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
      subject: `Nouvelle demande de devis matériaux — ${fullName} (${quote.reference})`,
      html: layout(
        "Nouvelle demande de devis matériaux",
        `<p>Une nouvelle demande de devis a été soumise via le site.</p>
         <table style="font-size:14px;margin-bottom:12px;">
           ${row("Réf.", quote.reference)}
           ${row("Client", fullName)}
           ${row("Société", customer.company)}
           ${row("N° TVA", customer.vatNumber)}
           ${row("E-mail", customer.email)}
           ${row("Téléphone", customer.phone)}
           ${row("Adresse", customer.address)}
         </table>
         ${summaryTable}
         ${customer.message ? `<p style="background:#f1ece2;padding:10px;border-radius:6px;"><strong>Message :</strong><br/>${escape(customer.message)}</p>` : ""}
         <p style="color:#5b6b61;font-size:13px;">Le récapitulatif PDF est joint à cet e-mail.</p>`,
      ),
      attachments: [attachment],
    });
    if (!adminResult.sent) return adminResult;

    const clientResult = await sendViaResend(resend, {
      from,
      to: recipient(customer.email),
      subject: `Votre demande de devis — ${site.name} (${quote.reference})`,
      html: layout(
        `Merci ${escape(customer.firstName)}, nous avons bien reçu votre demande`,
        `<p>Voici le récapitulatif de votre sélection (réf. <strong>${quote.reference}</strong>).
         Nous revenons vers vous rapidement avec un devis personnalisé.</p>
         ${summaryTable}
         <p style="color:#5b6b61;font-size:13px;">Le détail complet est disponible dans le PDF joint.
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
        "Votre demande est enregistrée, mais l’envoi de l’e-mail a échoué. Conservez le récapitulatif PDF.",
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

  try {
    const adminResult = await sendViaResend(resend, {
      from,
      to: recipient(admin),
      replyTo: data.email,
      subject: `Nouvelle demande de pose — ${fullName}`,
      html: layout(
        "Nouvelle demande de pose",
        `<table style="font-size:14px;">
          ${row("Client", fullName)}
          ${row("Société", data.company)}
          ${row("N° TVA", data.vatNumber)}
          ${row("E-mail", data.email)}
          ${row("Téléphone", data.phone)}
          ${row("Adresse chantier", data.projectAddress)}
          ${row("Type de clôture", data.fenceType)}
          ${row("Longueur approx.", data.approximateLength)}
          ${row("Terrain", data.terrain)}
          ${row("Délai souhaité", data.timing)}
        </table>
        ${data.message ? `<p style="background:#f1ece2;padding:10px;border-radius:6px;margin-top:12px;"><strong>Projet :</strong><br/>${escape(data.message)}</p>` : ""}`,
      ),
    });
    if (!adminResult.sent) return adminResult;

    return sendViaResend(resend, {
      from,
      to: recipient(data.email),
      subject: `Votre demande de pose — ${site.name}`,
      html: layout(
        `Merci ${escape(data.firstName)}, votre demande est bien reçue`,
        `<p>Nous étudions votre projet de pose et revenons vers vous rapidement
         pour organiser une visite ou établir un devis.</p>
         <p style="color:#5b6b61;font-size:13px;">Vous pouvez répondre à cet e-mail pour joindre des photos de votre terrain.</p>`,
      ),
    });
  } catch (err) {
    console.error("[email] Failed to send installation email", err);
    return { sent: false, warning: "L’envoi de l’e-mail a échoué, mais votre demande est enregistrée." };
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
      subject: `Nouveau message de contact — ${fullName}`,
      html: layout(
        "Nouveau message de contact",
        `<table style="font-size:14px;">
          ${row("Nom", fullName)}
          ${row("E-mail", data.email)}
          ${row("Téléphone", data.phone)}
        </table>
        <p style="background:#f1ece2;padding:10px;border-radius:6px;margin-top:12px;">${escape(data.message)}</p>`,
      ),
    });
    if (!adminResult.sent) return adminResult;

    return sendViaResend(resend, {
      from,
      to: recipient(data.email),
      subject: `Votre message — ${site.name}`,
      html: layout(
        `Merci ${escape(data.firstName)}, nous avons bien reçu votre message`,
        `<p>Nous revenons vers vous dans les meilleurs délais.</p>
         <p style="background:#f1ece2;padding:10px;border-radius:6px;margin-top:12px;color:#5b6b61;font-size:13px;">
         <strong>Votre message :</strong><br/>${escape(data.message)}</p>`,
      ),
    });
  } catch (err) {
    console.error("[email] Failed to send contact email", err);
    return { sent: false, warning: "L’envoi de l’e-mail a échoué, mais votre message est enregistré." };
  }
}
