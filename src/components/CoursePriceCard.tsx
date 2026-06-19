"use client"
import { useState } from "react"
import { Check } from "lucide-react"
import EnrollButton from "./EnrollButton"

function fmt(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

interface Option { type: string; price: number }

interface Props {
  courseId: string
  courseName: string
  slug: string
  isLoggedIn: boolean
  existingEnrollment: { id: string; status: string } | null
  basePrice: number          // course.price in DB (max package, used as fallback)
  registerOptions: Option[]  // packages from schedule.options
  userRole?: string | null
  userPhone?: string | null
  usedFreeSlot: boolean
  priorEnrollmentCount: number
  checkItems: string[]
}

export default function CoursePriceCard({
  courseId, courseName, slug, isLoggedIn, existingEnrollment,
  basePrice, registerOptions, userRole, userPhone, usedFreeSlot,
  priorEnrollmentCount, checkItems,
}: Props) {
  const hasOptions = registerOptions.length > 0
  // Default to first option (highest) if options exist, else basePrice
  const [selectedIdx, setSelectedIdx] = useState(0)

  const selectedPrice = hasOptions ? (registerOptions[selectedIdx]?.price ?? basePrice) : basePrice

  // finalPrice for EnrollButton (after role discount, no option)
  // EnrollButton handles role pricing internally using basePrice
  // We pass selectedPrice as both basePrice and finalPrice so discounts apply to selection
  const finalPrice = userRole === "VIP" ? Math.round(selectedPrice * 0.7) : selectedPrice

  // Discount display
  const halfPrice = Math.round(selectedPrice * 0.5)
  const vipPrice = Math.round(selectedPrice * 0.7)

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl">
      {/* Header price */}
      <div className="text-center mb-5">
        <p className="text-gray-500 text-sm mb-1">
          {slug === "trai-he" ? "Học phí 5 ngày 4 đêm" : "Học phí ăn ở tại Làng"}
        </p>
        <div className="text-4xl font-bold mb-1" style={{ color: '#2d6a4f' }}>
          {fmt(selectedPrice)}
        </div>
      </div>

      {/* Selectable options */}
      {hasOptions && (
        <div className="mb-4 space-y-2">
          {registerOptions.map((opt, i) => (
            <label
              key={i}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                selectedIdx === i
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="coursePackage"
                  checked={selectedIdx === i}
                  onChange={() => setSelectedIdx(i)}
                  className="accent-green-700 w-4 h-4"
                />
                <span className={`text-sm font-medium ${selectedIdx === i ? 'text-gray-900' : 'text-gray-600'}`}>
                  {opt.type}
                </span>
              </div>
              <span className="font-bold text-sm shrink-0" style={{ color: selectedIdx === i ? '#2d6a4f' : '#6b7280' }}>
                {fmt(opt.price)}
              </span>
            </label>
          ))}
        </div>
      )}

      {/* Role discount badges */}
      {userRole === "SHAREHOLDER_MAIN" && (
        <div className="mb-3 rounded-xl p-3 text-sm space-y-1" style={{ backgroundColor: '#f5f3ff', border: '1.5px solid #e9d5ff' }}>
          <div className="font-semibold" style={{ color: '#7c3aed' }}>👑 Quyền lợi Cổ đông Chính</div>
          {priorEnrollmentCount === 0 ? (
            <>
              <div className="text-gray-600">Người 1: <strong className="text-green-700">Miễn phí</strong> (1 lần/khóa học)</div>
              <div className="text-gray-600">Người 2 trở đi: <strong style={{ color: '#7c3aed' }}>-50% = {fmt(halfPrice)}/người</strong></div>
            </>
          ) : (
            <div className="text-gray-600">Đã dùng suất miễn phí · Lần này: <strong style={{ color: '#7c3aed' }}>-50% = {fmt(halfPrice)}/người</strong></div>
          )}
        </div>
      )}
      {userRole === "SHAREHOLDER_FOLLOW" && (
        <div className="mb-3 rounded-xl p-3 text-sm space-y-1" style={{ backgroundColor: '#eff6ff', border: '1.5px solid #bfdbfe' }}>
          <div className="font-semibold text-blue-700">🤝 Quyền lợi Cổ đông Shares</div>
          <div className="text-gray-600">Lên Làng (offline): <strong className="text-blue-700">-50% = {fmt(halfPrice)}/người</strong></div>
          <div className="text-gray-600">Online / Zoom: <strong className="text-green-700">Miễn phí</strong></div>
        </div>
      )}
      {userRole === "VIP" && (
        <div className="mb-3 rounded-xl p-3 text-sm space-y-1" style={{ backgroundColor: '#fefce8', border: '1.5px solid #fde68a' }}>
          <div className="font-semibold text-yellow-700">⭐ Quyền lợi VIP</div>
          <div className="text-gray-600">Giảm <strong className="text-yellow-700">30%</strong> — chỉ còn <strong className="text-green-700">{fmt(vipPrice)}/người</strong></div>
        </div>
      )}

      <EnrollButton
        courseId={courseId}
        courseName={courseName}
        slug={slug}
        isLoggedIn={isLoggedIn}
        existingEnrollment={existingEnrollment}
        finalPrice={finalPrice}
        userPhone={userPhone ?? null}
        userRole={userRole ?? null}
        basePrice={selectedPrice}
        usedFreeSlot={usedFreeSlot}
      />

      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
        {checkItems.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
            <Check className="w-4 h-4 text-green-600 shrink-0" /> {item}
          </div>
        ))}
      </div>
    </div>
  )
}
