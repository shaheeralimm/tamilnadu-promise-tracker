import { HeroSection } from "@/components/home/HeroSection"
import { ManifestoTicker } from "@/components/home/ManifestoTicker"
import { TrustFramework } from "@/components/home/TrustFramework"
import { BentoStats } from "@/components/home/BentoStats"
import { SpotlightRow } from "@/components/home/SpotlightRow"
import { GovTimeline } from "@/components/home/GovTimeline"
import { getVisible } from "@/lib/promiseStore"
import type { Party, Promise as PromiseType } from "@/types"

export const dynamic = "force-dynamic"

export default async function Home() {
  const { promises, parties } = await getVisible()
  
  return (
    <div className="flex flex-col w-full">
      <HeroSection promises={promises} parties={parties} />
      <ManifestoTicker />
      <TrustFramework />
      <BentoStats promises={promises} parties={parties} />
      <SpotlightRow promises={promises} />
      <GovTimeline />
    </div>
  )
}
