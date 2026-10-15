import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { isAdminEmail } from "@/lib/config"
import { setShowDmk } from "@/lib/settings"

// Admin only. PATCH is the only export, so Next answers every other method with 405 (Requirement 2.6).
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!isAdminEmail(session?.user?.email)) {
      return NextResponse.json(
        { error: "Access Denied: You are not authorized to change settings." },
        { status: 403 },
      )
    }

    const body = await req.json().catch(() => null) // not JSON: null, which fails the check below
    if (typeof body?.showDmk !== "boolean") {
      return NextResponse.json({ error: 'Body must be JSON like { "showDmk": true }.' }, { status: 400 })
    }

    await setShowDmk(body.showDmk) // throws when Redis is not configured or the write fails
    return NextResponse.json({ success: true, showDmk: body.showDmk })
  } catch (error) {
    console.error("Admin Settings PATCH Error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: `Internal Server Error: ${message}` }, { status: 500 })
  }
}
