import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const items = await prisma.mediaItem.findMany({ orderBy: { sortOrder: "asc" } })
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const data = await req.json()
  const item = await prisma.mediaItem.create({
    data: {
      title: data.title,
      description: data.description || null,
      type: data.type || "image",
      url: data.url,
      thumbnail: data.thumbnail || null,
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
    }
  })
  return NextResponse.json(item)
}
