import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password, memberType } = await req.json()

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 })
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] }
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email hoặc số điện thoại đã được đăng ký" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const affiliateCode = Math.random().toString(36).substring(2, 8).toUpperCase()

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        affiliateCode,
        role: memberType === "SHAREHOLDER_MAIN" ? "SHAREHOLDER_MAIN"
             : memberType === "SHAREHOLDER_FOLLOW" ? "SHAREHOLDER_FOLLOW"
             : "MEMBER",
      }
    })

    return NextResponse.json({ success: true, userId: user.id })
  } catch (error: any) {
    console.error("Register error:", error?.message || error)
    return NextResponse.json({ error: "Lỗi server: " + (error?.message || "Unknown") }, { status: 500 })
  }
}
