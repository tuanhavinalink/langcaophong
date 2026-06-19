import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Vui lòng đăng nhập" }, { status: 401 })

  const userId = (session.user as any).id
  const data = await req.json()

  if (!data.courseId) return NextResponse.json({ error: "Thiếu thông tin khóa học" }, { status: 400 })

  const existing = await prisma.courseEnrollment.findFirst({ where: { userId, courseId: data.courseId } })
  if (existing) return NextResponse.json({ error: "Bạn đã đăng ký khóa học này rồi" }, { status: 400 })

  const [course, user] = await Promise.all([
    prisma.course.findUnique({ where: { id: data.courseId } }),
    prisma.user.findUnique({ where: { id: userId } }),
  ])
  if (!course || !user) return NextResponse.json({ error: "Không tìm thấy dữ liệu" }, { status: 404 })

  const qty = data.quantity && data.quantity > 0 ? data.quantity : 1

  let unitPrice = course.price
  if (user.freeCoursesLeft > 0) {
    unitPrice = 0
    await prisma.user.update({ where: { id: userId }, data: { freeCoursesLeft: { decrement: 1 } } })
  } else if (user.courseDiscount > 0) {
    unitPrice = Math.round(course.price * (1 - user.courseDiscount))
  }
  const paidPrice = unitPrice * qty

  const scheduleRaw = data.preferredDate
  let scheduleDate: Date | null = null
  if (scheduleRaw) {
    const parsed = new Date(scheduleRaw)
    scheduleDate = isNaN(parsed.getTime()) ? null : parsed
  }

  const enrollment = await prisma.courseEnrollment.create({
    data: {
      userId,
      courseId: data.courseId,
      status: "ENROLLED",
      paidPrice,
      scheduleDate,
      notes: data.note || null,
    },
    include: { course: true, user: { select: { name: true, email: true, phone: true } } }
  })
  return NextResponse.json(enrollment)
}

export async function GET() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const enrollments = await prisma.courseEnrollment.findMany({
    include: { course: true, user: { select: { name: true, email: true, phone: true } } },
    orderBy: { createdAt: "desc" }
  })
  return NextResponse.json(enrollments)
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { enrollmentId, status } = await req.json()
  const enrollment = await prisma.courseEnrollment.update({
    where: { id: enrollmentId },
    data: { status },
    include: { course: true, user: { select: { id: true, name: true, email: true, phone: true, referredBy: true } } }
  })

  // Hoa hồng affiliate khi CONFIRMED
  if (status === "CONFIRMED" && enrollment.paidPrice > 0 && enrollment.user.referredBy) {
    const referrer = await prisma.user.findUnique({ where: { affiliateCode: enrollment.user.referredBy } })
    if (referrer) {
      const commission = Math.round(enrollment.paidPrice * referrer.affiliateRate)
      if (commission > 0) {
        await prisma.affiliateEarning.create({
          data: {
            userId: referrer.id,
            referredUserId: enrollment.user.id,
            amount: commission,
            status: "CONFIRMED",
          }
        })
        await prisma.user.update({
          where: { id: referrer.id },
          data: { affiliateBalance: { increment: commission } }
        })
      }
    }
  }

  return NextResponse.json(enrollment)
}
