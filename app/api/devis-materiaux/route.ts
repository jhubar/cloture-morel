import { NextResponse } from "next/server";
import { createElement } from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { materialsQuoteSchema } from "@/lib/validation";
import { buildMaterialsQuote } from "@/lib/quote";
import { MaterialsQuotePdf } from "@/lib/pdf/MaterialsQuotePdf";
import { sendMaterialsQuoteEmails } from "@/lib/email";
import { isHoneypotTriggered } from "@/lib/spam";

// PDF generation (@react-pdf/renderer) requires the Node.js runtime.
export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (isHoneypotTriggered(body as Record<string, unknown>)) {
    return NextResponse.json({ ok: true });
  }

  const parsed = materialsQuoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const quote = buildMaterialsQuote(parsed.data);
  if (quote.lines.length === 0) {
    return NextResponse.json(
      { error: "Aucun produit valide dans la sélection." },
      { status: 422 },
    );
  }

  let pdf: Buffer;
  try {
    const element = createElement(MaterialsQuotePdf, { quote }) as Parameters<
      typeof renderToBuffer
    >[0];
    pdf = await renderToBuffer(element);
  } catch (err) {
    console.error("[devis-materiaux] PDF generation failed", err);
    return NextResponse.json(
      { error: "La génération du PDF a échoué. Veuillez réessayer." },
      { status: 500 },
    );
  }

  const { warning } = await sendMaterialsQuoteEmails(quote, pdf);

  return NextResponse.json({
    ok: true,
    reference: quote.reference,
    pdfBase64: pdf.toString("base64"),
    pdfFilename: `devis-${quote.reference}.pdf`,
    emailWarning: warning,
  });
}
