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
  const rooms = await prisma.room.findMany({ orderBy: { name: "asc" } })
  return NextResponse.json(rooms)
}

export async function POST(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const data = await req.json()
  const room = await prisma.room.create({
    data: {
      name: data.name,
      type: data.type || "BUNGALOW",
      capacity: Number(data.capacity) || 2,
      pricePerNight: Number(data.pricePerNight),
      memberPrice: data.memberPrice ? Number(data.memberPrice) : null,
      tipService: Number(data.tipService) || 50000,
      tipWcBedding: Number(data.tipWcBedding) || 0,
      totalUnits: Number(data.totalUnits) || 1,
      description: data.description || null,
      amenities: data.amenities || null,
      isAvailable: data.isAvailable !== false,
    }
  })
  return NextResponse.json(room)
}
