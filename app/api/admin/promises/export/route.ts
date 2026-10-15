import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { isAdminEmail } from "@/lib/config"
import { getDmkPromises, loadTvkPromises } from "@/lib/promiseStore"

export const dynamic = "force-dynamic"

// Admin-only download of the live promises, so the maintainer can update data/promises.json by hand.
// Read-only: no file writes, no git calls. Uses the strict loader on purpose: when Redis is
// unreachable this must be a 500, not seed data that looks like the latest state.
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!isAdminEmail(session?.user?.email)) {
      return NextResponse.json(
        { error: "Access Denied: You are not authorized to export promises." },
        { status: 403 }
      )
    }

    const merged = [...(await loadTvkPromises()), ...getDmkPromises()]
    return new NextResponse(JSON.stringify(merged, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="promises.json"',
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("Admin Promises Export Error:", error)
    return NextResponse.json({ error: "Failed to export promises" }, { status: 500 })
  }
}
