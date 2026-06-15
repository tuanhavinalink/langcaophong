import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const checkIn = searchParams.get("checkIn")
  const checkOut = searchParams.get("checkOut")

  const rooms = await prisma.room.findMany({ where: { isAvailable: true } })

  if (!checkIn || !checkOut) {
    return NextResponse.json(rooms.map(r => ({ ...r, availableUnits: r.totalUnits })))
  }

  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)

  // Check blocked dates
  const blocked = await prisma.blockedDate.findFirst({
    where: {
      OR: [
        { checkIn: { lte: checkOutDate }, checkOut: { gte: checkInDate } }
      ]
    }
  })
  if (blocked) {
    return NextResponse.json({ blocked: true, reason: blocked.reason })
  }

  // Count booked units per room for overlapping dates
  const bookings = await prisma.booking.findMany({
    where: {
      status: { in: ["PENDING", "CONFIRMED"] },
      roomId: { not: null },
      OR: [
        { checkIn: { lte: checkOutDate }, checkOut: { gte: checkInDate } }
      ]
    },
    select: { roomId: true, roomQty: true }
  })

  const bookedByRoom: Record<string, number> = {}
  for (const b of bookings) {
    if (b.roomId) bookedByRoom[b.roomId] = (bookedByRoom[b.roomId] || 0) + (b.roomQty || 1)
  }

  const result = rooms.map(r => ({
    ...r,
    availableUnits: Math.max(0, r.totalUnits - (bookedByRoom[r.id] || 0))
  })).filter(r => r.availableUnits > 0)

  return NextResponse.json(result)
}
