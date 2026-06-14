import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
const pool = new Pool({ connectionString: process.env.DIRECT_URL!.replace('?pgbouncer=true',''), ssl:{rejectUnauthorized:false} })
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) } as any)

async function main() {
  const bungalow = await (prisma.room as any).findFirst({ where: { type: "BUNGALOW" } })
  if (bungalow) {
    await prisma.room.update({ where: { id: bungalow.id }, data: { tipWcBedding: 200000 } })
    console.log(`✅ ${bungalow.name} → tipWcBedding: 200.000đ`)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
