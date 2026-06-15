import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function requireAdmin() {
  const session = await auth()
  if ((session?.user as any)?.role !== "ADMIN") return null
  return session
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const blocks = await prisma.blockedDate.findMany({ orderBy: { checkIn: "asc" } })
  return NextResponse.json(blocks)
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { checkIn, checkOut, reason } = await req.json()
  if (!checkIn || !checkOut || !reason) {
    return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 })
  }
  const block = await prisma.blockedDate.create({
    data: { checkIn: new Date(checkIn), checkOut: new Date(checkOut), reason }
  })
  return NextResponse.json(block)
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { id } = await req.json()
  await prisma.blockedDate.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
