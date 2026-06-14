import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
const pool = new Pool({ connectionString: process.env.DIRECT_URL!.replace('?pgbouncer=true',''), ssl:{rejectUnauthorized:false} })
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) } as any)
prisma.service.create({ data: { name: "Phụ thu Lễ tết / Chủ nhật", description: "Áp dụng cho ngày Lễ, Tết và Chủ nhật", icon: "🎉", price: 200000, priceUnit: "night", category: "facility", isActive: true, sortOrder: 9 } })
  .then(r => console.log("✅ Created:", r.name))
  .catch(console.error)
  .finally(() => prisma.$disconnect())
