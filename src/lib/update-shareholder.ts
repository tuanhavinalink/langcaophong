import { prisma } from "./prisma"

async function main() {
  const result = await prisma.user.update({
    where: { email: "hathaianh@gmail.com" },
    data: {
      shareAmount: 750_000_000,
      role: "SHAREHOLDER",
    },
  })
  console.log(`✅ Updated ${result.name}: shareAmount = ${result.shareAmount.toLocaleString('vi-VN')} đ`)
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
