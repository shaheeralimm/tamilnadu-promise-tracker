import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { isAdminEmail, siteConfig } from "@/lib/config"
import partiesData from "@/data/parties.json"
import { Party } from "@/types"
import { Settings, Shield, Globe, Users, Database } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Settings | Admin",
}

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions)

  if (!isAdminEmail(session?.user?.email)) {
    redirect("/")
  }

  const parties = partiesData as Party[]

  const envVars = [
    {
      key: "NEXT_PUBLIC_SITE_NAME",
      current: process.env.NEXT_PUBLIC_SITE_NAME ?? "(not set — using default)",
      default: "Sonnaanga Senjaangala",
      description: "Site display name shown in the Navbar, Footer, and page titles.",
    },
    {
      key: "NEXT_PUBLIC_SITE_TAGLINE",
      current: process.env.NEXT_PUBLIC_SITE_TAGLINE ?? "(not set — using default)",
      default: "Tamil Nadu Promise Tracker",
      description: "Tagline shown in the site header.",
    },
    {
      key: "NEXT_PUBLIC_ACTIVE_PARTY_ID",
      current: process.env.NEXT_PUBLIC_ACTIVE_PARTY_ID ?? "(not set — using default)",
      default: "tvk",
      description: "ID of the currently active/ruling party. Must match an entry in data/parties.json.",
    },
    {
      key: "ADMIN_EMAILS",
      current: process.env.ADMIN_EMAILS ? "[set — hidden for security]" : "(not set — using fallback)",
      default: "emst.shaheer@gmail.com (hardcoded fallback)",
      description: "Comma-separated list of admin email addresses. Server-only (no NEXT_PUBLIC_ prefix).",
    },
    {
      key: "NEXTAUTH_SECRET",
      current: process.env.NEXTAUTH_SECRET ? "[set]" : "(not set — auth will not work in production)",
      default: "—",
      description: "NextAuth secret key. Required for production deployments.",
    },
    {
      key: "GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET",
      current:
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
          ? "[both set]"
          : "(missing — Google OAuth will not work)",
      default: "—",
      description: "Google OAuth credentials for citizen evidence submission login.",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 md:px-8 py-10 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Settings className="h-7 w-7 text-tvk-blue" />
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Site Settings</h1>
            <p className="text-sm text-muted-foreground">
              Admin-only view. Values are read from environment variables at build/runtime.
            </p>
          </div>
        </div>

        {/* Active Config */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-4 w-4 text-tvk-blue" />
            <h2 className="font-semibold text-foreground">Active Configuration</h2>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                <div className="flex items-center gap-4 px-5 py-3">
                  <span className="text-sm text-muted-foreground w-40 shrink-0">Site Name</span>
                  <span className="text-sm font-medium text-foreground">{siteConfig.siteName}</span>
                </div>
                <div className="flex items-center gap-4 px-5 py-3">
                  <span className="text-sm text-muted-foreground w-40 shrink-0">Site Tagline</span>
                  <span className="text-sm font-medium text-foreground">{siteConfig.siteTagline}</span>
                </div>
                <div className="flex items-center gap-4 px-5 py-3">
                  <span className="text-sm text-muted-foreground w-40 shrink-0">Active Party</span>
                  <span className="text-sm font-medium text-foreground">
                    {parties.find((p) => p.id === siteConfig.activePartyId)?.name ?? siteConfig.activePartyId}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Environment Variables */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-tvk-blue" />
            <h2 className="font-semibold text-foreground">Environment Variables</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            To change these values, update your{" "}
            <code className="bg-slate-100 px-1 rounded">.env.local</code> file and redeploy. On
            Vercel, set them in{" "}
            <strong>Project → Settings → Environment Variables</strong>.
          </p>
          <div className="space-y-3">
            {envVars.map((v) => (
              <Card key={v.key}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <code className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      {v.key}
                    </code>
                    <span className="text-xs text-muted-foreground shrink-0">{v.current}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{v.description}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Default: {v.default}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Party Registry */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-tvk-blue" />
            <h2 className="font-semibold text-foreground">Party Registry</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Managed via{" "}
            <code className="bg-slate-100 px-1 rounded">data/parties.json</code>. Edit that file and
            redeploy to add or update parties.
          </p>
          <div className="space-y-3">
            {parties.map((party) => (
              <Card key={party.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: party.color }}
                    />
                    <span className="font-semibold text-sm text-foreground">{party.name}</span>
                    <span className="text-xs text-muted-foreground">({party.shortName})</span>
                    <span
                      className={`ml-auto text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
                        party.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {party.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-muted-foreground">
                    <span>ID: <code className="text-slate-700">{party.id}</code></span>
                    <span>Election Year: {party.electionYear}</span>
                    <span>CM: {party.cmName}</span>
                    <span>Color: {party.color}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Data files */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-4 w-4 text-tvk-blue" />
            <h2 className="font-semibold text-foreground">Data Files</h2>
          </div>
          <Card>
            <CardContent className="p-0">
              {[
                { file: "data/promises.json", note: "TVK 2026 manifesto promises (active)" },
                { file: "data/parties.json", note: "Party registry — add new parties here" },
                { file: "data/submissions.json", note: "Citizen evidence submissions" },
              ].map((row) => (
                <div key={row.file} className="flex items-center gap-4 px-5 py-3 border-b last:border-b-0 border-border">
                  <code className="text-xs font-mono text-slate-700 w-52 shrink-0">{row.file}</code>
                  <span className="text-xs text-muted-foreground">{row.note}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
