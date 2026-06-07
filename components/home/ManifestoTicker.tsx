import React from "react"

const MANIFESTO_ITEMS = [
  "FREE BUS TRAVEL FOR WOMEN",
  "₹1,000/MONTH STIPEND FOR COLLEGE WOMEN",
  "WELFARE PENSION RAISED TO ₹3,000",
  "FREE BREAKFAST SCHEME EXPANSION",
  "HEALTHCARE INSURANCE FOR ALL FAMILIES",
  "INTEREST-FREE LOANS FOR YOUTH ENTREPRENEURS",
  "HOUSING FOR ALL SCHEMES",
  "KALAIGNAR KAPPEETTU THITTAM",
  "FREE EDUCATION UP TO GRADUATION",
  "FARMER LOAN WAIVER",
  "DEDICATED WOMEN SAFETY UNIT",
]

export function ManifestoTicker() {
  return (
    <div className="w-full bg-slate-100 border-b border-border overflow-hidden py-3 transition-colors duration-300">
      <div className="flex whitespace-nowrap overflow-hidden">
        {/* We use two identical lists for seamless CSS animation */}
        <div className="flex animate-marquee min-w-full shrink-0">
          {MANIFESTO_ITEMS.map((item, i) => (
            <div key={`ticker-1-${i}`} className="flex items-center shrink-0">
              <span className="text-[11px] font-bold tracking-[0.2em] text-slate-500 mx-6 shrink-0">
                {item}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
            </div>
          ))}
        </div>
        <div className="flex animate-marquee min-w-full shrink-0" aria-hidden="true">
          {MANIFESTO_ITEMS.map((item, i) => (
            <div key={`ticker-2-${i}`} className="flex items-center shrink-0">
              <span className="text-[11px] font-bold tracking-[0.2em] text-slate-500 mx-6 shrink-0">
                {item}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
