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
  const service = await prisma.service.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      icon: data.icon,
      price: data.price !== undefined ? Number(data.price) : undefined,
      priceUnit: data.priceUnit,
      category: data.category,
      isActive: data.isActive,
      sortOrder: data.sortOrder !== undefined ? Number(data.sortOrder) : undefined,
    }
  })
  return NextResponse.json(service)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  await prisma.service.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
