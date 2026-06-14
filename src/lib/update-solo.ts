import { prisma } from "./prisma"

async function main() {
  const benefits = [
    "Mastermind 1-1 trực tiếp với Thầy Tuấn Hà (Mentor SharkTank Việt Nam)",
    "Tài trợ 100% học phí (Giá trị thực tế: 100.000 USD)",
    "Bộ 20 công thức sản phẩm phễu siêu ngách ăn khách nhất",
    "Quyền truy cập mạng lưới kết nối chéo lớp Solo",
    "Tài liệu tối ưu Thuế & Kế toán tối giản cho cá nhân kinh doanh online & OPC",
    "Ứng dụng Agentic AI săn tìm 350+ ngách hẹp từ thế mạnh của bạn",
    "Giải phẫu cấu trúc sản phẩm, đúc MVP và Offer 1 trang chuẩn Alex Hormozi",
    "Lắp ráp hệ thống phễu lọc tự động & kịch bản chốt sales chuyển khoản ngay",
  ]

  const curriculum = [
    "NGÀY 1 — ĐỊNH VỊ NỘI LỰC & GIAO LƯU ĐỒNG ĐẲNG",
    "14h–17h: Khai mở Mindset Doanh nghiệp một người & thiết lập bản đồ năng lực",
    "17h–18h: Trà đạo giữa hồ, thả lỏng tâm trí để kích hoạt tư duy độc lập",
    "19h–21h30: Tiệc BBQ, lửa trại giao lưu, kết nối mạng lưới 'Đồng nghiệp gây ngạc nhiên'",
    "NGÀY 2 — ÉP LỖ HỔNG THỊ TRƯỜNG & ĐÚC OFFER RA TIỀN",
    "06h–07h: Thiền trà sương mây, tái tạo năng lượng đỉnh cao",
    "07h–08h30: Ăn sáng năng lượng tại Làng",
    "09h–11h30: Ứng dụng Agentic AI săn tìm 350+ ngách hẹp từ thế mạnh sâu thẳm của bạn",
    "12h–13h: Ăn trưa đặc sản địa phương",
    "13h–14h30: Tham quan Trang trại nổi giữa sông — khảo sát mô hình thực tế",
    "14h30–17h: Giải phẫu cấu trúc sản phẩm, đúc MVP & mài sắc Offer 1 trang chuẩn Alex Hormozi",
    "19h30–21h30: Lắp ráp hệ thống phễu lọc tự động, hoàn thiện kịch bản chốt sales chuyển khoản ngay",
  ]

  const schedule = {
    options: [
      { type: "Trực tiếp tại Làng (2N1Đ)", price: 2300000 },
      { type: "Online LMS / Zoom", price: 0 },
      { type: "VIP Membership (bao gồm ăn ở)", price: 0 },
    ]
  }

  await prisma.course.update({
    where: { slug: "solo" },
    data: {
      name: "MASTERMIND SOLO 1-1 ĐẶC QUYỀN",
      description: "Huấn luyện trực tiếp, cầm tay chỉ việc bởi Thầy Tuấn Hà (Mentor SharkTank Việt Nam) cùng các khách mời Solo thành công. Tại Làng Cao Phong — không gian retreat biệt lập giữa sông, núi và hồ.",
      duration: "2 ngày 1 đêm",
      price: 2300000,
      originalPrice: null,
      maxStudents: 15,
      instructor: "Thầy Tuấn Hà — Mentor SharkTank Việt Nam",
      benefits: JSON.stringify(benefits),
      curriculum: JSON.stringify(curriculum),
      schedule: JSON.stringify(schedule),
      isActive: true,
    }
  })

  console.log("✅ Solo course updated!")
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
