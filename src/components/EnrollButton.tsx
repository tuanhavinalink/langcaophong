"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, BookOpen, X } from "lucide-react"

function formatCurrency(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

interface Props {
  courseId: string
  courseName: string
  isLoggedIn: boolean
  existingEnrollment: { id: string; status: string } | null
  finalPrice: number
}

const STATUS_LABELS: Record<string, string> = {
  ENROLLED: "Đã đăng ký · Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
}

export default function EnrollButton({ courseId, courseName, isLoggedIn, existingEnrollment, finalPrice }: Props) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [preferredDate, setPreferredDate] = useState("")
  const [format, setFormat] = useState("Trực tiếp tại Làng")
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  if (existingEnrollment && existingEnrollment.status !== "CANCELLED") {
    return (
      <div className="w-full py-3.5 rounded-xl text-center font-semibold text-base flex items-center justify-center gap-2 bg-green-50 border-2 border-green-200 text-green-700">
        <CheckCircle className="w-5 h-5" />
        {STATUS_LABELS[existingEnrollment.status] || existingEnrollment.status}
      </div>
    )
  }

  const handleSubmit = async () => {
    setLoading(true); setError("")
    const res = await fetch("/api/courses/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, preferredDate, format, note }),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) { setSuccess(true) }
    else setError(data.error || "Đăng ký thất bại")
  }

  if (!isLoggedIn) {
    return (
      <button
        onClick={() => router.push("/login")}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-white font-semibold text-lg transition-all hover:opacity-90"
        style={{ backgroundColor: '#2d6a4f' }}
      >
        <BookOpen className="w-5 h-5" /> Đăng Nhập Để Đăng Ký
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-white font-semibold text-lg transition-all hover:opacity-90"
        style={{ backgroundColor: '#2d6a4f' }}
      >
        <BookOpen className="w-5 h-5" /> Đăng Ký Ngay
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            {success ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#d1fae5' }}>
                  <CheckCircle className="w-8 h-8" style={{ color: '#2d6a4f' }} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Đăng Ký Thành Công!</h3>
                <p className="text-gray-500 text-sm mb-5">Chúng tôi sẽ liên hệ xác nhận lịch học sớm nhất. Bạn có thể xem trạng thái trong Dashboard.</p>
                <div className="flex gap-3">
                  <button onClick={() => router.push("/dashboard")} className="flex-1 py-2.5 rounded-xl text-white font-medium text-sm" style={{ backgroundColor: '#2d6a4f' }}>Xem Dashboard</button>
                  <button onClick={() => { setShowModal(false); setSuccess(false) }} className="flex-1 py-2.5 rounded-xl border border-gray-200 font-medium text-sm text-gray-700">Đóng</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-gray-900">Đăng Ký: {courseName}</h3>
                  <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hình thức tham gia</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Trực tiếp tại Làng", "Online LMS", "Zoom", "VIP Membership"].map(f => (
                        <label key={f} className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-sm transition-colors ${format === f ? 'border-green-500 bg-green-50 font-medium' : 'border-gray-200 hover:bg-gray-50'}`}>
                          <input type="radio" name="format" checked={format === f} onChange={() => setFormat(f)} className="accent-green-700" />
                          {f}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tham dự mong muốn</label>
                    <input type="date" value={preferredDate} onChange={e => setPreferredDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú thêm</label>
                    <textarea rows={2} value={note} onChange={e => setNote(e.target.value)} placeholder="Câu hỏi, yêu cầu đặc biệt..." className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none resize-none" />
                  </div>
                  <div className="p-3 rounded-xl text-sm" style={{ backgroundColor: '#f0fdf4' }}>
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-700">Học phí</span>
                      <span style={{ color: '#2d6a4f' }}>{finalPrice === 0 ? 'Miễn phí' : formatCurrency(finalPrice)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Thanh toán sau khi được xác nhận lịch học</p>
                  </div>
                  {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={handleSubmit} disabled={loading} className="flex-1 py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-50" style={{ backgroundColor: '#2d6a4f' }}>
                    {loading ? 'Đang gửi...' : 'Xác Nhận Đăng Ký'}
                  </button>
                  <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-gray-200 font-medium text-sm text-gray-700">Hủy</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
