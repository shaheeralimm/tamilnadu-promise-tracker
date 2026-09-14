/**
 * Central site configuration — read from environment variables with safe defaults.
 *
 * Client-visible values use NEXT_PUBLIC_ prefix.
 * Server-only values (admin emails) do NOT use NEXT_PUBLIC_.
 *
 * To customise, set these in .env.local:
 *   NEXT_PUBLIC_SITE_NAME=Sonnaanga Senjaangala
 *   NEXT_PUBLIC_SITE_TAGLINE=Tamil Nadu Promise Tracker
 *   NEXT_PUBLIC_ACTIVE_PARTY_ID=tvk
 *   ADMIN_EMAILS=you@example.com,another@example.com
 */

export const siteConfig = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME ?? "Sonnaanga Senjaangala",
  siteTagline: process.env.NEXT_PUBLIC_SITE_TAGLINE ?? "Tamil Nadu Promise Tracker",
  siteTitle:
    `${process.env.NEXT_PUBLIC_SITE_NAME ?? "Sonnaanga Senjaangala"} | Tamil Nadu Promise Tracker`,
  siteDescription:
    "An independent citizen-maintained ledger tracking government promises in Tamil Nadu.",
  activePartyId: process.env.NEXT_PUBLIC_ACTIVE_PARTY_ID ?? "tvk",
} as const

/**
 * Returns the list of admin emails from the ADMIN_EMAILS environment variable.
 * Only safe to call on the server side.
 */
export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? ""
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

/**
 * Check whether an email address belongs to an admin.
 * Falls back to the hardcoded default so existing deployments don't break.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const lower = email.toLowerCase()
  const admins = getAdminEmails()
  // Fallback: if ADMIN_EMAILS is not set at all, use the default
  if (admins.length === 0) {
    return lower === "emst.shaheer@gmail.com"
  }
  return admins.includes(lower)
}
