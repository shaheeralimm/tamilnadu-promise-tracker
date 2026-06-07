"use client"

import React from "react"
import { motion } from "framer-motion"

const timelineEvents = [
  {
    date: "MAY 10, 2026",
    title: "Oath of Office",
    description: "C. Joseph Vijay was sworn in as Chief Minister of Tamil Nadu at the Jawaharlal Nehru Indoor Stadium, accompanied by an initial 10-member cabinet.",
    status: "fulfilled"
  },
  {
    date: "MAY 10, 2026",
    title: "Day-One Government Orders",
    description: "CM Vijay immediately signed three major files: (1) 200 units free electricity for domestic consumers, (2) establishment of the Singa Pen Special Force (women's safety), and (3) formation of the Anti-Narcotics Task Force.",
    status: "fulfilled"
  },
  {
    date: "MAY 16, 2026",
    title: "Portfolio Allocation",
    description: "Portfolios for the initial cabinet formally allocated. CM Vijay retained Home, General Administration, Police, Women's Welfare, Youth Welfare, and Water Resources. Marie Wilson: Finance; KA Sengottaiyan: Revenue; S. Keerthana: Industries; KG Arun Raj: Health.",
    status: "fulfilled"
  },
  {
    date: "MAY 21–22, 2026",
    title: "Cabinet Expansion — 35 Ministers",
    description: "Two major expansions: 23 new ministers sworn in on May 21, followed by two more from IUML and VCK on May 22, bringing the full cabinet to 35 ministers. Congress MLAs allocated Tourism and Higher Education portfolios.",
    status: "fulfilled"
  },
  {
    date: "JUN 5, 2026",
    title: "First Cabinet Meeting",
    description: "CM Vijay chaired the inaugural Cabinet meeting at the state Secretariat. Three major decisions: (1) 436-project time-bound governance roadmap across all departments, (2) major TASMAC administrative overhaul for procurement-to-retail transparency, and (3) legal action to protect state water rights against the Mekedatu dam.",
    status: "in-progress"
  },
  {
    date: "NOV 10, 2026",
    title: "Right to Service Act Deadline",
    description: "Manifesto commitment: the Tamil Nadu Right to Service Act and Vetri Tamil Nadu Super App must be enacted and launched within six months of taking office (by November 10, 2026).",
    status: "pending"
  },
  {
    date: "2026–2027",
    title: "State Budget Presentation",
    description: "First full state budget to be presented by Finance Minister Marie Wilson, expected to reflect manifesto priorities including Madhippumigu Magalir ₹2,500/month, welfare pension revision to ₹3,000, and MSME ₹15,000 crore credit guarantee fund.",
    status: "pending"
  }
]

export function GovTimeline() {
  return (
    <section className="py-20 bg-slate-50 border-b border-border transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="mb-12 text-center md:text-left">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900">Governance Timeline</h2>
          <p className="text-muted-foreground mt-2">Key milestones and policy implementations since day one.</p>
        </div>

        <div className="relative border-l-2 border-slate-200 ml-4 md:ml-[120px]">
          {timelineEvents.map((event, index) => {
            const isFulfilled = event.status === "fulfilled"
            const isInProgress = event.status === "in-progress"
            
            let bulletColor = "bg-slate-300 "
            if (isFulfilled) {
              bulletColor = "bg-emerald-600 "
            } else if (isInProgress) {
              bulletColor = "bg-blue-600 "
            }

            return (
              <motion.div 
                key={index}
                className="mb-10 relative pl-8 md:pl-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Timeline Node */}
                <div className={`absolute w-4 h-4 rounded-full -left-[9px] top-1 border-4 border-white ${bulletColor} shadow-sm z-10`} />
                
                {/* Connecting Line override for fulfilled/progress */}
                {(isFulfilled || isInProgress) && (
                  <div className={`absolute w-0.5 h-full -left-[1px] top-4 ${bulletColor} opacity-50 z-0`} />
                )}

                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-0">
                  {/* Date label - absolutely positioned on desktop to the left */}
                  <div className="md:absolute md:-left-[140px] md:top-0.5 md:w-[100px] md:text-right">
                    <span className={`text-xs font-bold uppercase tracking-widest ${isFulfilled ? 'text-emerald-600 ' : isInProgress ? 'text-blue-600 ' : 'text-slate-400 '}`}>
                      {event.date}
                    </span>
                  </div>
                  
                  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex-1 ml-0 hover:shadow-md transition-all duration-300">
                    <h3 className="font-bold text-lg text-slate-900 mb-1">{event.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{event.description}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
