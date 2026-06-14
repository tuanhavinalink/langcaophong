import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "ADMIN") return null
  return session
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const services = await prisma.service.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] })
  return NextResponse.json(services)
}

export async function POST(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const data = await req.json()
  const service = await prisma.service.create({
    data: {
      name: data.name,
      description: data.description || null,
      icon: data.icon || null,
      price: Number(data.price),
      priceUnit: data.priceUnit || "booking",
      category: data.category || "food",
      isActive: data.isActive !== false,
      sortOrder: Number(data.sortOrder) || 0,
    }
  })
  return NextResponse.json(service)
}
