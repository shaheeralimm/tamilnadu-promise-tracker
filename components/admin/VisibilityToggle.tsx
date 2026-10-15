"use client"

import { useId, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { useRouter } from "next/navigation"

export function VisibilityToggle({ initialShowDmk }: { initialShowDmk: boolean }) {
  const labelId = useId()
  const router = useRouter()
  const button = useRef<HTMLButtonElement>(null)
  const [shown, setShown] = useState(initialShowDmk)
  const [pending, setPending] = useState(false)
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")

  async function toggle() {
    setPending(true)
    setStatus("")
    setError("")
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showDmk: !shown }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : `Request failed (${res.status})`)
      const saved = data.showDmk === true // the saved value, not the requested one
      setShown(saved)
      setStatus(saved ? "DMK content is now shown." : "DMK content is now hidden.")
      router.refresh() // a Back navigation must not bring back a stale initial state
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the setting.") // `shown` is untouched
    } finally {
      flushSync(() => setPending(false)) // enable the button first, or focus() would be ignored
      button.current?.focus()
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <span id={labelId} className="text-sm font-medium text-foreground">Show DMK promises and details</span>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-600">{shown ? "Shown" : "Hidden"}</span>
          <button
            ref={button}
            type="button"
            role="switch"
            aria-checked={shown}
            aria-labelledby={labelId}
            disabled={pending}
            onClick={toggle}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tvk-blue focus-visible:ring-offset-2 ${shown ? "bg-tvk-blue" : "bg-slate-500"}`}
          >
            <span
              aria-hidden="true"
              className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform motion-reduce:transition-none ${shown ? "translate-x-5" : "translate-x-0.5"}`}
            />
          </button>
        </div>
      </div>
      <p role="status" className="mt-3 text-sm text-emerald-700 empty:mt-0">{status}</p>
      <p role="alert" className="mt-3 text-sm text-red-600 empty:mt-0">{error}</p>
    </div>
  )
}
