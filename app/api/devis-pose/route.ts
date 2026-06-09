import { NextResponse } from "next/server";
import { installationQuoteSchema } from "@/lib/validation";
import { sendInstallationEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = installationQuoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { warning } = await sendInstallationEmail(parsed.data);
  return NextResponse.json({ ok: true, emailWarning: warning });
}
