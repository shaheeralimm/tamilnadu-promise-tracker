import React from "react"
import { SearchX, Clock } from "lucide-react"

interface EmptyStateProps {
  noPartyData?: boolean
  partyName?: string
}

export function EmptyState({ noPartyData, partyName }: EmptyStateProps) {
  if (noPartyData) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-amber-50/60 rounded-2xl border border-dashed border-amber-200">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6 text-amber-500">
          <Clock className="h-8 w-8" />
        </div>
        <h3 className="font-display font-bold text-2xl text-slate-800 mb-2">
          Data coming soon
        </h3>
        <p className="text-slate-600 max-w-sm mb-2 text-sm leading-relaxed">
          {partyName ? `${partyName} promise data` : "This party's data"} is currently being compiled and verified.
        </p>
        <p className="text-slate-400 max-w-sm text-xs">
          Check back soon, or{" "}
          <a href="/about" className="underline underline-offset-2 hover:text-slate-600 transition-colors">
            learn how you can contribute
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-400">
        <SearchX className="h-8 w-8" />
      </div>
      <h3 className="font-tamil font-bold text-2xl text-slate-800 mb-2 tracking-normal">
        ஒன்றும் கண்டுபிடிக்கவில்லை
      </h3>
      <p className="font-tamil text-slate-500 max-w-sm mb-2 text-sm leading-normal">
        நீங்கள் தேர்ந்தெடுத்த வடிகட்டிகளுக்கு பொருத்தமான வாக்குறுதிகள் எதுவும் காணவில்லை. தேடல் வார்த்தைகளையோ வடிகட்டிகளையோ மாற்றி மீண்டும் முயலவும்.
      </p>
      <p className="text-slate-400 max-w-sm text-xs">
        No promises found matching your current filters. Try adjusting your search or clearing some filters.
      </p>
    </div>
  )
}
