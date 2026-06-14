import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const checkIn = searchParams.get("checkIn")
  const checkOut = searchParams.get("checkOut")

  if (!checkIn || !checkOut) {
    const rooms = await prisma.room.findMany({ where: { isAvailable: true } })
    return NextResponse.json(rooms)
  }

  const bookedRoomIds = await prisma.booking.findMany({
    where: {
      status: { in: ["PENDING", "CONFIRMED"] },
      OR: [
        { checkIn: { lte: new Date(checkOut) }, checkOut: { gte: new Date(checkIn) } }
      ]
    },
    select: { roomId: true }
  })

  const bookedIds = bookedRoomIds.map(b => b.roomId).filter(Boolean) as string[]

  const availableRooms = await prisma.room.findMany({
    where: {
      isAvailable: true,
      id: { notIn: bookedIds }
    }
  })

  return NextResponse.json(availableRooms)
}
