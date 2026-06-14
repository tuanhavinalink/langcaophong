import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "ADMIN") return null
  return session
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const notifications = await prisma.notification.findMany({ orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }] })
  return NextResponse.json(notifications)
}

export async function POST(req: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const data = await req.json()
  const notification = await prisma.notification.create({
    data: {
      title: data.title,
      content: data.content,
      targetRoles: data.targetRoles || "ALL",
      isPinned: data.isPinned || false,
      isActive: true,
      createdBy: (session.user as any).id,
    }
  })
  return NextResponse.json(notification)
}
