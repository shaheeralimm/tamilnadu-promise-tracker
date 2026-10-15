import React from "react"
import { ExternalLink, Rss } from "lucide-react"
import { TierBadge } from "@/components/promise/TierBadge"
import { groupFeed } from "@/lib/feedGrouper"
import { getVisible } from "@/lib/promiseStore"
import { SourceTier } from "@/types"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function UpdatesPage() {
  const { promises } = await getVisible()
  
  // Use groupFeed to deduplicate and group the feed
  const updatesFeed = groupFeed(promises)
  return (
    <div className="min-h-screen bg-slate-50/50 pt-8 pb-20 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="mb-12">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-slate-900 mb-4">Updates Feed</h1>
          <p className="text-muted-foreground text-lg">
            Chronological feed of all verified news, government orders, and progress updates across all promises.
          </p>
        </div>

        {updatesFeed.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center transition-colors">
            <Rss className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-bold text-lg text-slate-900 mb-2">No updates yet</h3>
            <p className="text-muted-foreground">Check back later for new verified updates.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {updatesFeed.map((card, index) => (
              <div key={card.key} className="bg-white rounded-2xl border border-border shadow-sm p-6 md:p-8 hover:shadow-md transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                        {new Date(card.date).toLocaleDateString("en-IN", { 
                          year: 'numeric', month: 'short', day: 'numeric' 
                        })}
                      </span>
                      <TierBadge tier={card.tier} />
                    </div>
                    <h2 className="font-bold text-xl text-slate-900 mb-2">{card.title}</h2>
                    {card.summary && <p className="text-slate-600 leading-relaxed mb-4">{card.summary}</p>}
                  </div>
                  
                  {card.url && (
                    <a 
                      href={card.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-tvk-blue transition-colors bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 cursor-pointer"
                    >
                      Read Source
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                
                <div className="pt-4 border-t border-slate-100 bg-slate-50/50 -mx-6 -mb-6 p-6 rounded-b-2xl transition-colors duration-300">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Related Promise{card.related.length > 1 ? "s" : ""}</div>
                  {card.related.length > 5 ? (
                    <details className="group">
                      <summary className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-800 cursor-pointer list-none">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: card.related[0].sectorColor }} />
                        <span className="font-medium group-hover:text-tvk-blue transition-colors">
                          {card.related[0].title} <span className="text-xs text-slate-400">(+{card.related.length - 1} more)</span>
                        </span>
                      </summary>
                      <div className="mt-3 pl-4 space-y-2">
                        {card.related.slice(0, 5).map((related, idx) => (
                          <Link key={related.id} href={`/promises/${related.slug}`} className="group flex items-center gap-2 cursor-pointer text-sm">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: related.sectorColor }} />
                            <span className="text-slate-600 group-hover:text-tvk-blue transition-colors">{related.title}</span>
                          </Link>
                        ))}
                        {card.related.length > 5 && (
                          <div className="text-xs text-slate-400 pl-3.5">… and {card.related.length - 5} more</div>
                        )}
                      </div>
                    </details>
                  ) : (
                    <div>
                      {card.related.map((related, idx) => (
                        <Link key={related.id} href={`/promises/${related.slug}`} className="group flex items-center gap-3 cursor-pointer mt-2 first:mt-0">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: related.sectorColor }} />
                          <span className="font-medium text-slate-700 group-hover:text-tvk-blue transition-colors">{related.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
