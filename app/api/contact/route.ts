import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { sendContactEmail } from "@/lib/email";
import { isHoneypotTriggered } from "@/lib/spam";

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

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { warning } = await sendContactEmail(parsed.data);
  return NextResponse.json({ ok: true, emailWarning: warning });
}
