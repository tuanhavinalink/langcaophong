import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import bcrypt from "bcryptjs"
import path from "path"

const dbPath = path.join(process.cwd(), "prisma", "dev.db")
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  const adminPassword = await bcrypt.hash("Caophong$123", 12)
  await prisma.user.upsert({
    where: { email: "tuanha@company.vn" },
    update: {},
    create: {
      name: "Admin Làng Cao Phong",
      email: "tuanha@company.vn",
      phone: "0900000000",
      password: adminPassword,
      role: "ADMIN",
    }
  })
  console.log("Admin created")

  const roomTypes = [
    { id: "bungalow_01", name: "Bungalow 01", type: "BUNGALOW", capacity: 2, pricePerNight: 800000, tipService: 50000, description: "Phòng bungalow view núi, thoáng mát" },
    { id: "bungalow_02", name: "Bungalow 02", type: "BUNGALOW", capacity: 2, pricePerNight: 800000, tipService: 50000, description: "Phòng bungalow view sông, lãng mạn" },
    { id: "bungalow_03", name: "Bungalow 03", type: "BUNGALOW", capacity: 4, pricePerNight: 1200000, tipService: 80000, description: "Bungalow gia đình, 2 phòng ngủ" },
    { id: "glamping_01", name: "Lều Glamping 01", type: "GLAMPING", capacity: 2, pricePerNight: 600000, tipService: 50000, description: "Glamping cơ bản, trải nghiệm thiên nhiên" },
    { id: "glamping_02", name: "Lều Glamping 02", type: "GLAMPING", capacity: 2, pricePerNight: 600000, tipService: 50000, description: "Glamping cao cấp, view hồ" },
    { id: "villa_a", name: "Villa Song Lập A", type: "VILLA", capacity: 6, pricePerNight: 2500000, tipService: 150000, description: "Villa cao cấp, đầy đủ tiện nghi" },
    { id: "villa_b", name: "Villa Song Lập B", type: "VILLA", capacity: 6, pricePerNight: 2500000, tipService: 150000, description: "Villa song lập, không gian riêng tư" },
  ]

  for (const room of roomTypes) {
    await prisma.room.upsert({
      where: { id: room.id },
      update: {},
      create: room
    })
  }
  console.log("Rooms created")

  const courses = [
    {
      slug: "vi-mo",
      name: "Khóa Học Vĩ Mô",
      description: "Khóa học giúp bạn hiểu bức tranh kinh tế vĩ mô, đầu tư thông minh và tư duy chiến lược dài hạn. Học tập trong không gian thiên nhiên tuyệt đẹp của Làng Cao Phong.",
      duration: "3 ngày 2 đêm",
      price: 8500000,
      originalPrice: 12000000,
      maxStudents: 20,
      instructor: "TS. Nguyễn Văn A",
      benefits: JSON.stringify(["Tư duy kinh tế vĩ mô", "Phân tích thị trường", "Chiến lược đầu tư", "Networking với chuyên gia"]),
      curriculum: JSON.stringify(["Ngày 1: Tổng quan kinh tế vĩ mô", "Ngày 2: Phân tích và chiến lược", "Ngày 3: Thực hành và case study"]),
      imageUrl: "/images/course-vimo.jpg",
    },
    {
      slug: "solo",
      name: "Khóa Học SOLO",
      description: "Chương trình đào tạo Solopreneur - kinh doanh một mình hiệu quả. Kết hợp học tập, thực hành và thiền định trong lòng thiên nhiên Cao Phong.",
      duration: "5 ngày 4 đêm",
      price: 15000000,
      originalPrice: 20000000,
      maxStudents: 15,
      instructor: "Mentor Trần Thị B",
      benefits: JSON.stringify(["Mô hình kinh doanh solo", "Marketing cá nhân", "Quản lý tài chính", "Work-life balance"]),
      curriculum: JSON.stringify(["Module 1: Mindset Solopreneur", "Module 2: Xây dựng thương hiệu cá nhân", "Module 3: Hệ thống bán hàng", "Module 4: Tự động hóa", "Module 5: Scaling up"]),
      imageUrl: "/images/course-solo.jpg",
    },
    {
      slug: "detox-sam",
      name: "Khóa Detox Thân Tâm & Trồng Sâm",
      description: "Chương trình detox toàn diện thân - tâm - trí. Học cách trồng và chăm sóc Sâm Ngọc Linh, kết nối với thiên nhiên và tái tạo năng lượng.",
      duration: "7 ngày 6 đêm",
      price: 18000000,
      originalPrice: 25000000,
      maxStudents: 12,
      instructor: "BS. Lê Thị C",
      benefits: JSON.stringify(["Detox cơ thể tự nhiên", "Thiền định và yoga", "Kỹ thuật trồng Sâm", "Ẩm thực dưỡng sinh"]),
      curriculum: JSON.stringify(["Ngày 1-2: Detox & Khai mạc", "Ngày 3-4: Thiền định và yoga", "Ngày 5-6: Thực hành trồng Sâm", "Ngày 7: Tổng kết"]),
      imageUrl: "/images/course-detox.jpg",
    }
  ]

  for (const course of courses) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {},
      create: course
    })
  }
  console.log("Courses created")

  console.log("Seed completed!")
}

main().catch(console.error).finally(() => prisma.$disconnect())
