import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json([])
  const role = (session.user as any).role || "MEMBER"

  const notifications = await prisma.notification.findMany({
    where: {
      isActive: true,
      OR: [
        { targetRoles: "ALL" },
        { targetRoles: role },
      ]
    },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    take: 20,
  })
  return NextResponse.json(notifications)
}
