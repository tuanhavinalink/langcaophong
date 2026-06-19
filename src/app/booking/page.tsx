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
  pricePerNight: number; memberPrice: number | null; tipService: number; tipWcBedding: number; totalUnits: number; description?: string
}

interface Service {
  id: string; name: string; description: string | null; icon: string | null
  price: number; priceUnit: string; category: string
}

function calcServicePrice(svc: Service, guests: number, nights: number, roomQty: number): number {
  switch (svc.priceUnit) {
    case "person_night": return svc.price * guests * nights
    case "person": return svc.price * guests
    case "night": return svc.price * nights
    case "night_unit": return svc.price * nights * roomQty
    default: return svc.price // "booking"
  }
}

function priceUnitLabel(svc: Service): string {
  switch (svc.priceUnit) {
    case "person_night": return `${formatCurrency(svc.price)}/người/đêm`
    case "person": return `${formatCurrency(svc.price)}/người`
    case "night": return `${formatCurrency(svc.price)}/đêm`
    case "night_unit": return `${formatCurrency(svc.price)}/đêm/phòng`
    default: return `${formatCurrency(svc.price)}/lần`
  }
}

const FREE_ROOM_ROLES = ["VIP", "SHAREHOLDER_MAIN", "SHAREHOLDER_FOLLOW"]

function getRoomPrice(room: Room, userRole: string | null): number {
  if (userRole && FREE_ROOM_ROLES.includes(userRole)) return 0
  if (userRole === "MEMBER" && room.memberPrice != null) return room.memberPrice
  return room.pricePerNight
}

function isFreeRole(userRole: string | null): boolean {
  return !!userRole && FREE_ROOM_ROLES.includes(userRole)
}

export default function BookingPage() {
  const { data: session, status } = useSession()
  const userRole = (session?.user as any)?.role ?? null
  const router = useRouter()
  const [rooms, setRooms] = useState<Room[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [roomQty, setRoomQty] = useState(1)
  const [blockedInfo, setBlockedInfo] = useState<{ reason: string } | null>(null)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(1)
  const [children, setChildren] = useState(0)
  const [selectedServices, setSelectedServices] = useState<Map<string, number>>(new Map())
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
      setBlockedInfo(null)
      fetch(`/api/rooms/availability?checkIn=${checkIn}&checkOut=${checkOut}`)
        .then(r => r.json())
        .then(data => {
          if (data.blocked) {
            setBlockedInfo({ reason: data.reason })
            setRooms([])
            setSelectedRoom(null)
          } else {
            setRooms(data)
          }
        })
    }
  }, [checkIn, checkOut])

  const nights = checkIn && checkOut
    ? Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 0

  const effectivePrice = selectedRoom ? getRoomPrice(selectedRoom, userRole) : 0
  const isFreeRoom = selectedRoom ? isFreeRole(userRole) : false
  const basePrice = selectedRoom ? effectivePrice * nights * roomQty : 0
  const tipWcBedding = selectedRoom ? selectedRoom.tipWcBedding * roomQty : 0

  const hasQty = (priceUnit: string) => priceUnit === "booking" || priceUnit === "person"

  // Food services: children 6-12 = 70% of adult price; other services: adults only
  function effectiveGuests(svc: Service): number {
    if (svc.category === "food") return guests + children * 0.7
    return guests
  }

  const servicesPrice = services
    .filter(s => selectedServices.has(s.id))
    .reduce((sum, s) => {
      const qty = hasQty(s.priceUnit) ? (selectedServices.get(s.id) || 1) : 1
      return sum + calcServicePrice(s, effectiveGuests(s), nights, roomQty) * qty
    }, 0)

  const totalPrice = basePrice + tipWcBedding + servicesPrice

  const toggleService = (id: string) => {
    const next = new Map(selectedServices)
    if (next.has(id)) next.delete(id); else next.set(id, 1)
    setSelectedServices(next)
  }

  const setServiceQty = (id: string, qty: number) => {
    const next = new Map(selectedServices)
    if (qty <= 0) next.delete(id); else next.set(id, qty)
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
        childrenCount: children,
        roomQty,
        selectedServices: Array.from(selectedServices.entries()).map(([id, qty]) => {
          const svc = services.find(s => s.id === id)
          const itemPrice = svc ? calcServicePrice(svc, effectiveGuests(svc), nights, roomQty) * (hasQty(svc.priceUnit) ? qty : 1) : 0
          return { id, qty, price: itemPrice }
        }),
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
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <Users className="w-4 h-4 inline mr-1" />Khách người lớn
                  </label>
                  <select value={guests} onChange={e => setGuests(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-gray-900">
                    {Array.from({length: 30}, (_, i) => i + 1).map(n => <option key={n} value={n}>{n} khách</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <Users className="w-4 h-4 inline mr-1" />Trẻ em 6–12 tuổi
                    <span className="ml-1 text-xs font-normal text-gray-400">(0–5 tuổi miễn phí)</span>
                  </label>
                  <select value={children} onChange={e => setChildren(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-gray-900">
                    {Array.from({length: 16}, (_, i) => i).map(n => <option key={n} value={n}>{n === 0 ? 'Không có' : `${n} trẻ em`}</option>)}
                  </select>
                  {children > 0 && (
                    <p className="text-xs text-orange-600 mt-1">🍽️ Dịch vụ ăn uống trẻ em = 70% giá người lớn</p>
                  )}
                </div>
              </div>
            </div>

            {/* Rooms */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Home className="w-5 h-5" style={{ color: '#2d6a4f' }} /> Chọn Phòng
              </h2>
              {blockedInfo ? (
                <div className="rounded-xl p-5 text-center" style={{ backgroundColor: '#fef9c3', border: '1.5px solid #fde047' }}>
                  <div className="text-2xl mb-2">🔒</div>
                  <p className="font-semibold text-gray-800">Ngày này đã bị khóa</p>
                  <p className="text-sm text-gray-600 mt-1">{blockedInfo.reason}</p>
                </div>
              ) : rooms.length === 0 && checkIn && checkOut ? (
                <p className="text-gray-500 text-center py-6">Không còn phòng trống trong thời gian này</p>
              ) : rooms.length === 0 ? (
                <p className="text-gray-400 text-center py-6">Chọn ngày để xem phòng trống</p>
              ) : (
                <div className="space-y-3">
                  {rooms.map((room: any) => {
                    const isSelected = selectedRoom?.id === room.id
                    const avail: number = room.availableUnits ?? room.totalUnits
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
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{avail}/{room.totalUnits} bung trống</span>
                            </div>
                            <p className="text-sm text-gray-500">Sức chứa: {room.capacity} người/phòng</p>
                            {room.description && <p className="text-xs text-gray-400 mt-0.5">{room.description}</p>}
                            {(() => {
                              const rp = getRoomPrice(room, userRole)
                              const isVipFree = isFreeRole(userRole)
                              return (
                                <div className="mt-1">
                                  {isVipFree ? (
                                    <div className="flex items-baseline gap-2">
                                      <span className="font-bold text-lg" style={{ color: '#16a34a' }}>Miễn phí</span>
                                      <span className="line-through text-gray-400 text-xs">{formatCurrency(room.pricePerNight)}</span>
                                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">VIP/CĐ</span>
                                    </div>
                                  ) : (
                                    <div>
                                      <span className="font-bold" style={{ color: '#2d6a4f' }}>{formatCurrency(rp)}</span>
                                      <span className="text-gray-400 font-normal text-xs">/đêm/phòng</span>
                                      {userRole === "MEMBER" && room.memberPrice != null && room.memberPrice !== room.pricePerNight && (
                                        <span className="ml-2 line-through text-gray-400 text-xs">{formatCurrency(room.pricePerNight)}</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )
                            })()}
                            {room.tipWcBedding > 0 && (
                              <div className="text-xs text-gray-500 mt-0.5">🛁 Tip cho Dân Làng phục vụ: {formatCurrency(room.tipWcBedding)}/bungalow (bắt buộc)</div>
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
                                onClick={() => { setSelectedRoom(room); setRoomQty(q => Math.min(avail, isSelected ? q + 1 : 1)) }}
                                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold"
                                disabled={isSelected && roomQty >= avail}
                              >+</button>
                            </div>
                            <span className="text-xs text-gray-400">còn {avail} bung</span>
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
                        {group.items.map(svc => {
                          const checked = selectedServices.has(svc.id)
                          const qty = selectedServices.get(svc.id) || 1
                          return (
                            <div key={svc.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${checked ? 'border-green-200 bg-green-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleService(svc.id)}
                                className="w-4 h-4 accent-green-700 shrink-0 cursor-pointer"
                              />
                              {svc.icon && <span className="text-lg shrink-0">{svc.icon}</span>}
                              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleService(svc.id)}>
                                <div className="font-medium text-gray-800 text-sm">{svc.name}</div>
                                {svc.description && <div className="text-xs text-gray-500">{svc.description}</div>}
                              </div>
                              {/* Qty stepper — chỉ cho loại booking/person */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                {checked && hasQty(svc.priceUnit) && (
                                  <>
                                    <button type="button" onClick={() => setServiceQty(svc.id, qty - 1)} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 font-bold text-base leading-none">−</button>
                                    <span className="w-6 text-center font-semibold text-gray-900 text-sm">{qty}</span>
                                    <button type="button" onClick={() => setServiceQty(svc.id, qty + 1)} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 font-bold text-base leading-none">+</button>
                                  </>
                                )}
                              </div>
                              <div className="text-sm font-semibold text-right shrink-0" style={{ color: '#2d6a4f' }}>
                                {priceUnitLabel(svc)}
                              </div>
                            </div>
                          )
                        })}
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
                  <div className="text-xs text-gray-500">{guests} người lớn{children > 0 ? ` · ${children} trẻ em (6–12t)` : ''}</div>
                  {nights > 0 && (
                    <div className="flex justify-between items-baseline">
                      {isFreeRoom ? (
                        <>
                          <span className="text-sm text-gray-600">{roomQty} phòng × {nights} đêm</span>
                          <span className="font-bold text-green-600">Miễn phí</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm text-gray-600">{roomQty} phòng × {nights} đêm × {formatCurrency(effectivePrice)}</span>
                          <span className="font-bold text-gray-900">{formatCurrency(basePrice)}</span>
                        </>
                      )}
                    </div>
                  )}
                  {tipWcBedding > 0 && (
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-gray-500">🛁 Tip cho Dân Làng phục vụ ({roomQty} bungalow)</span>
                      <span className="text-xs font-semibold text-gray-700">{formatCurrency(tipWcBedding)}</span>
                    </div>
                  )}
                  {services.filter(s => selectedServices.has(s.id)).map(svc => {
                    const qty = hasQty(svc.priceUnit) ? (selectedServices.get(svc.id) || 1) : 1
                    const lineTotal = calcServicePrice(svc, effectiveGuests(svc), nights, roomQty) * qty
                    return (
                      <div key={svc.id} className="flex justify-between text-gray-600">
                        <span>{svc.icon} {svc.name}{qty > 1 ? ` ×${qty}` : ''}</span>
                        <span>{formatCurrency(lineTotal)}</span>
                      </div>
                    )
                  })}
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
