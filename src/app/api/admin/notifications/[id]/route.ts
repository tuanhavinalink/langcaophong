import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "ADMIN") return null
  return session
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const data = await req.json()
  const notification = await prisma.notification.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
      targetRoles: data.targetRoles,
      isPinned: data.isPinned,
      isActive: data.isActive,
    }
  })
  return NextResponse.json(notification)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  await prisma.notification.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
