import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
const pool = new Pool({ connectionString: process.env.DIRECT_URL!.replace('?pgbouncer=true',''), ssl:{rejectUnauthorized:false} })
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) } as any)

async function main() {
  const svc = await (prisma.service as any).findFirst({ where: { name: { contains: "Lễ tết" } } })
  if (svc) {
    await prisma.service.update({ where: { id: svc.id }, data: { priceUnit: "night_unit" } })
    console.log(`✅ Updated "${svc.name}" → priceUnit: night_unit`)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
