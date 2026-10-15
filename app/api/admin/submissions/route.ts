import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { applyApproval } from "@/lib/approval"
import { isAdminEmail } from "@/lib/config"
import { kvGet, kvSet } from "@/lib/kv"
import { loadTvkPromises, saveTvkPromises } from "@/lib/promiseStore"
import type { Submission } from "@/types"

// 1. GET - Fetch all submissions (Admin Only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !isAdminEmail(session.user.email)) {
      return NextResponse.json(
        { error: "Access Denied: You are not authorized to view this page." },
        { status: 403 }
      )
    }

    const submissions = (await kvGet<Submission[]>("submissions")) ?? []

    // Sort submissions newest first
    submissions.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json({ success: true, submissions })
  } catch (error: any) {
    console.error("Admin Submissions GET Error:", error)
    return NextResponse.json(
      { error: `Internal Server Error: ${error?.message || error}` },
      { status: 500 }
    )
  }
}

// 2. PATCH - Update submission status (Admin Only)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !isAdminEmail(session.user.email)) {
      return NextResponse.json(
        { error: "Access Denied: You are not authorized to perform this action." },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await req.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing required fields: id and status." },
        { status: 400 }
      )
    }

    const allowedStatuses = ["pending", "approved", "rejected"]
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Allowed values are pending, approved, or rejected." },
        { status: 400 }
      )
    }

    // ponytail: read-modify-write of whole arrays; two admins approving at the same moment can
    // lose one update. Upgrade path: one hash field per promise (HSET) or an atomic script.
    const submissions = (await kvGet<Submission[]>("submissions")) ?? []

    // Find and update target submission
    const index = submissions.findIndex((sub) => sub.id === id)
    if (index === -1) {
      return NextResponse.json(
        { error: "Submission not found with the provided ID." },
        { status: 404 }
      )
    }

    const now = new Date().toISOString()

    // Promises first. A failed promise read or write throws before the submission is touched,
    // so the catch below returns 500 and the submission status stays as it was.
    if (status === "approved") {
      const promises = await loadTvkPromises()
      const next = applyApproval(promises, submissions[index], now)
      if (next.some((p, i) => p !== promises[i])) await saveTvkPromises(next)
    }

    submissions[index] = {
      ...submissions[index],
      status,
      lastUpdatedBy: session.user.email ?? undefined,
      lastUpdatedAt: now,
    }

    // Write back to Vercel KV
    await kvSet("submissions", submissions)

    return NextResponse.json({
      success: true,
      submission: submissions[index],
    })
  } catch (error: any) {
    console.error("Admin Submissions PATCH Error:", error)
    return NextResponse.json(
      { error: `Internal Server Error: ${error?.message || error}` },
      { status: 500 }
    )
  }
}
