"use client"

import React, { useState, useRef, useEffect } from "react"
import { HelpCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface JargonHelperProps {
  term: string
  displayText: string
}

const jargonDictionary: Record<string, { title: string; en: string; ta: string }> = {
  "ppp": {
    title: "PPP (Public-Private Partnership)",
    en: "A model where government and private sector jointly fund and operate infrastructure or service projects.",
    ta: "அரசும் தனியாரும் இணைந்து உள்கட்டமைப்பு திட்டங்களை நிர்வகிக்கும் கூட்டு முதலீட்டு மாதிரி."
  },
  "dpr": {
    title: "DPR (Detailed Project Report)",
    en: "The formal technical and financial blueprint of a project prepared before execution and fund release.",
    ta: "ஒரு திட்டத்தின் தொழில்நுட்ப மற்றும் நிதி விவரங்களை கொண்ட அதிகாரபூர்வ ஆவணம்."
  },
  "tnpsc": {
    title: "TNPSC (தமிழ்நாடு அரசு பணியாளர் தேர்வாணையம்)",
    en: "Tamil Nadu Public Service Commission: The state body that conducts civil service recruitment exams for government posts.",
    ta: "தமிழ்நாடு அரசு பணியிடங்களுக்கான ஆட்சேர்ப்பு தேர்வுகளை நடத்தும் அரசமைப்பு நிறுவனம்."
  },
  "psc": {
    title: "PSC (Public Service Commission)",
    en: "Public Service Commission: The government recruitment body for state public sector and civil services.",
    ta: "மாநில அரசு பணியாளர்களை வெளிப்படையாக நியமிக்கும் பொது சேவை ஆணையம்."
  },
  "ex-gratia": {
    title: "Ex-Gratia (கருணை நிவாரண உதவி)",
    en: "A payment made out of goodwill or moral obligation rather than legal liability (e.g. government relief for negligence).",
    ta: "சட்டரீதியான பொறுப்பை தாண்டி அரசின் ஒழுக்க கடமையாக வழங்கப்படும் நிதி நிவாரணம்."
  },
  "msp": {
    title: "MSP (Minimum Support Price)",
    en: "Minimum Support Price: A government-guaranteed floor price for agricultural produce to protect farmers from market volatility.",
    ta: "விவசாயிகளை சந்தை ஏற்றத்தாழ்வுகளிலிருந்து பாதுகாக்க அரசு உத்தரவாதம் அளிக்கும் குறைந்தபட்ச கொள்முதல் விலை."
  },
  "cmchis": {
    title: "CMCHIS (முதலமைச்சர் விரிவான சுகாதார காப்பீட்டுத் திட்டம்)",
    en: "Chief Minister's Comprehensive Health Insurance Scheme: Tamil Nadu's flagship health insurance covering BPL families up to ₹5 lakh.",
    ta: "ஏழை குடும்பங்களுக்கு ₹5 லட்சம் வரை சுகாதார காப்பீடு வழங்கும் தமிழ்நாடு அரசின் முன்னோடி திட்டம்."
  },
  "go": {
    title: "GO (Government Order)",
    en: "Government Order: An official directive issued by the state government formalising a policy, appointment, or administrative decision.",
    ta: "ஒரு கொள்கை, நியமனம் அல்லது நிர்வாக முடிவை அதிகாரப்பூர்வமாக்கும் மாநில அரசின் ஆணை (G.O.)."
  },
  "plan outlay": {
    title: "Plan Outlay (திட்ட நிதி ஒதுக்கீடு)",
    en: "The total budget allocated by the state government for development and welfare schemes in a fiscal year.",
    ta: "ஒரு நிதி ஆண்டில் வளர்ச்சி மற்றும் நலத்திட்டங்களுக்கு மாநில அரசு ஒதுக்கும் மொத்த நிதி."
  },
  "life mission": {
    title: "வீட்டுவசதி திட்டம் (Housing Mission)",
    en: "State-sponsored housing schemes targeting homes for all landless and homeless citizens under TVK's manifesto.",
    ta: "நிலமற்ற மற்றும் வீடற்ற அனைத்து குடிமக்களுக்கும் வீடு வழங்க TVK அறிவித்த மாநில பாரிய வீட்டுவசதி திட்டம்."
  }
}

export function JargonHelper({ term, displayText }: JargonHelperProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLSpanElement>(null)

  const key = term.toLowerCase().trim()
  const info = jargonDictionary[key]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!info) {
    return <span>{displayText}</span>
  }

  return (
    <span 
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-baseline gap-0.5 font-semibold text-slate-900 border-b border-dashed border-udf-blue hover:text-udf-blue transition-colors cursor-help focus:outline-none focus:ring-2 focus:ring-udf-blue/20 rounded px-0.5 -mx-0.5"
        type="button"
      >
        {displayText}
        <HelpCircle className="h-3 w-3 text-slate-400 inline self-center shrink-0" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.span
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 md:w-80 bg-white border border-slate-200 text-slate-800 p-4 shadow-xl rounded-xl z-50 pointer-events-auto block text-left"
            role="tooltip"
          >
            {/* Popover Arrow */}
            <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-3 h-3 bg-white border-r border-b border-slate-200 rotate-45 block" />

            <span className="relative z-10 block">
              <span className="block text-sm font-bold text-slate-900 mb-2 border-b border-slate-100 pb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-udf-blue" />
                {info.title}
              </span>
              
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">English</span>
              <span className="block text-xs text-slate-600 mb-3 leading-relaxed">{info.en}</span>
              
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5 font-tamil">தமிழ்</span>
              <span className="block text-xs text-slate-600 font-tamil leading-relaxed block">{info.ta}</span>
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

/**
 * HighlightJargon Component
 * Finds known jargon terms inside text and wraps them in JargonHelper tooltips.
 */
interface HighlightJargonProps {
  text: string
}

export function HighlightJargon({ text }: HighlightJargonProps) {
  if (!text) return null

  // Create regex pattern to match all jargon terms
  // Order keys by length descending to match longer phrases first (e.g. "plan outlay" before "plan")
  const sortedTerms = Object.keys(jargonDictionary).sort((a, b) => b.length - a.length)
  
  // Construct regex pattern matching any of these terms as word boundaries
  // Use custom boundaries or handle space/hyphen properly
  const pattern = sortedTerms.map(term => {
    // Escape special characters for safety
    return term.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
  }).join("|")
  
  const regex = new RegExp(`\\b(${pattern})\\b`, "gi")
  
  const parts = text.split(regex)
  if (parts.length === 1) return <>{text}</>

  return (
    <>
      {parts.map((part, index) => {
        const isMatch = sortedTerms.includes(part.toLowerCase())
        if (isMatch) {
          return <JargonHelper key={index} term={part} displayText={part} />
        }
        return part
      })}
    </>
  )
}
