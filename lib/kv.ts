// Upstash REST helpers shared by the API routes and the promise store.
// Values are stored as JSON strings (the raw POST body of /set/<key>), so
// existing `submissions` data stays readable. No fetch is ever cached.

function creds() {
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  if (!url) throw new Error("KV_REST_API_URL is not set")
  if (!token) throw new Error("KV_REST_API_TOKEN is not set")
  return { url, token }
}

export async function kvGet<T>(key: string): Promise<T | null> {
  const { url, token } = creds()
  const res = await fetch(`${url}/get/${key}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`KV read failed (${key}): ${res.statusText}`)
  const { result } = await res.json()
  if (!result) return null
  return typeof result === "string" ? JSON.parse(result) : result
}

export async function kvSet(key: string, value: unknown): Promise<void> {
  const { url, token } = creds()
  const res = await fetch(`${url}/set/${key}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(value),
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`KV write failed (${key}): ${res.statusText}`)
}
