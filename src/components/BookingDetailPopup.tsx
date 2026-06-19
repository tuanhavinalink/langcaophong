"use client"
import { useState } from "react"
import { X, Hash, Copy, Check } from "lucide-react"

const DEPOSIT_AMOUNT = 500_000
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
  PENDING: "bg-orange-100 text-orange-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700",
}
const statusLabels: Record<string, string> = {
  PENDING: "Chờ cọc & xác nhận",
  CONFIRMED: "Đã xác nhận",
  CANCELLED: "Đã hủy",
  COMPLETED: "Hoàn thành",
}

type Booking = {
  id: string
  bookingCode?: string | null
  status: string
  checkIn?: string | Date | null
  checkOut?: string | Date | null
  guests: number
  roomQty?: number | null
  isFullVillage: boolean
  companyName?: string | null
  purpose?: string | null
  notes?: string | null
  basePrice: number
  tipWcBedding?: number | null
  servicesPrice: number
  serviceItems?: string | null  // JSON [{name, price}]
  discount: number
  totalPrice: number
  includeBreakfast: boolean
  includeLunch: boolean
  includeDinner: boolean
  includeCampfire: boolean
  kitchenTip: number
  createdAt: string | Date
  room?: { name: string } | null
}

function BookingRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500 shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right ml-4">{value}</span>
    </div>
  )
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

function DepositSection({ phone, bookingCode }: { phone?: string | null; bookingCode?: string | null }) {
  const transferNote = `${phone || bookingCode || 'COC'} Coc Lang`
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${DEPOSIT_AMOUNT}&addInfo=${encodeURIComponent(transferNote)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`

  return (
    <div className="rounded-xl overflow-hidden border-2 border-orange-200">
      <div className="px-4 py-2.5 text-center font-semibold text-sm" style={{ backgroundColor: '#fff7ed', color: '#c2410c' }}>
        💳 Chuyển cọc 500.000 đ để xác nhận booking
      </div>
      <div className="bg-white p-4">
        {/* QR */}
        <div className="flex justify-center mb-4">
          <img
            src={qrUrl}
            alt="QR chuyển khoản"
            className="w-48 h-48 rounded-xl border border-gray-100"
          />
        </div>

        {/* Bank info */}
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
          <div className="flex items-center justify-between p-2.5 rounded-lg border border-orange-100" style={{ backgroundColor: '#fff7ed' }}>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-orange-600 font-medium">Nội dung chuyển khoản</div>
              <div className="font-bold text-gray-900 text-sm truncate">{transferNote}</div>
            </div>
            <CopyButton text={transferNote} />
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg" style={{ backgroundColor: '#f9fafb' }}>
            <div>
              <div className="text-xs text-gray-400">Số tiền cọc</div>
              <div className="font-bold text-orange-600">500.000 đ</div>
            </div>
            <CopyButton text="500000" />
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mt-3">
          Sau khi chuyển cọc, Làng sẽ xác nhận trong vòng 24h.<br />
          Liên hệ Hoàng Nga: <strong className="text-gray-600">0986 655 894</strong>
        </p>
      </div>
    </div>
  )
}

function BookingCard({ booking, userPhone }: { booking: Booking; userPhone?: string | null }) {
  const [open, setOpen] = useState(false)

  const nights = booking.checkIn && booking.checkOut
    ? Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 86400000)
    : null

  const services = [
    booking.includeBreakfast && "Bữa sáng",
    booking.includeLunch && "Bữa trưa",
    booking.includeDinner && "Bữa tối",
    booking.includeCampfire && "Lửa trại",
    booking.kitchenTip > 0 && "Bếp nấu ăn",
  ].filter(Boolean).join(", ")

  return (
    <>
      <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setOpen(true)}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-medium text-gray-900">
                {booking.isFullVillage ? 'Thuê Nguyên Làng' : booking.room?.name || 'Đặt phòng'}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                {statusLabels[booking.status]}
              </span>
              {booking.bookingCode && (
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-gray-100 text-gray-600">
                  #{booking.bookingCode}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {fmtDate(booking.checkIn)} → {fmtDate(booking.checkOut)}
              {booking.guests && ` · ${booking.guests} khách`}
              {nights && ` · ${nights} đêm`}
            </div>
            {booking.companyName && <div className="text-xs text-gray-400 mt-0.5">Đoàn: {booking.companyName}</div>}
          </div>
          <div className="text-right shrink-0">
            <div className="font-bold" style={{ color: '#2d6a4f' }}>{fmt(booking.totalPrice)}</div>
            <div className="text-xs text-gray-400">{fmtDate(booking.createdAt)}</div>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white rounded-t-2xl p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-gray-900">Chi Tiết Đặt Phòng</div>
                {booking.bookingCode && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Hash className="w-3 h-3 text-gray-400" />
                    <span className="text-sm font-mono text-gray-500">{booking.bookingCode}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                  {statusLabels[booking.status]}
                </span>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-full hover:bg-gray-100 ml-1">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Main info */}
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 bg-gray-50">Thông tin</div>
                <div className="px-4 py-2">
                  <BookingRow label="Loại" value={booking.isFullVillage ? 'Thuê Nguyên Làng' : booking.room?.name || 'Đặt phòng'} />
                  <BookingRow label="Nhận phòng" value={fmtDate(booking.checkIn)} />
                  <BookingRow label="Trả phòng" value={fmtDate(booking.checkOut)} />
                  {nights && <BookingRow label="Số đêm" value={`${nights} đêm`} />}
                  <BookingRow label="Số khách" value={`${booking.guests} người`} />
                  {booking.companyName && <BookingRow label="Đoàn / Công ty" value={booking.companyName} />}
                  {booking.purpose && <BookingRow label="Mục đích" value={booking.purpose} />}
                  {booking.notes && <BookingRow label="Ghi chú" value={booking.notes} />}
                </div>
              </div>

              {/* Price breakdown */}
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 bg-gray-50">Chi phí</div>
                <div className="px-4 py-2">
                  {/* Room price */}
                  {booking.basePrice > 0 && (
                    <BookingRow
                      label={`🏠 Tiền phòng${booking.roomQty && booking.roomQty > 1 ? ` ×${booking.roomQty}` : ''}${nights ? ` × ${nights} đêm` : ''}`}
                      value={fmt(booking.basePrice)}
                    />
                  )}
                  {booking.basePrice === 0 && (
                    <BookingRow label="🏠 Tiền phòng" value={<span className="text-green-600 font-semibold">Miễn phí (VIP/CĐ)</span>} />
                  )}

                  {/* Tip WC */}
                  {(booking.tipWcBedding ?? 0) > 0 && (
                    <BookingRow label="🛁 Tip cho Dân Làng phục vụ" value={fmt(booking.tipWcBedding!)} />
                  )}

                  {/* Individual services */}
                  {(() => {
                    let items: { name: string; price: number }[] = []
                    if (booking.serviceItems) {
                      try { items = JSON.parse(booking.serviceItems) } catch {}
                    }
                    // Fallback to old boolean flags
                    if (items.length === 0) {
                      const legacyServices = [
                        booking.includeBreakfast && "Bữa sáng",
                        booking.includeLunch && "Bữa trưa",
                        booking.includeDinner && "Bữa tối",
                        booking.includeCampfire && "Lửa trại",
                        booking.kitchenTip > 0 && "Bếp nấu ăn",
                      ].filter(Boolean) as string[]
                      if (legacyServices.length > 0 && booking.servicesPrice > 0) {
                        return <BookingRow label={`🍽️ Dịch vụ (${legacyServices.join(', ')})`} value={fmt(booking.servicesPrice)} />
                      }
                      return null
                    }
                    return items.map((item: any, i: number) => (
                      <BookingRow
                        key={i}
                        label={`• ${item.name}${item.qty && item.qty > 1 ? ` ×${item.qty}` : ''}`}
                        value={item.price > 0 ? fmt(item.price) : <span className="text-green-600 text-xs font-medium">Bao gồm</span>}
                      />
                    ))
                  })()}

                  {booking.discount > 0 && (
                    <BookingRow label="Giảm giá" value={<span className="text-green-600">-{fmt(booking.discount)}</span>} />
                  )}

                  <div className="flex justify-between items-center py-2.5 pt-3 mt-1 border-t border-gray-200">
                    <span className="font-bold text-gray-900">Tổng cộng</span>
                    <span className="font-bold text-lg" style={{ color: '#2d6a4f' }}>{fmt(booking.totalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Deposit QR — only for PENDING */}
              {booking.status === "PENDING" && (
                <DepositSection phone={userPhone} bookingCode={booking.bookingCode} />
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

export default function BookingList({ bookings, userPhone }: { bookings: Booking[]; userPhone?: string | null }) {
  if (bookings.length === 0) return null
  return (
    <div className="divide-y divide-gray-50">
      {bookings.map(b => <BookingCard key={b.id} booking={b} userPhone={userPhone} />)}
    </div>
  )
}
