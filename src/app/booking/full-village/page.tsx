"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Building2, CalendarDays, Users, CheckCircle, Star, Plus, Minus } from "lucide-react"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

interface Service {
  id: string; name: string; description: string | null; icon: string | null
  price: number; priceUnit: string; category: string
}

const FULL_VILLAGE_PRICE_PER_NIGHT = 5000000
const ROOM_QTY = 15

function calcServicePrice(svc: Service, guests: number, nights: number): number {
  switch (svc.priceUnit) {
    case "person_night": return svc.price * guests * nights
    case "person":       return svc.price * guests
    case "night":        return svc.price * nights
    case "night_unit":   return svc.price * nights * ROOM_QTY
    default:             return svc.price // "booking"
  }
}

function hasQty(priceUnit: string) {
  return priceUnit === "booking" || priceUnit === "person"
}

function priceLabel(svc: Service) {
  switch (svc.priceUnit) {
    case "person_night": return `${formatCurrency(svc.price)}/người/đêm`
    case "person":       return `${formatCurrency(svc.price)}/người`
    case "night":        return `${formatCurrency(svc.price)}/đêm`
    case "night_unit":   return `${formatCurrency(svc.price)}/đêm/phòng`
    default:             return formatCurrency(svc.price)
  }
}

export default function FullVillageBookingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [selectedServices, setSelectedServices] = useState<Map<string, number>>(new Map())
  const [form, setForm] = useState({
    companyName: "",
    purpose: "TRAINING",
    checkIn: "",
    checkOut: "",
    guests: 30,
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const role = (session?.user as any)?.role
  const isVIP = role === "VIP" || role === "ADMIN" || role === "SHAREHOLDER"

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  useEffect(() => {
    fetch("/api/services").then(r => r.json()).then(setServices)
  }, [])

  const nights = form.checkIn && form.checkOut
    ? Math.max(0, Math.round((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000))
    : 0

  const basePrice = FULL_VILLAGE_PRICE_PER_NIGHT * nights
  const discount = isVIP ? basePrice * 0.3 : 0

  const servicesPrice = services
    .filter(s => selectedServices.has(s.id))
    .reduce((sum, s) => {
      const qty = hasQty(s.priceUnit) ? (selectedServices.get(s.id) || 1) : 1
      return sum + calcServicePrice(s, form.guests, nights) * qty
    }, 0)

  const totalPrice = basePrice - discount + servicesPrice

  const toggleService = (id: string) => {
    const next = new Map(selectedServices)
    if (next.has(id)) next.delete(id)
    else next.set(id, 1)
    setSelectedServices(next)
  }

  const setQty = (id: string, qty: number) => {
    if (qty < 1) { const n = new Map(selectedServices); n.delete(id); setSelectedServices(n); return }
    setSelectedServices(new Map(selectedServices).set(id, qty))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.checkIn || !form.checkOut || !form.companyName) {
      setError("Vui lòng điền đầy đủ thông tin"); return
    }
    setLoading(true); setError("")
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, isFullVillage: true, basePrice, servicesPrice, type: "FULL_VILLAGE" })
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) setSuccess(true)
    else setError(data.error || "Đặt phòng thất bại")
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#f0fdf4' }}>
        <div className="text-center max-w-md">
          <CheckCircle className="w-20 h-20 mx-auto mb-6" style={{ color: '#2d6a4f' }} />
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Yêu Cầu Đã Gửi!</h2>
          <p className="text-gray-600 mb-6">Chúng tôi sẽ liên hệ trong 24 giờ để xác nhận lịch thuê nguyên làng.</p>
          <button onClick={() => router.push("/dashboard")} className="px-8 py-3 rounded-xl text-white font-medium" style={{ backgroundColor: '#2d6a4f' }}>
            Xem Đặt Phòng
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-10" style={{ backgroundColor: '#f0fdf4' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-8 h-8" style={{ color: '#2d6a4f' }} />
            <h1 className="text-3xl font-bold text-gray-900">Thuê Nguyên Làng</h1>
          </div>
          <p className="text-gray-600">Dành cho doanh nghiệp, team building và sự kiện nhóm — trọn 15 Bungalow</p>
          {isVIP && (
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              <Star className="w-4 h-4" /> VIP: Giảm 30% giá phòng!
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            {/* Company Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" style={{ color: '#2d6a4f' }} /> Thông Tin Đoàn
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên công ty / Tổ chức</label>
                  <input type="text" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} required placeholder="Công ty TNHH ABC" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mục đích</label>
                  <select value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-gray-900">
                    <option value="TRAINING">Đào tạo nội bộ</option>
                    <option value="TEAM_BUILDING">Team Building</option>
                    <option value="RETREAT">Retreat / Nghỉ dưỡng</option>
                    <option value="CONFERENCE">Hội nghị</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dates & Guests */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarDays className="w-5 h-5" style={{ color: '#2d6a4f' }} /> Ngày & Số Người
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày đến</label>
                  <input type="date" value={form.checkIn} min={new Date().toISOString().split('T')[0]} onChange={e => setForm({ ...form, checkIn: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày về</label>
                  <input type="date" value={form.checkOut} min={form.checkIn} onChange={e => setForm({ ...form, checkOut: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-gray-900" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Users className="w-4 h-4 inline mr-1" /> Số người tham gia
                </label>
                <input type="number" value={form.guests} min={10} max={80} onChange={e => setForm({ ...form, guests: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-gray-900" />
                <p className="text-xs text-gray-500 mt-1">Tối thiểu 10 người, tối đa 80 người</p>
              </div>
            </div>

            {/* Services from DB */}
            {services.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Dịch Vụ Thêm</h2>
                <div className="space-y-2">
                  {services.map(svc => {
                    const selected = selectedServices.has(svc.id)
                    const qty = selectedServices.get(svc.id) || 1
                    const showQty = hasQty(svc.priceUnit)
                    return (
                      <div key={svc.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${selected ? 'border-green-300 bg-green-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                        <input type="checkbox" checked={selected} onChange={() => toggleService(svc.id)} className="w-4 h-4 accent-green-700 shrink-0" />
                        <span className="text-lg shrink-0 w-6 text-center">{svc.icon || '🔹'}</span>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-sm text-gray-800">{svc.name}</span>
                          {svc.description && <p className="text-xs text-gray-500 truncate">{svc.description}</p>}
                        </div>
                        <span className="text-xs text-gray-500 shrink-0">{priceLabel(svc)}</span>
                        {selected && showQty && (
                          <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                            <button type="button" onClick={() => setQty(svc.id, qty - 1)} className="w-6 h-6 rounded-full flex items-center justify-center border border-gray-200 hover:bg-gray-100"><Minus className="w-3 h-3" /></button>
                            <span className="w-6 text-center text-sm font-medium">{qty}</span>
                            <button type="button" onClick={() => setQty(svc.id, qty + 1)} className="w-6 h-6 rounded-full flex items-center justify-center border border-gray-200 hover:bg-gray-100"><Plus className="w-3 h-3" /></button>
                          </div>
                        )}
                        {selected && !showQty && nights > 0 && (
                          <span className="text-xs font-medium shrink-0" style={{ color: '#2d6a4f' }}>
                            = {formatCurrency(calcServicePrice(svc, form.guests, nights))}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ghi chú & Yêu cầu đặc biệt</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Chủ đề team building, yêu cầu âm thanh ánh sáng, chế độ ăn đặc biệt..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-sm text-gray-900 resize-none" />
            </div>

            {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}

            <button type="submit" disabled={loading} className="w-full py-4 rounded-xl text-white font-semibold text-lg transition-all hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: '#2d6a4f' }}>
              {loading ? "Đang xử lý..." : "Gửi Yêu Cầu Thuê Làng"}
            </button>
          </form>

          {/* Summary */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Chi Phí Dự Kiến</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded-xl" style={{ backgroundColor: '#f0fdf4' }}>
                  <div className="font-medium text-gray-700 mb-1">Gói nguyên làng</div>
                  <div className="text-xs text-gray-500 mb-2">15 Bungalow · Toàn bộ khu Làng Cao Phong</div>
                  <div className="font-bold text-lg" style={{ color: '#2d6a4f' }}>
                    {formatCurrency(FULL_VILLAGE_PRICE_PER_NIGHT)}/đêm
                  </div>
                </div>

                {nights > 0 ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{nights} đêm × {formatCurrency(FULL_VILLAGE_PRICE_PER_NIGHT)}</span>
                      <span>{formatCurrency(basePrice)}</span>
                    </div>
                    {isVIP && discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm giá VIP (30%)</span>
                        <span>-{formatCurrency(discount)}</span>
                      </div>
                    )}
                    {services.filter(s => selectedServices.has(s.id)).map(s => {
                      const qty = hasQty(s.priceUnit) ? (selectedServices.get(s.id) || 1) : 1
                      const total = calcServicePrice(s, form.guests, nights) * qty
                      return (
                        <div key={s.id} className="flex justify-between text-gray-600">
                          <span className="truncate mr-2">{s.icon} {s.name}{qty > 1 ? ` ×${qty}` : ''}</span>
                          <span className="shrink-0">{formatCurrency(total)}</span>
                        </div>
                      )
                    })}
                    <div className="border-t border-gray-100 pt-3 flex justify-between">
                      <span className="font-bold text-gray-900">Tổng cộng</span>
                      <span className="font-bold text-lg" style={{ color: '#2d6a4f' }}>{formatCurrency(totalPrice)}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-gray-400 text-center py-2">Chọn ngày để xem tổng chi phí</p>
                )}
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-xl text-xs text-blue-700">
                Giá chưa bao gồm VAT. Sẽ được xác nhận chính xác sau khi trao đổi.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
