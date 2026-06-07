/**
 * Returns combined promises from all parties.
 * Add new party data files here to include them in the app.
 */
import tvkPromises from "@/data/promises.json"
import dmkPromises from "@/data/dmk-promises.json"

const allPromises = [...tvkPromises, ...dmkPromises]

export default allPromises
