export const COOKIE_CONSENT_KEY = "cm-cookie-consent";
export const COOKIE_CONSENT_EVENT = "cm-cookie-consent-update";

export type CookieConsent = "accepted" | "essential";

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (value === "accepted" || value === "essential") return value;
  return null;
}

export function setCookieConsent(value: CookieConsent): void {
  localStorage.setItem(COOKIE_CONSENT_KEY, value);
  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
}

export function hasMapConsent(): boolean {
  return getCookieConsent() === "accepted";
}
