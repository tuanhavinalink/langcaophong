import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const pool = new Pool({ connectionString: process.env.DIRECT_URL!.replace('?pgbouncer=true', ''), ssl: { rejectUnauthorized: false } })
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) } as any)

async function main() {
  const defaultServices = [
    { name: "Bữa sáng", description: "Bữa sáng đủ dinh dưỡng tại Làng", icon: "🌅", price: 80000, priceUnit: "person_night", category: "food", sortOrder: 1 },
    { name: "Bữa trưa", description: "Cơm trưa thuần việt sạch tại bếp Làng", icon: "🍱", price: 100000, priceUnit: "person_night", category: "food", sortOrder: 2 },
    { name: "Bữa tối", description: "Bữa tối ấm cúng cùng mọi người", icon: "🍚", price: 120000, priceUnit: "person_night", category: "food", sortOrder: 3 },
    { name: "Phí dịch vụ bếp", description: "Tip phục vụ và dụng cụ bếp núc", icon: "🍳", price: 50000, priceUnit: "booking", category: "facility", sortOrder: 4 },
    { name: "Lửa trại buổi tối", description: "Đốt lửa trại, nướng thực phẩm, văn nghệ", icon: "🔥", price: 500000, priceUnit: "booking", category: "activity", sortOrder: 5 },
    { name: "Chèo thuyền kayak", description: "Chèo kayak trên sông quanh làng", icon: "🚣", price: 100000, priceUnit: "person", category: "activity", sortOrder: 6 },
    { name: "Tắm thảo dược", description: "Ngâm thảo dược phục hồi sức khỏe", icon: "🌿", price: 200000, priceUnit: "person", category: "facility", sortOrder: 7 },
  ]

  for (const svc of defaultServices) {
    await prisma.service.upsert({
      where: { id: svc.name } as any,
      create: svc,
      update: svc,
    }).catch(async () => {
      const existing = await (prisma.service as any).findFirst({ where: { name: svc.name } })
      if (!existing) await prisma.service.create({ data: svc })
    })
  }
  console.log("✅ Seeded", defaultServices.length, "services")
}

main().catch(console.error).finally(() => prisma.$disconnect())
