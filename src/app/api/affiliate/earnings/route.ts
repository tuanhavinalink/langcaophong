import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as any).id

  const [user, earnings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { affiliateCode: true, affiliateRate: true, affiliateBalance: true }
    }),
    prisma.affiliateEarning.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } }, // referrer (self)
      }
    })
  ])

  // Get referred user names separately
  const referredIds = earnings.map(e => e.referredUserId)
  const referredUsers = referredIds.length > 0
    ? await prisma.user.findMany({
        where: { id: { in: referredIds } },
        select: { id: true, name: true, email: true }
      })
    : []
  const referredMap = Object.fromEntries(referredUsers.map(u => [u.id, u]))

  return NextResponse.json({
    affiliateCode: user?.affiliateCode,
    affiliateRate: user?.affiliateRate ?? 0.10,
    affiliateBalance: user?.affiliateBalance ?? 0,
    earnings: earnings.map(e => ({
      id: e.id,
      amount: e.amount,
      status: e.status,
      createdAt: e.createdAt,
      referredUser: referredMap[e.referredUserId] ?? null,
      bookingId: e.bookingId,
    }))
  })
}
