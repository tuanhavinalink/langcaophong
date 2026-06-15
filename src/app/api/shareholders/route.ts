import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const shareholders = await prisma.user.findMany({
    where: { role: "SHAREHOLDER_MAIN", isActive: true },
    select: { id: true, name: true, shareAmount: true },
    orderBy: { name: "asc" },
  })
  return NextResponse.json(shareholders)
}
