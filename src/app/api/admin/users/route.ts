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
      courseDiscount: true, isActive: true, parentShareholderId: true, createdAt: true,
      parentShareholder: { select: { id: true, name: true } }
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
  const { userId, parentShareholderId, ...rest } = data

  const updateData: any = { ...rest }
  if (parentShareholderId !== undefined) {
    updateData.parentShareholderId = parentShareholderId || null
  }
  // Sync affiliateRate when role changes
  if (rest.role) {
    updateData.affiliateRate = rest.role === "MEMBER" ? 0.10 : 0.15
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true, name: true, email: true, phone: true, role: true,
      totalSpent: true, sharePercent: true, shareAmount: true,
      affiliateCode: true, affiliateBalance: true, freeCoursesLeft: true,
      courseDiscount: true, isActive: true, parentShareholderId: true, createdAt: true,
      parentShareholder: { select: { id: true, name: true } }
    }
  })

  return NextResponse.json(user)
}
