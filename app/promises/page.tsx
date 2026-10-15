import PromisesClient from "./PromisesClient"
import { getVisible } from "@/lib/promiseStore"

export const dynamic = "force-dynamic"

export default async function PromisesPage() {
  const { promises, parties } = await getVisible()
  return <PromisesClient promises={promises} parties={parties} />
}
