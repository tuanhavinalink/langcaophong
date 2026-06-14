import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, email: true, phone: true, role: true,
      totalSpent: true, sharePercent: true, shareAmount: true,
      affiliateCode: true, affiliateBalance: true, freeCoursesLeft: true,
      courseDiscount: true, createdAt: true
    }
  })

  return NextResponse.json(users)
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const data = await req.json()
  const { userId, ...updates } = data

  const user = await prisma.user.update({
    where: { id: userId },
    data: updates
  })

  return NextResponse.json(user)
}
