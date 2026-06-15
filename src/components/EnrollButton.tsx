"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, BookOpen, X, Copy, Check, Minus, Plus } from "lucide-react"

const BANK_ID = "MB"
const ACCOUNT_NO = "6866663666666"
const ACCOUNT_NAME = "TRAN CAO CUONG"

function fmt(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + " đ"
}

// Lịch cố định theo slug
const SCHEDULES: Record<string, string[]> = {
  "vi-mo": ["20 – 21/06/2026", "04 – 05/07/2026"],
  "solo": ["27 – 28/06/2026"],
}

// Keyword cho nội dung CK
const CK_NOTE: Record<string, string> = {
  "vi-mo": "Vi Mo",
  "solo": "Solo",
  "detox-sam": "Detox",
}

interface Props {
  courseId: string
  courseName: string
  slug: string
  isLoggedIn: boolean
  existingEnrollment: { id: string; status: string } | null
  finalPrice: number
  userPhone?: string | null
}

const STATUS_LABELS: Record<string, string> = {
  ENROLLED: "Đã đăng ký · Chờ thanh toán",
  CONFIRMED: "Đã xác nhận",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs transition shrink-0"
      style={{ backgroundColor: copied ? '#d1fae5' : '#f3f4f6', color: copied ? '#065f46' : '#6b7280' }}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Đã copy" : "Copy"}
    </button>
  )
}

export default function EnrollButton({ courseId, courseName, slug, isLoggedIn, existingEnrollment, finalPrice, userPhone }: Props) {
  const router = useRouter()
  const scheduleOptions = SCHEDULES[slug] || []
  const ckKeyword = CK_NOTE[slug] || courseName

  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(scheduleOptions[0] || "")
  const [freeDate, setFreeDate] = useState("")
  const [qty, setQty] = useState(1)
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)
  const [enrollmentData, setEnrollmentData] = useState<{ paidPrice: number; transferNote: string; qrUrl: string } | null>(null)
  const [error, setError] = useState("")

  const totalPrice = finalPrice * qty
  const transferNote = `${userPhone || 'SDT'} ${ckKeyword}`
  const qrUrl = totalPrice > 0
    ? `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${totalPrice}&addInfo=${encodeURIComponent(transferNote)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`
    : ""

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
    const chosenDate = scheduleOptions.length > 0 ? selectedDate : freeDate
    const res = await fetch("/api/courses/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId,
        preferredDate: chosenDate,
        format: "Trực tiếp tại Làng",
        note: `${qty} người${note ? ' · ' + note : ''}`,
        quantity: qty,
        totalPrice,
      }),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      setEnrollmentData({ paidPrice: totalPrice, transferNote, qrUrl })
    } else {
      setError(data.error || "Đăng ký thất bại")
    }
  }

  if (!isLoggedIn) {
    return (
      <button onClick={() => router.push("/login")} className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-white font-semibold text-lg transition-all hover:opacity-90" style={{ backgroundColor: '#2d6a4f' }}>
        <BookOpen className="w-5 h-5" /> Đăng Nhập Để Đăng Ký
      </button>
    )
  }

  return (
    <>
      <button onClick={() => setShowModal(true)} className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-white font-semibold text-lg transition-all hover:opacity-90" style={{ backgroundColor: '#2d6a4f' }}>
        <BookOpen className="w-5 h-5" /> Đăng Ký Ngay
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            {enrollmentData ? (
              /* ── SUCCESS + QR ── */
              <div className="p-6">
                <div className="text-center mb-5">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#d1fae5' }}>
                    <CheckCircle className="w-8 h-8" style={{ color: '#2d6a4f' }} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Đăng Ký Thành Công!</h3>
                  <p className="text-gray-500 text-sm mt-1">Vui lòng chuyển khoản để hoàn tất đăng ký</p>
                </div>

                {enrollmentData.paidPrice > 0 && (
                  <div className="rounded-xl overflow-hidden border-2 border-green-200 mb-4">
                    <div className="px-4 py-2.5 text-center font-semibold text-sm" style={{ backgroundColor: '#f0fdf4', color: '#166534' }}>
                      💳 Chuyển khoản học phí {fmt(enrollmentData.paidPrice)}
                    </div>
                    <div className="bg-white p-4">
                      <div className="flex justify-center mb-4">
                        <img src={enrollmentData.qrUrl} alt="QR chuyển khoản" className="w-48 h-48 rounded-xl border border-gray-100" />
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
                          <div>
                            <div className="text-xs text-gray-400">Ngân hàng</div>
                            <div className="font-semibold text-gray-900">MBBank (Quân Đội)</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
                          <div>
                            <div className="text-xs text-gray-400">Số tài khoản</div>
                            <div className="font-bold font-mono tracking-wide text-gray-900">{ACCOUNT_NO}</div>
                          </div>
                          <CopyBtn text={ACCOUNT_NO} />
                        </div>
                        <div className="flex items-center justify-between p-2.5 rounded-lg border border-green-100" style={{ backgroundColor: '#f0fdf4' }}>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-green-700">Nội dung chuyển khoản</div>
                            <div className="font-bold text-gray-900">{enrollmentData.transferNote}</div>
                          </div>
                          <CopyBtn text={enrollmentData.transferNote} />
                        </div>
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
                          <div>
                            <div className="text-xs text-gray-400">Số tiền</div>
                            <div className="font-bold" style={{ color: '#2d6a4f' }}>{fmt(enrollmentData.paidPrice)}</div>
                          </div>
                          <CopyBtn text={String(enrollmentData.paidPrice)} />
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 text-center mt-3">
                        Sau khi chuyển khoản, Làng xác nhận trong 24h.<br />
                        Liên hệ Hoàng Nga: <strong className="text-gray-600">0986 655 894</strong>
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => router.push("/dashboard")} className="flex-1 py-2.5 rounded-xl text-white font-medium text-sm" style={{ backgroundColor: '#2d6a4f' }}>
                    Xem Dashboard
                  </button>
                  <button onClick={() => { setShowModal(false); setEnrollmentData(null) }} className="flex-1 py-2.5 rounded-xl border border-gray-200 font-medium text-sm text-gray-700">
                    Đóng
                  </button>
                </div>
              </div>
            ) : (
              /* ── ENROLLMENT FORM ── */
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-gray-900">Đăng Ký: {courseName}</h3>
                  <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-400" /></button>
                </div>

                <div className="space-y-4">
                  {/* Schedule picker */}
                  {scheduleOptions.length > 0 ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Chọn lịch học</label>
                      <div className="space-y-2">
                        {scheduleOptions.map(d => (
                          <label key={d} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${selectedDate === d ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                            <input type="radio" name="schedule" checked={selectedDate === d} onChange={() => setSelectedDate(d)} className="accent-green-700" />
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">{d}</div>
                              <div className="text-xs text-gray-500">2 ngày 1 đêm tại Làng Cao Phong</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tham dự mong muốn</label>
                      <input type="date" value={freeDate} onChange={e => setFreeDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none" />
                    </div>
                  )}

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số người tham gia</label>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <div className="flex-1 text-center">
                        <span className="text-2xl font-bold text-gray-900">{qty}</span>
                        <span className="text-sm text-gray-500 ml-1">người</span>
                      </div>
                      <button type="button" onClick={() => setQty(q => Math.min(10, q + 1))} className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú thêm <span className="text-gray-400 font-normal">(tuỳ chọn)</span></label>
                    <textarea rows={2} value={note} onChange={e => setNote(e.target.value)} placeholder="Yêu cầu đặc biệt, câu hỏi..." className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none resize-none" />
                  </div>

                  {/* Price summary */}
                  <div className="p-3.5 rounded-xl" style={{ backgroundColor: '#f0fdf4' }}>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>{fmt(finalPrice)} × {qty} người</span>
                      <span className="font-medium">{fmt(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-gray-900">Tổng học phí</span>
                      <span className="text-lg" style={{ color: '#2d6a4f' }}>
                        {totalPrice === 0 ? 'Miễn phí' : fmt(totalPrice)}
                      </span>
                    </div>
                    {totalPrice > 0 && (
                      <p className="text-xs text-gray-500 mt-1">Chuyển khoản sau khi đăng ký thành công</p>
                    )}
                  </div>

                  {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}
                </div>

                <div className="flex gap-3 mt-5">
                  <button onClick={handleSubmit} disabled={loading} className="flex-1 py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-50" style={{ backgroundColor: '#2d6a4f' }}>
                    {loading ? 'Đang gửi...' : 'Xác Nhận Đăng Ký'}
                  </button>
                  <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-gray-200 font-medium text-sm text-gray-700">Hủy</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
