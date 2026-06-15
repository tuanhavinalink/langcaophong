"use client"
import { useState } from "react"
import { X, Gift, Crown, Star, User } from "lucide-react"

const tiers = [
  {
    role: "MEMBER",
    label: "Thành Viên",
    icon: User,
    color: "#6b7280",
    bg: "#f9fafb",
    border: "#e5e7eb",
    benefits: [
      "Miễn phí Booking phòng nghỉ, không hạn chế thời gian & số lượng",
      "Giảm 30% học phí cho người thứ 2 đi kèm",
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
      "Miễn phí Booking phòng nghỉ, không hạn chế thời gian & số lượng",
      "Giảm 30% tất cả các khóa học tại Làng",
      "Tặng 1kg rau sâm của Làng mỗi lần lên làng",
    ],
  },
  {
    role: "SHAREHOLDER",
    label: "Cổ Đông Làng",
    icon: Crown,
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#e9d5ff",
    benefits: [
      "Miễn phí Booking phòng nghỉ, không hạn chế thời gian & số lượng",
      "Miễn phí 2 ngày 1 đêm bao ăn ở để họp Làng hàng năm",
      "Miễn phí 2 khóa học tại Làng (Tip 700k cho 3 bữa & nghỉ đêm 2 ngày)",
      "Giảm 50% học phí cho người thân đi học tại Làng",
      "Tặng 10kg rau sâm, củ sâm & trà sâm/năm (trị giá 2 triệu VND)",
    ],
  },
]

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

            <div className="p-5 space-y-4">
              {tiers.map(tier => {
                const Icon = tier.icon
                const isCurrent = currentRole === tier.role
                return (
                  <div
                    key={tier.role}
                    className="rounded-xl border-2 overflow-hidden"
                    style={{ borderColor: isCurrent ? tier.color : tier.border }}
                  >
                    <div className="flex items-center gap-2 px-4 py-3" style={{ backgroundColor: tier.bg }}>
                      <Icon className="w-4 h-4 shrink-0" style={{ color: tier.color }} />
                      <span className="font-bold text-sm" style={{ color: tier.color }}>{tier.label}</span>
                      {isCurrent && (
                        <span className="ml-auto text-xs px-2 py-0.5 rounded-full text-white font-medium" style={{ backgroundColor: tier.color }}>
                          Của bạn
                        </span>
                      )}
                    </div>
                    <ul className="px-4 py-3 space-y-2 bg-white">
                      {tier.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="mt-0.5 shrink-0" style={{ color: tier.color }}>✓</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}

              <div className="rounded-xl p-3 text-xs text-gray-500 text-center" style={{ backgroundColor: '#f0fdf4' }}>
                Phòng nghỉ miễn phí áp dụng theo chính sách TIP WC của Làng Cao Phong
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
