"use client"

import React, { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { FilterSidebar } from "@/components/promises/FilterSidebar"
import { HorizontalCard } from "@/components/promises/HorizontalCard"
import { EmptyState } from "@/components/promises/EmptyState"
import promisesData from "@/lib/getAllPromises"
import partiesData from "@/data/parties.json"
import { Promise as PromiseType, Status, Party } from "@/types"

import { motion } from "framer-motion"

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03
    }
  }
}

const allParties = partiesData as Party[]

function PromisesPageContent() {
  const searchParams = useSearchParams()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all")
  const [selectedSectors, setSelectedSectors] = useState<string[]>([])
  const [sortOption, setSortOption] = useState("newest")
  const [partyFilter, setPartyFilter] = useState<string>("all")

  // Sync state with URL search parameters on mount and when they change
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const sectorParam = searchParams.get("sector")
    const statusParam = searchParams.get("status")
    const searchParam = searchParams.get("q") || searchParams.get("search")
    const sortParam = searchParams.get("sort")
    const partyParam = searchParams.get("party")

    if (sectorParam) {
      const sectorsList = sectorParam.split(",")
      setSelectedSectors(sectorsList)
    } else {
      setSelectedSectors([])
    }
    
    if (statusParam && ["fulfilled", "in-progress", "evaded", "pending", "all"].includes(statusParam)) {
      setStatusFilter(statusParam as Status | "all")
    } else {
      setStatusFilter("all")
    }

    if (searchParam) {
      setSearchQuery(searchParam)
    } else {
      setSearchQuery("")
    }

    if (sortParam && ["newest", "oldest", "az", "status"].includes(sortParam)) {
      setSortOption(sortParam)
    } else {
      setSortOption("newest")
    }

    if (partyParam && allParties.some((p) => p.id === partyParam)) {
      setPartyFilter(partyParam)
    } else {
      setPartyFilter("all")
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [searchParams])

  // Sectors for the currently active party only
  const uniqueSectors = useMemo(() => {
    const source = partyFilter === "all"
      ? (promisesData as PromiseType[])
      : (promisesData as PromiseType[]).filter(p => p.partyId === partyFilter)
    return Array.from(new Set(source.map(p => p.sector.id))).map(id =>
      source.find(p => p.sector.id === id)!.sector
    )
  }, [partyFilter])

  // Check whether the active party actually has any promises loaded
  const partyHasData = useMemo(() => {
    if (partyFilter === "all") return true
    return (promisesData as PromiseType[]).some(p => p.partyId === partyFilter)
  }, [partyFilter])

  const filteredPromises = useMemo(() => {
    return (promisesData as PromiseType[])
      .filter((promise) => {
        // Party filter
        const matchesParty = partyFilter === "all" || promise.partyId === partyFilter

        // Search filter
        const matchesSearch = 
          promise.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          promise.description.toLowerCase().includes(searchQuery.toLowerCase())
        
        // Status filter
        const matchesStatus = statusFilter === "all" || promise.status === statusFilter
        
        // Sector filter
        const matchesSector = selectedSectors.length === 0 || selectedSectors.includes(promise.sector.id)
        
        return matchesParty && matchesSearch && matchesStatus && matchesSector
      })
      .sort((a, b) => {
        // Sort logic
        if (sortOption === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        } else if (sortOption === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        } else if (sortOption === "az") {
          return a.title.localeCompare(b.title)
        } else if (sortOption === "status") {
          const statusOrder: Record<string, number> = { fulfilled: 1, modified: 2, "in-progress": 3, stalled: 4, evaded: 5, "not-fulfilled": 6, pending: 7 }
          return (statusOrder[a.status] ?? 8) - (statusOrder[b.status] ?? 8)
        }
        return 0
      })
  }, [searchQuery, statusFilter, selectedSectors, sortOption, partyFilter])

  return (
    <div className="min-h-screen bg-slate-50/50 pt-8 pb-20 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-10">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-slate-900 mb-4">All Promises</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Browse, filter, and search through the complete ledger of Tamil Nadu government promises.
            {partyFilter === "all"
              ? ` Currently tracking ${(promisesData as PromiseType[]).length} commitments across all parties.`
              : (() => {
                  const party = allParties.find(p => p.id === partyFilter)
                  const count = (promisesData as PromiseType[]).filter(p => p.partyId === partyFilter).length
                  return count > 0
                    ? ` Tracking ${count} ${party?.shortName ?? partyFilter.toUpperCase()} commitments.`
                    : ` ${party?.shortName ?? partyFilter.toUpperCase()} data is being compiled.`
                })()
            }
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
          <FilterSidebar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            selectedSectors={selectedSectors}
            setSelectedSectors={setSelectedSectors}
            sectors={uniqueSectors}
            sortOption={sortOption}
            setSortOption={setSortOption}
            parties={allParties}
            partyFilter={partyFilter}
            setPartyFilter={setPartyFilter}
          />

          <div className="flex-1 w-full flex flex-col gap-4">
            <div className="mb-2 text-sm text-slate-500 font-medium">
              Showing {filteredPromises.length} result{filteredPromises.length !== 1 ? 's' : ''}
            </div>
            
            {filteredPromises.length > 0 ? (
              <motion.div
                key={`${partyFilter}-${searchQuery}-${statusFilter}-${selectedSectors.join(",")}-${sortOption}`} // Drive full re-animation on updates
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-4"
              >
                {filteredPromises.map((promise) => (
                  <HorizontalCard key={promise.id} promise={promise} />
                ))}
              </motion.div>
            ) : (
              <EmptyState noPartyData={!partyHasData} partyName={allParties.find(p => p.id === partyFilter)?.name} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PromisesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center transition-colors duration-300">
        <div className="animate-pulse flex items-center gap-2 text-muted-foreground">
          Loading promises...
        </div>
      </div>
    }>
      <PromisesPageContent />
    </Suspense>
  )
}
