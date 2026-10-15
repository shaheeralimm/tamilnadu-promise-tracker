import SectorsClient from "./SectorsClient"
import { getVisible } from "@/lib/promiseStore"

export const dynamic = "force-dynamic"

export default async function SectorsPage() {
  const { promises, parties } = await getVisible()
  return <SectorsClient promises={promises} parties={parties} />
}