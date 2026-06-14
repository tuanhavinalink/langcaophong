import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Vui lòng đăng nhập" }, { status: 401 })
  }

  try {
    const data = await req.json()
    const userId = (session.user as any).id

    const user = await prisma.user.findUnique({ where: { id: userId } })

    let discount = 0
    if (user?.role === "VIP" && data.isFullVillage) {
      discount = 0.3
    }

    const totalPrice = data.basePrice * (1 - discount) + (data.servicesPrice || 0)

    const booking = await prisma.booking.create({
      data: {
        userId,
        type: data.isFullVillage ? "FULL_VILLAGE" : "ROOM",
        checkIn: new Date(data.checkIn),
        checkOut: new Date(data.checkOut),
        guests: data.guests || 1,
        roomId: data.roomId,
        isFullVillage: data.isFullVillage || false,
        companyName: data.companyName,
        purpose: data.purpose,
        includeKitchen: data.includeKitchen || false,
        kitchenTip: data.kitchenTip || 0,
        includeBreakfast: data.includeBreakfast || false,
        includeLunch: data.includeLunch || false,
        includeDinner: data.includeDinner || false,
        includeCampfire: data.includeCampfire || false,
        campfirePrice: data.includeCampfire ? 500000 : 0,
        basePrice: data.basePrice,
        servicesPrice: data.servicesPrice || 0,
        discount: discount * data.basePrice,
        totalPrice,
        notes: data.notes,
        status: "PENDING"
      }
    })

    await prisma.user.update({
      where: { id: userId },
      data: { totalSpent: { increment: totalPrice } }
    })

    const updatedUser = await prisma.user.findUnique({ where: { id: userId } })
    if (updatedUser && updatedUser.totalSpent >= 10000000 && updatedUser.role === "MEMBER") {
      await prisma.user.update({
        where: { id: userId },
        data: { role: "VIP", freeCoursesLeft: { increment: 2 } }
      })
    }

    return NextResponse.json({ success: true, booking })
  } catch (error) {
    return NextResponse.json({ error: "Lỗi tạo đặt phòng" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { bookingId, status } = await req.json()
  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status }
  })
  return NextResponse.json(booking)
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = (session.user as any).id
  const role = (session.user as any).role

  let bookings
  if (role === "ADMIN") {
    bookings = await prisma.booking.findMany({
      include: { user: { select: { name: true, email: true, phone: true } }, room: true },
      orderBy: { createdAt: "desc" }
    })
  } else {
    bookings = await prisma.booking.findMany({
      where: { userId },
      include: { room: true },
      orderBy: { createdAt: "desc" }
    })
  }

  return NextResponse.json(bookings)
}
