/**
 * Détection de l'environnement de déploiement.
 *
 * Vercel expose `VERCEL_ENV` = "production" | "preview" | "development".
 * On ne considère « production » (indexable, e-mails réels, etc.) que pour le
 * déploiement de production. Les Preview/staging et le local sont traités comme
 * non-production : pas d'indexation moteur de recherche.
 */
export function isProductionSite(): boolean {
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv) return vercelEnv === "production";
  // Hors Vercel (self-host, CI…) : on se rabat sur NODE_ENV.
  return process.env.NODE_ENV === "production";
}
