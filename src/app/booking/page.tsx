"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { CalendarDays, Users, Home, Coffee, CheckCircle } from "lucide-react"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

interface Room {
  id: string; name: string; type: string; capacity: number
  pricePerNight: number; tipService: number; tipWcBedding: number; totalUnits: number; description?: string
}

interface Service {
  id: string; name: string; description: string | null; icon: string | null
  price: number; priceUnit: string; category: string
}

function calcServicePrice(svc: Service, guests: number, nights: number): number {
  switch (svc.priceUnit) {
    case "person_night": return svc.price * guests * nights
    case "person": return svc.price * guests
    case "night": return svc.price * nights
    default: return svc.price // "booking"
  }
}

function priceUnitLabel(svc: Service, guests: number, nights: number): string {
  switch (svc.priceUnit) {
    case "person_night": return `${formatCurrency(svc.price)}/người/đêm`
    case "person": return `${formatCurrency(svc.price)}/người`
    case "night": return `${formatCurrency(svc.price)}/đêm`
    default: return `${formatCurrency(svc.price)}/lần`
  }
}

export default function BookingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [rooms, setRooms] = useState<Room[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [roomQty, setRoomQty] = useState(1)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(1)
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set())
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  useEffect(() => {
    fetch("/api/rooms/availability").then(r => r.json()).then(setRooms)
    fetch("/api/services").then(r => r.json()).then(setServices)
  }, [])

  useEffect(() => {
    if (checkIn && checkOut) {
      fetch(`/api/rooms/availability?checkIn=${checkIn}&checkOut=${checkOut}`)
        .then(r => r.json()).then(setRooms)
    }
  }, [checkIn, checkOut])

  const nights = checkIn && checkOut
    ? Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 0

  const basePrice = selectedRoom ? selectedRoom.pricePerNight * nights * roomQty : 0
  const tipWcBedding = selectedRoom ? selectedRoom.tipWcBedding * roomQty : 0

  const servicesPrice = services
    .filter(s => selectedServices.has(s.id))
    .reduce((sum, s) => sum + calcServicePrice(s, guests, nights), 0)

  const totalPrice = basePrice + tipWcBedding + servicesPrice

  const toggleService = (id: string) => {
    const next = new Set(selectedServices)
    if (next.has(id)) next.delete(id); else next.add(id)
    setSelectedServices(next)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRoom || !checkIn || !checkOut) { setError("Vui lòng chọn phòng và ngày"); return }
    setLoading(true); setError("")

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId: selectedRoom.id,
        checkIn, checkOut, guests,
        roomQty,
        selectedServiceIds: Array.from(selectedServices),
        basePrice, tipWcBedding, servicesPrice,
        notes,
        isFullVillage: false,
      })
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
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: '#d1fae5' }}>
            <CheckCircle className="w-10 h-10" style={{ color: '#2d6a4f' }} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Đặt Phòng Thành Công!</h2>
          <p className="text-gray-600 mb-6">Cảm ơn bạn đã đặt phòng tại Làng Cao Phong. Chúng tôi sẽ liên hệ xác nhận sớm nhất.</p>
          <button onClick={() => router.push("/dashboard")} className="px-8 py-3 rounded-xl text-white font-medium" style={{ backgroundColor: '#2d6a4f' }}>
            Xem Đặt Phòng Của Tôi
          </button>
        </div>
      </div>
    )
  }

  const foodServices = services.filter(s => s.category === "food")
  const activityServices = services.filter(s => s.category === "activity")
  const facilityServices = services.filter(s => s.category === "facility")

  return (
    <div className="min-h-screen py-10" style={{ backgroundColor: '#f0fdf4' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Đặt Phòng</h1>
          <p className="text-gray-600 mt-1">Chọn phòng và dịch vụ cho kỳ nghỉ của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Dates */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarDays className="w-5 h-5" style={{ color: '#2d6a4f' }} /> Ngày Nhận & Trả Phòng
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày nhận phòng</label>
                  <input type="date" value={checkIn} min={new Date().toISOString().split('T')[0]} onChange={e => setCheckIn(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày trả phòng</label>
                  <input type="date" value={checkOut} min={checkIn || new Date().toISOString().split('T')[0]} onChange={e => setCheckOut(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-gray-900" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Users className="w-4 h-4 inline mr-1" />Số khách
                </label>
                <select value={guests} onChange={e => setGuests(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-gray-900">
                  {[1,2,3,4,5,6,8,10,12].map(n => <option key={n} value={n}>{n} khách</option>)}
                </select>
              </div>
            </div>

            {/* Rooms */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Home className="w-5 h-5" style={{ color: '#2d6a4f' }} /> Chọn Phòng
              </h2>
              {rooms.length === 0 ? (
                <p className="text-gray-500 text-center py-6">Không có phòng trống trong thời gian này</p>
              ) : (
                <div className="space-y-3">
                  {rooms.map(room => {
                    const isSelected = selectedRoom?.id === room.id
                    return (
                      <div
                        key={room.id}
                        className={`p-4 rounded-xl border-2 transition-all ${isSelected ? 'border-green-600 bg-green-50' : 'border-gray-200'}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 cursor-pointer" onClick={() => { setSelectedRoom(room); setRoomQty(1) }}>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{room.name}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${room.type === 'VILLA' ? 'bg-purple-100 text-purple-700' : room.type === 'GLAMPING' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{room.type}</span>
                            </div>
                            <p className="text-sm text-gray-500">Sức chứa: {room.capacity} người/phòng · {room.totalUnits} {room.type === 'GLAMPING' ? 'lều' : 'phòng'} có sẵn</p>
                            {room.description && <p className="text-xs text-gray-400 mt-0.5">{room.description}</p>}
                            <div className="font-bold mt-1" style={{ color: '#2d6a4f' }}>{formatCurrency(room.pricePerNight)}<span className="text-gray-400 font-normal text-xs">/đêm/phòng</span></div>
                            {room.tipWcBedding > 0 && (
                              <div className="text-xs text-gray-500 mt-0.5">🛁 Tip WC + ga gối: {formatCurrency(room.tipWcBedding)}/phòng (mặc định)</div>
                            )}
                          </div>

                          {/* Qty selector */}
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-xs text-gray-500">Số lượng</span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => { setSelectedRoom(room); setRoomQty(q => Math.max(1, q - 1)) }}
                                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold"
                              >−</button>
                              <span className="w-8 text-center font-bold text-gray-900">{isSelected ? roomQty : 0}</span>
                              <button
                                type="button"
                                onClick={() => { setSelectedRoom(room); setRoomQty(q => Math.min(room.totalUnits, isSelected ? q + 1 : 1)) }}
                                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold"
                                disabled={isSelected && roomQty >= room.totalUnits}
                              >+</button>
                            </div>
                            <span className="text-xs text-gray-400">tối đa {room.totalUnits}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Services */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Coffee className="w-5 h-5" style={{ color: '#2d6a4f' }} /> Dịch Vụ Thêm
              </h2>

              {services.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">Chưa có dịch vụ bổ sung</p>
              ) : (
                <div className="space-y-4">
                  {[
                    { label: "🍽️ Ăn uống", items: foodServices },
                    { label: "🎯 Hoạt động", items: activityServices },
                    { label: "🏡 Tiện nghi", items: facilityServices },
                  ].filter(g => g.items.length > 0).map(group => (
                    <div key={group.label}>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">{group.label}</div>
                      <div className="space-y-2">
                        {group.items.map(svc => (
                          <label key={svc.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedServices.has(svc.id)}
                              onChange={() => toggleService(svc.id)}
                              className="w-4 h-4 accent-green-700"
                            />
                            {svc.icon && <span className="text-lg">{svc.icon}</span>}
                            <div className="flex-1">
                              <div className="font-medium text-gray-800 text-sm">{svc.name}</div>
                              {svc.description && <div className="text-xs text-gray-500">{svc.description}</div>}
                            </div>
                            <div className="text-sm font-semibold text-right" style={{ color: '#2d6a4f' }}>
                              {priceUnitLabel(svc, guests, nights)}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ghi chú</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Yêu cầu đặc biệt, thời gian đến dự kiến..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-gray-900 resize-none text-sm" />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Tóm Tắt Đặt Phòng</h3>
              {selectedRoom ? (
                <div className="space-y-2 text-sm">
                  <div className="font-medium text-gray-900">{selectedRoom.name} × {roomQty}</div>
                  {nights > 0 && (
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-gray-800">{roomQty} phòng × {nights} đêm × {formatCurrency(selectedRoom.pricePerNight)}</span>
                      <span className="font-bold text-gray-900">{formatCurrency(basePrice)}</span>
                    </div>
                  )}
                  {tipWcBedding > 0 && (
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-gray-400">🛁 Tip WC + ga gối ({roomQty} phòng)</span>
                      <span className="text-xs text-gray-400">{formatCurrency(tipWcBedding)}</span>
                    </div>
                  )}
                  {services.filter(s => selectedServices.has(s.id)).map(svc => (
                    <div key={svc.id} className="flex justify-between text-gray-600">
                      <span>{svc.icon} {svc.name}</span>
                      <span>{formatCurrency(calcServicePrice(svc, guests, nights))}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 pt-2 flex justify-between">
                    <span className="font-bold text-gray-900">Tổng cộng</span>
                    <span className="font-bold text-lg" style={{ color: '#2d6a4f' }}>{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center py-4">Chọn phòng để xem giá</p>
              )}

              {error && <div className="mt-3 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

              <button
                type="submit"
                disabled={loading || !selectedRoom || nights === 0}
                className="w-full mt-4 py-3.5 rounded-xl text-white font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: '#2d6a4f' }}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang xử lý...
                  </div>
                ) : "Xác Nhận Đặt Phòng"}
              </button>
              <p className="text-xs text-gray-400 text-center mt-3">Chúng tôi sẽ liên hệ xác nhận trong vòng 2 giờ</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
