import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Vui lòng đăng nhập" }, { status: 401 })
  }

  const { courseId, scheduleDate } = await req.json()
  const userId = (session.user as any).id

  const user = await prisma.user.findUnique({ where: { id: userId } })
  const course = await prisma.course.findUnique({ where: { id: courseId } })

  if (!course || !user) {
    return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 })
  }

  let paidPrice = course.price

  if (user.freeCoursesLeft > 0) {
    paidPrice = 0
    await prisma.user.update({
      where: { id: userId },
      data: { freeCoursesLeft: { decrement: 1 } }
    })
  } else if (user.courseDiscount > 0) {
    paidPrice = course.price * (1 - user.courseDiscount)
  }

  const enrollment = await prisma.courseEnrollment.create({
    data: {
      userId,
      courseId,
      paidPrice,
      scheduleDate: scheduleDate ? new Date(scheduleDate) : null,
      status: "ENROLLED"
    }
  })

  return NextResponse.json({ success: true, enrollment, paidPrice })
}
