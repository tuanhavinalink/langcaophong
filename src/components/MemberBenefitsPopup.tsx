"use client"
import { useState } from "react"
import { X, Gift, Crown, Star, User, Users } from "lucide-react"

const tiers = [
  {
    role: "MEMBER",
    label: "Member Thường",
    icon: User,
    color: "#6b7280",
    bg: "#f9fafb",
    border: "#e5e7eb",
    benefits: [
      "Tiền phòng theo quy định của Làng",
      "Không phải TIP dọn phòng",
      "Giảm 30% học phí cho người thứ 2 đi kèm",
      "Chi tiêu đủ 10 triệu VNĐ → tự động lên VIP",
    ],
  },
  {
    role: "VIP",
    label: "VIP",
    icon: Star,
    color: "#b45309",
    bg: "#fffbeb",
    border: "#fde68a",
    benefits: [
      "Miễn phí Booking phòng nghỉ — không hạn chế thời gian & số lượng",
      "Tiền Tip dọn phòng 200k/Bungalow cho 1 ngày đêm",
      "Giảm 30% tất cả các khóa học tại Làng",
      "Tặng 1kg rau sâm của Làng mỗi lần lên làng",
    ],
  },
  {
    role: "SHAREHOLDER_MAIN",
    label: "Cổ Đông Chính",
    sublabel: "15 người ban đầu",
    icon: Crown,
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#e9d5ff",
    benefits: [
      "Miễn phí Booking phòng nghỉ — không hạn chế thời gian & số lượng",
      "Tiền Tip dọn phòng 200k/Bungalow cho 1 ngày đêm",
      "Miễn phí 2 ngày 1 đêm bao ăn ở để họp Làng hàng năm",
      "Miễn phí các khóa học tại Làng bao ăn ở (mỗi khóa 1 lần tham gia)",
      "Giảm 50% học phí cho người thân đi học tại Làng",
      "Tặng 10kg rau sâm, củ sâm & trà sâm/năm (trị giá 2 triệu VNĐ)",
    ],
  },
  {
    role: "SHAREHOLDER_FOLLOW",
    label: "Cổ Đông Shares",
    sublabel: "Mua lại / theo suất cổ đông chính",
    icon: Users,
    color: "#0369a1",
    bg: "#eff6ff",
    border: "#bfdbfe",
    benefits: [
      "Miễn phí Booking phòng nghỉ — không hạn chế thời gian & số lượng",
      "Tiền Tip dọn phòng 200k/Bungalow cho 1 ngày đêm",
      "Miễn phí 2 ngày 1 đêm bao ăn ở để họp Làng hàng năm",
      "Miễn phí 100% học phí các khóa học online/Zoom tại Làng",
      "Giảm 50% học phí nếu lên Làng học trực tiếp",
      "Tặng 1kg rau sâm của Làng mỗi lần lên làng",
    ],
  },
]

const roleLabel: Record<string, string> = {
  MEMBER: "Member Thường",
  VIP: "VIP",
  SHAREHOLDER_MAIN: "Cổ Đông Chính",
  SHAREHOLDER_FOLLOW: "Cổ Đông Shares",
  SHAREHOLDER: "Cổ Đông",
  ADMIN: "Quản Trị",
}

export default function MemberBenefitsPopup({ currentRole }: { currentRole: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 w-full px-4 py-2.5 rounded-xl text-sm font-medium border transition hover:opacity-80"
        style={{ borderColor: '#2d6a4f', color: '#2d6a4f', backgroundColor: '#f0fdf4' }}
      >
        <Gift className="w-4 h-4" />
        Xem Quyền Lợi Thành Viên
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white rounded-t-2xl p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5" style={{ color: '#2d6a4f' }} />
                <h2 className="font-bold text-gray-900">Quyền Lợi Thành Viên</h2>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              {tiers.map(tier => {
                const Icon = tier.icon
                const isCurrent = currentRole === tier.role ||
                  (currentRole === "SHAREHOLDER" && tier.role === "SHAREHOLDER_MAIN")
                return (
                  <div
                    key={tier.role}
                    className="rounded-xl border-2 overflow-hidden"
                    style={{ borderColor: isCurrent ? tier.color : tier.border }}
                  >
                    <div className="flex items-center gap-2 px-4 py-2.5" style={{ backgroundColor: tier.bg }}>
                      <Icon className="w-4 h-4 shrink-0" style={{ color: tier.color }} />
                      <div>
                        <span className="font-bold text-sm" style={{ color: tier.color }}>{tier.label}</span>
                        {(tier as any).sublabel && (
                          <span className="text-xs ml-1.5 opacity-70" style={{ color: tier.color }}>({(tier as any).sublabel})</span>
                        )}
                      </div>
                      {isCurrent && (
                        <span className="ml-auto text-xs px-2 py-0.5 rounded-full text-white font-medium shrink-0" style={{ backgroundColor: tier.color }}>
                          Của bạn
                        </span>
                      )}
                    </div>
                    <ul className="px-4 py-3 space-y-1.5 bg-white">
                      {tier.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="mt-0.5 shrink-0 font-bold" style={{ color: tier.color }}>✓</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}

              <div className="rounded-xl p-3 text-xs text-gray-500 text-center" style={{ backgroundColor: '#f0fdf4' }}>
                Tip dọn phòng áp dụng theo chính sách TIP WC của Làng Cao Phong
              </div>

              <button
                onClick={() => setOpen(false)}
                className="w-full py-3 rounded-xl font-medium text-white text-sm"
                style={{ backgroundColor: '#2d6a4f' }}
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
