"use client"
import { useState } from "react"
import { X, BookOpen, Copy, Check } from "lucide-react"

const BANK_ID = "MB"
const ACCOUNT_NO = "6866663666666"
const ACCOUNT_NAME = "TRAN CAO CUONG"

function fmt(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + " đ"
}

function fmtDate(d: string | Date | null | undefined) {
  if (!d) return "-"
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(d))
}

const statusColors: Record<string, string> = {
  ENROLLED: "bg-orange-100 text-orange-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700",
}
const statusLabels: Record<string, string> = {
  ENROLLED: "Chờ cọc & xác nhận",
  CONFIRMED: "Đã xác nhận",
  CANCELLED: "Đã hủy",
  COMPLETED: "Hoàn thành",
}

type Enrollment = {
  id: string
  status: string
  paidPrice: number
  createdAt: string | Date
  scheduleDate?: string | Date | null
  course: {
    name: string
    duration: string
    instructor?: string | null
  }
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs transition"
      style={{ backgroundColor: copied ? '#d1fae5' : '#f3f4f6', color: copied ? '#065f46' : '#6b7280' }}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Đã copy" : "Copy"}
    </button>
  )
}

function EnrollmentCard({ enrollment, userPhone }: { enrollment: Enrollment; userPhone?: string | null }) {
  const [open, setOpen] = useState(false)

  const needsPayment = enrollment.paidPrice > 0 && (enrollment.status === "ENROLLED" || enrollment.status === "CONFIRMED")
  const transferNote = `Tien an Khoa hoc ${userPhone || ''}`
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${enrollment.paidPrice}&addInfo=${encodeURIComponent(transferNote)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`

  return (
    <>
      <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setOpen(true)}>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-900">{enrollment.course.name}</div>
            <div className="text-sm text-gray-500">{enrollment.course.duration}</div>
            {enrollment.course.instructor && (
              <div className="text-xs text-gray-400 mt-0.5">{enrollment.course.instructor}</div>
            )}
          </div>
          <div className="text-right shrink-0 ml-4">
            <div className={`px-2 py-0.5 rounded-full text-xs font-medium mb-1 ${statusColors[enrollment.status]}`}>
              {statusLabels[enrollment.status]}
            </div>
            <div className="text-sm font-medium" style={{ color: '#2d6a4f' }}>
              {enrollment.paidPrice === 0 ? 'Miễn phí' : fmt(enrollment.paidPrice)}
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white rounded-t-2xl p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" style={{ color: '#2d6a4f' }} />
                <div className="font-bold text-gray-900">Chi Tiết Khóa Học</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[enrollment.status]}`}>
                  {statusLabels[enrollment.status]}
                </span>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-full hover:bg-gray-100 ml-1">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Course info */}
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 bg-gray-50">Thông tin khóa học</div>
                <div className="px-4 py-2 space-y-0">
                  <div className="flex justify-between items-start py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500">Tên khóa</span>
                    <span className="text-sm font-medium text-gray-900 text-right ml-4">{enrollment.course.name}</span>
                  </div>
                  <div className="flex justify-between items-start py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500">Thời gian</span>
                    <span className="text-sm font-medium text-gray-900">{enrollment.course.duration}</span>
                  </div>
                  {enrollment.course.instructor && (
                    <div className="flex justify-between items-start py-2 border-b border-gray-50">
                      <span className="text-sm text-gray-500">Giảng viên</span>
                      <span className="text-sm font-medium text-gray-900 text-right ml-4">{enrollment.course.instructor}</span>
                    </div>
                  )}
                  {enrollment.scheduleDate && (
                    <div className="flex justify-between items-start py-2 border-b border-gray-50">
                      <span className="text-sm text-gray-500">Ngày học</span>
                      <span className="text-sm font-medium text-gray-900">{fmtDate(enrollment.scheduleDate)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-start py-2">
                    <span className="text-sm text-gray-500">Đăng ký lúc</span>
                    <span className="text-sm font-medium text-gray-900">{fmtDate(enrollment.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 bg-gray-50">Chi phí</div>
                <div className="px-4 py-4 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Tổng cộng</span>
                  <span className="font-bold text-lg" style={{ color: enrollment.paidPrice === 0 ? '#16a34a' : '#2d6a4f' }}>
                    {enrollment.paidPrice === 0 ? 'Miễn phí' : fmt(enrollment.paidPrice)}
                  </span>
                </div>
              </div>

              {/* QR Payment — for paid courses */}
              {needsPayment && (
                <div className="rounded-xl overflow-hidden border-2 border-green-200">
                  <div className="px-4 py-2.5 text-center font-semibold text-sm" style={{ backgroundColor: '#f0fdf4', color: '#166534' }}>
                    💳 Chuyển khoản học phí {fmt(enrollment.paidPrice)}
                  </div>
                  <div className="bg-white p-4">
                    <div className="flex justify-center mb-4">
                      <img src={qrUrl} alt="QR chuyển khoản" className="w-48 h-48 rounded-xl border border-gray-100" />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between p-2.5 rounded-lg" style={{ backgroundColor: '#f9fafb' }}>
                        <div>
                          <div className="text-xs text-gray-400">Ngân hàng</div>
                          <div className="font-semibold text-gray-900">MBBank (Quân Đội)</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg" style={{ backgroundColor: '#f9fafb' }}>
                        <div>
                          <div className="text-xs text-gray-400">Số tài khoản</div>
                          <div className="font-bold text-gray-900 font-mono tracking-wide">{ACCOUNT_NO}</div>
                        </div>
                        <CopyButton text={ACCOUNT_NO} />
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg" style={{ backgroundColor: '#f9fafb' }}>
                        <div>
                          <div className="text-xs text-gray-400">Chủ tài khoản</div>
                          <div className="font-semibold text-gray-900">{ACCOUNT_NAME}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg border border-green-100" style={{ backgroundColor: '#f0fdf4' }}>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-green-700">Nội dung chuyển khoản</div>
                          <div className="font-bold text-gray-900 text-sm">{transferNote}</div>
                        </div>
                        <CopyButton text={transferNote} />
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg" style={{ backgroundColor: '#f9fafb' }}>
                        <div>
                          <div className="text-xs text-gray-400">Số tiền</div>
                          <div className="font-bold" style={{ color: '#2d6a4f' }}>{fmt(enrollment.paidPrice)}</div>
                        </div>
                        <CopyButton text={String(enrollment.paidPrice)} />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-3">
                      Sau khi chuyển khoản, Làng sẽ xác nhận trong vòng 24h.<br />
                      Liên hệ Hoàng Nga: <strong className="text-gray-600">0986 655 894</strong>
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={() => setOpen(false)}
                className="w-full py-3 rounded-xl font-medium text-white text-sm"
                style={{ backgroundColor: '#2d6a4f' }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function CourseEnrollmentList({ enrollments, userPhone }: {
  enrollments: Enrollment[]
  userPhone?: string | null
}) {
  if (enrollments.length === 0) return null
  return (
    <div className="divide-y divide-gray-50">
      {enrollments.map(e => <EnrollmentCard key={e.id} enrollment={e} userPhone={userPhone} />)}
    </div>
  )
}
