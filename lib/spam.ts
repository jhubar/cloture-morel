/** Reject bot submissions that fill a hidden honeypot field. */
export function isHoneypotTriggered(body: Record<string, unknown>): boolean {
  const trap = body._hp;
  return typeof trap === "string" && trap.trim().length > 0;
}
