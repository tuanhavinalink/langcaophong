import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const data = await req.json()
  const item = await prisma.mediaItem.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description ?? null,
      type: data.type,
      url: data.url,
      thumbnail: data.thumbnail ?? null,
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
    }
  })
  return NextResponse.json(item)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  await prisma.mediaItem.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
