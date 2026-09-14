import React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, MinusCircle, XCircle, PauseCircle, ArrowRight, Landmark } from "lucide-react"
import partiesData from "@/data/parties.json"
import promisesData from "@/lib/getAllPromises"
import { Party, Promise as PromiseType } from "@/types"

export const metadata = {
  title: "Governments Tracked | Tamil Nadu Promise Tracker",
  description: "Browse all Tamil Nadu governments and election manifestos tracked on this platform.",
}

function getPartyStats(partyId: string) {
  const promises = (promisesData as PromiseType[]).filter((p) => p.partyId === partyId)
  const total = promises.length
  if (total === 0) return { total: 0, fulfilled: 0, modified: 0, inProgress: 0, stalled: 0, notFulfilled: 0, fulfilledPct: 0 }

  const fulfilled = promises.filter((p) => p.status === "fulfilled").length
  const modified = promises.filter((p) => p.status === "modified").length
  const inProgress = promises.filter((p) => p.status === "in-progress").length
  const stalled = promises.filter((p) => p.status === "stalled").length
  const notFulfilled = promises.filter((p) => p.status === "not-fulfilled" || p.status === "evaded").length

  return {
    total,
    fulfilled,
    modified,
    inProgress,
    stalled,
    notFulfilled,
    fulfilledPct: Math.round(((fulfilled + modified) / total) * 100),
  }
}

export default function PartiesPage() {
  const parties = partiesData as Party[]

  return (
    <div className="min-h-screen bg-slate-50/30">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 md:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Landmark className="h-8 w-8 text-tvk-blue" />
            <h1 className="text-3xl font-display font-bold text-foreground">Governments Tracked</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            An independent record of election promises made by Tamil Nadu governments, across multiple
            parties and election cycles. Select a government to browse its manifesto promises and
            implementation status.
          </p>
        </div>
      </div>

      {/* Party cards */}
      <div className="container mx-auto px-4 md:px-8 py-10">
        <div className="grid gap-6 md:grid-cols-2">
          {parties.map((party) => {
            const stats = getPartyStats(party.id)
            const isActive = party.status === "active"

            return (
              <Card
                key={party.id}
                className="overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Color stripe */}
                <div className="h-1.5 w-full" style={{ backgroundColor: party.color }} />

                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{ backgroundColor: party.color }}
                        />
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {party.shortName} · {party.electionYear}
                        </span>
                        {isActive ? (
                          <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-muted-foreground">Historical</Badge>
                        )}
                      </div>
                      <h2 className="text-xl font-display font-bold text-foreground">{party.name}</h2>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        CM: {party.cmName} · {party.electionYear} Election Manifesto
                      </p>
                    </div>
                  </div>

                  {stats.total > 0 ? (
                    <>
                      {/* Progress bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>{stats.fulfilledPct}% Delivered</span>
                          <span>{stats.total} total promises</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                          <div
                            className="h-full bg-green-500 transition-all"
                            style={{ width: `${Math.round((stats.fulfilled / stats.total) * 100)}%` }}
                          />
                          <div
                            className="h-full bg-amber-400"
                            style={{ width: `${Math.round((stats.modified / stats.total) * 100)}%` }}
                          />
                          <div
                            className="h-full bg-blue-400"
                            style={{ width: `${Math.round((stats.inProgress / stats.total) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Status counts */}
                      <div className="grid grid-cols-3 gap-2 mb-5">
                        <div className="flex items-center gap-1.5 text-sm">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
                          <span className="text-foreground font-medium">{stats.fulfilled}</span>
                          <span className="text-muted-foreground text-xs">Fulfilled</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm">
                          <MinusCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                          <span className="text-foreground font-medium">{stats.modified}</span>
                          <span className="text-muted-foreground text-xs">Modified</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Clock className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                          <span className="text-foreground font-medium">{stats.inProgress}</span>
                          <span className="text-muted-foreground text-xs">In Progress</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm">
                          <PauseCircle className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                          <span className="text-foreground font-medium">{stats.stalled}</span>
                          <span className="text-muted-foreground text-xs">Stalled</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm">
                          <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                          <span className="text-foreground font-medium">{stats.notFulfilled}</span>
                          <span className="text-muted-foreground text-xs">Not Fulfilled</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-6 text-center text-sm text-muted-foreground mb-4">
                      Data coming soon — promise entries for this manifesto are being compiled.
                    </div>
                  )}

                  <Link
                    href={`/promises?party=${party.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                    style={{ color: party.color }}
                  >
                    Browse {stats.total > 0 ? `${stats.total} promises` : "manifesto"} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Want to add another party&apos;s manifesto?{" "}
          <a href="https://github.com" className="underline hover:text-foreground">
            Contribute on GitHub
          </a>
        </p>
      </div>
    </div>
  )
}
