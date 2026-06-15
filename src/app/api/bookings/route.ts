import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function generateBookingCode(): Promise<string> {
  const count = await prisma.booking.count()
  return `LCP-${String(count + 1).padStart(4, '0')}`
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Vui lòng đăng nhập" }, { status: 401 })
  }

  try {
    const data = await req.json()
    const userId = (session.user as any).id
    const bookingCode = await generateBookingCode()

    const totalPrice = data.basePrice + (data.servicesPrice || 0)

    const booking = await prisma.booking.create({
      data: {
        userId,
        bookingCode,
        type: data.isFullVillage ? "FULL_VILLAGE" : "ROOM",
        checkIn: new Date(data.checkIn),
        checkOut: new Date(data.checkOut),
        guests: data.guests || 1,
        roomId: data.roomId,
        roomQty: data.roomQty || 1,
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
        discount: data.discount || 0,
        totalPrice,
        notes: data.notes,
        status: "PENDING"
      }
    })

    // totalSpent chỉ cộng khi booking được CONFIRMED (xem PATCH bên dưới)

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

  const existing = await prisma.booking.findUnique({ where: { id: bookingId } })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status }
  })

  // Cộng totalSpent khi CONFIRMED (và chưa được cộng trước đó)
  if (status === "CONFIRMED" && existing.status !== "CONFIRMED" && existing.status !== "COMPLETED") {
    const updatedUser = await prisma.user.update({
      where: { id: existing.userId },
      data: { totalSpent: { increment: existing.totalPrice } }
    })

    // Lên VIP khi đạt 10 triệu (chỉ Member thường)
    if (updatedUser.totalSpent >= 10_000_000 && updatedUser.role === "MEMBER") {
      await prisma.user.update({
        where: { id: existing.userId },
        data: { role: "VIP", courseDiscount: 0.3 }
      })
    }
  }

  // Trừ totalSpent khi CANCELLED (nếu đã được CONFIRMED)
  if (status === "CANCELLED" && existing.status === "CONFIRMED") {
    await prisma.user.update({
      where: { id: existing.userId },
      data: { totalSpent: { decrement: existing.totalPrice } }
    })
  }

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
