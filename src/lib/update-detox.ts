import { prisma } from "./prisma"

async function main() {
  const benefits = [
    "Ăn thực dưỡng hoàn toàn bằng Sâm & hạt dinh dưỡng theo Menu NutriMe — thanh lọc cơ thể sâu",
    "Đo sức khỏe & tư vấn 1-1 bởi Chuyên gia dinh dưỡng Quốc gia",
    "Học Dinh dưỡng học cơ bản — đào tạo bởi Chuyên gia NutriMe",
    "Học thiền cơ bản + Nghiên cứu Đại tạng Kinh điển Nikaya & Trà đàm Pháp học (Gosinga)",
    "Học Trà đạo — Trà nương và Trà sâm",
    "Học trồng Sâm Thủy tổ tại Làng Sâm Cao Phong",
    "Thăm Trang trại Hà An — Farm tiêu biểu Phú Thọ",
    "Hái cam bằng thuyền, săn mây vườn hồng tại Làng cam Cao Phong",
  ]

  const curriculum = [
    "3 TRỤ CỘT: THÂN KHỎE – TÂM AN – TIỀN NHIỀU",
    "THÂN: Ăn thực dưỡng Sâm & hạt dinh dưỡng, đo sức khỏe, tư vấn 1-1 Chuyên gia Quốc gia",
    "THÂN: Học Dinh dưỡng học cơ bản — Học viện dinh dưỡng NutriMe (trực tiếp Chủ tịch hướng dẫn)",
    "TÂM: Thiền cơ bản + Nghiên cứu Nikaya + Trà đàm Pháp học — Chủ tịch Gosinga (TempleStay VN)",
    "TÂM: Trà đạo — Trà nương và Trà sâm",
    "TIỀN: Học trồng Sâm Thủy tổ — phát triển cây có giá trị kinh tế cao (KS Hoàng Thị Nga, Viện Rau quả TW)",
    "THAM QUAN: Trang trại Hà An — Farm trang trại tiêu biểu Phú Thọ",
    "THAM QUAN: Làng cam Cao Phong — hái cam bằng thuyền, săn mây vườn hồng",
  ]

  const schedule = {
    options: [
      { type: "Trực tiếp tại Làng (5N4Đ)", price: 3300000 },
    ]
  }

  await prisma.course.update({
    where: { slug: "detox-sam" },
    data: {
      name: "Detox & Trồng Sâm Cao Phong",
      description: "Chương trình 5 ngày 4 đêm phát triển 3 trụ cột: Thân Khỏe – Tâm An – Tiền Nhiều. Phối hợp bởi Học viện NutriMe, TempleStay VN (Gosinga) và Kỹ sư Nông nghiệp Hoàng Thị Nga (Viện Rau quả TW). CHỈ NHẬN 20 ĐĂNG KÝ / KHÓA.",
      duration: "5 ngày 4 đêm (Thứ 2 → Thứ 6)",
      price: 3300000,
      originalPrice: null,
      maxStudents: 20,
      instructor: "NutriMe · Gosinga (TempleStay VN) · KS Hoàng Thị Nga",
      benefits: JSON.stringify(benefits),
      curriculum: JSON.stringify(curriculum),
      schedule: JSON.stringify(schedule),
      isActive: true,
    }
  })

  console.log("✅ Detox-Sam course updated!")
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
