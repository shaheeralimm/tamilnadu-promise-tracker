import PromisesClient from "./PromisesClient"
import { getLivePromises } from "@/lib/promiseStore"

export const dynamic = "force-dynamic"

export default async function PromisesPage() {
  return <PromisesClient promises={await getLivePromises()} />
}
