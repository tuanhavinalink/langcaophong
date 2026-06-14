import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DIRECT_URL!.replace('?pgbouncer=true', ''),
  ssl: { rejectUnauthorized: false },
})
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) } as any)

async function main() {
  await prisma.course.update({
    where: { slug: "vi-mo" },
    data: {
      name: "TẦM NHÌN VĨ MÔ Vượt THỜI ĐẠI",
      description: "Workshop 2 ngày 1 đêm tại Làng Cao Phong (cách Hà Nội 80km) cùng giảng viên Tuấn Hà và các chuyên gia vĩ mô. Trang bị tư duy kinh tế vĩ mô toàn cầu và Việt Nam để không bị tụt lại phía sau trong cuộc cạnh tranh thời đại mới.",
      duration: "2 ngày 1 đêm",
      price: 2300000,
      originalPrice: 5000000,
      maxStudents: 30,
      instructor: "Tuấn Hà & Chuyên gia Vĩ Mô",
      benefits: JSON.stringify([
        "1.000 báo cáo & bộ dữ liệu vĩ mô",
        "900.000 danh bạ doanh nghiệp Trung Quốc",
        "Công cụ phân tích vĩ mô AI hàng ngày",
        "Báo cáo quy hoạch 100 năm Hà Nội cá nhân hóa",
        "Coaching 1-1 miễn phí",
        "Kết nối cộng đồng nhà đầu tư vĩ mô",
        "Tài liệu học tập trọn bộ",
        "Bữa ăn & chỗ nghỉ tại Làng Cao Phong",
      ]),
      curriculum: JSON.stringify([
        "Buổi 1: Tầng lớp tinh hoa kiểm soát thế giới - Chu kỳ 'hớt tóc tài sản' và cấu trúc kinh tế vĩ mô toàn cầu 300 năm",
        "Buổi 2: Thoát bẫy thu nhập trung bình - Cơ hội và chiến lược Việt Nam trong 20 năm tới",
        "Buổi 3: Quy hoạch 100 năm Việt Nam & Hà Nội - Phân tích và hướng dẫn phân bổ đầu tư cá nhân",
        "Bonus: Trải nghiệm thiên nhiên Làng Cao Phong - Networking cùng cộng đồng nhà đầu tư",
      ]),
      schedule: JSON.stringify({
        registerUrl: "https://forms.gle/z6iG2vCDRzJjmRkQ8",
        options: [
          { type: "Trực tiếp tại Làng", price: 2300000 },
          { type: "Online LMS", price: null },
          { type: "Zoom", price: null },
          { type: "VIP Membership", price: null },
        ]
      }),
      imageUrl: "/images/course-vimo.jpg",
    }
  })
  console.log("✅ Cập nhật khóa học Vĩ Mô thành công!")
}

main().catch(console.error).finally(() => prisma.$disconnect())
