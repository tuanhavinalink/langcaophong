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
  const room = await prisma.room.update({
    where: { id },
    data: {
      name: data.name,
      type: data.type,
      capacity: data.capacity !== undefined ? Number(data.capacity) : undefined,
      pricePerNight: data.pricePerNight !== undefined ? Number(data.pricePerNight) : undefined,
      tipService: data.tipService !== undefined ? Number(data.tipService) : undefined,
      description: data.description,
      amenities: data.amenities,
      isAvailable: data.isAvailable,
    }
  })
  return NextResponse.json(room)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  await prisma.room.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
