import { prisma } from "./prisma"

async function main() {
  const vimoSchedule = {
    options: [
      { type: "Trực tiếp tại Làng (2N1Đ)", price: 2300000 },
      { type: "Online / Zoom", price: null, label: "Đã bao gồm" },
    ]
  }

  const soloSchedule = {
    options: [
      { type: "Trực tiếp tại Làng (2N1Đ)", price: 2300000 },
      { type: "Online / Zoom", price: null, label: "Đã bao gồm" },
    ]
  }

  const detoxSchedule = {
    options: [
      { type: "Trực tiếp tại Làng (5N4Đ)", price: 3300000 },
      { type: "Online / Zoom", price: null, label: "Đã bao gồm" },
    ]
  }

  await prisma.course.update({ where: { slug: "vi-mo" }, data: { schedule: JSON.stringify(vimoSchedule) } })
  await prisma.course.update({ where: { slug: "solo" }, data: { schedule: JSON.stringify(soloSchedule) } })
  await prisma.course.update({ where: { slug: "detox-sam" }, data: { schedule: JSON.stringify(detoxSchedule) } })

  console.log("✅ Updated schedule options for vi-mo, solo, detox-sam")
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
