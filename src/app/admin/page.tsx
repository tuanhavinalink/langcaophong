"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Users, Calendar, Search, Edit2, Check, X, TrendingUp, Home, Plus, Trash2, Coffee } from "lucide-react"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(dateString))
}

interface UserData {
  id: string; name: string | null; email: string; phone: string | null
  role: string; totalSpent: number; sharePercent: number; shareAmount: number
  affiliateCode: string | null; affiliateBalance: number
  freeCoursesLeft: number; courseDiscount: number; createdAt: string
}

interface BookingData {
  id: string; status: string; type: string; checkIn: string | null; checkOut: string | null
  totalPrice: number; isFullVillage: boolean; companyName: string | null
  user: { name: string | null; email: string; phone: string | null }
  room: { name: string } | null; createdAt: string
}

interface RoomData {
  id: string; name: string; type: string; capacity: number
  pricePerNight: number; tipService: number; tipWcBedding: number; description: string | null
  amenities: string | null; isAvailable: boolean
}

interface ServiceData {
  id: string; name: string; description: string | null; icon: string | null
  price: number; priceUnit: string; category: string; isActive: boolean; sortOrder: number
}

const PRICE_UNIT_LABELS: Record<string, string> = {
  booking: "đ/lần đặt",
  person_night: "đ/người/đêm",
  person: "đ/người",
  night: "đ/đêm",
}

const emptyRoom: Partial<RoomData> = { name: "", type: "BUNGALOW", capacity: 2, pricePerNight: 0, tipService: 50000, tipWcBedding: 0, description: "", isAvailable: true }
const emptyService: Partial<ServiceData> = { name: "", description: "", icon: "", price: 0, priceUnit: "booking", category: "food", isActive: true, sortOrder: 0 }

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tab, setTab] = useState<"users" | "bookings" | "rooms" | "services">("users")
  const [users, setUsers] = useState<UserData[]>([])
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [rooms, setRooms] = useState<RoomData[]>([])
  const [services, setServices] = useState<ServiceData[]>([])
  const [search, setSearch] = useState("")
  const [editingUser, setEditingUser] = useState<UserData | null>(null)
  const [editValues, setEditValues] = useState<Partial<UserData>>({})
  const [editingRoom, setEditingRoom] = useState<Partial<RoomData> | null>(null)
  const [isNewRoom, setIsNewRoom] = useState(false)
  const [editingService, setEditingService] = useState<Partial<ServiceData> | null>(null)
  const [isNewService, setIsNewService] = useState(false)
  const [loading, setLoading] = useState(false)

  const role = (session?.user as any)?.role

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
    if (status === "authenticated" && role !== "ADMIN") router.push("/dashboard")
  }, [status, role, router])

  useEffect(() => {
    fetch("/api/admin/users").then(r => r.json()).then(setUsers)
    fetch("/api/bookings").then(r => r.json()).then(setBookings)
    fetch("/api/admin/rooms").then(r => r.json()).then(setRooms)
    fetch("/api/admin/services").then(r => r.json()).then(setServices)
  }, [])

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  )
  const filteredBookings = bookings.filter(b =>
    b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.user?.email.toLowerCase().includes(search.toLowerCase()) ||
    b.user?.phone?.includes(search)
  )

  const saveUser = async () => {
    if (!editingUser) return
    setLoading(true)
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: editingUser.id, ...editValues })
    })
    if (res.ok) { setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...editValues } : u)); setEditingUser(null) }
    setLoading(false)
  }

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    await fetch("/api/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bookingId, status: newStatus }) })
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b))
  }

  const saveRoom = async () => {
    if (!editingRoom) return
    setLoading(true)
    if (isNewRoom) {
      const res = await fetch("/api/admin/rooms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingRoom) })
      if (res.ok) { const room = await res.json(); setRooms([...rooms, room]) }
    } else {
      const res = await fetch(`/api/admin/rooms/${(editingRoom as RoomData).id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingRoom) })
      if (res.ok) { const room = await res.json(); setRooms(rooms.map(r => r.id === room.id ? room : r)) }
    }
    setEditingRoom(null); setLoading(false)
  }

  const deleteRoom = async (id: string) => {
    if (!confirm("Xóa phòng này?")) return
    await fetch(`/api/admin/rooms/${id}`, { method: "DELETE" })
    setRooms(rooms.filter(r => r.id !== id))
  }

  const saveService = async () => {
    if (!editingService) return
    setLoading(true)
    if (isNewService) {
      const res = await fetch("/api/admin/services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingService) })
      if (res.ok) { const svc = await res.json(); setServices([...services, svc]) }
    } else {
      const res = await fetch(`/api/admin/services/${(editingService as ServiceData).id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingService) })
      if (res.ok) { const svc = await res.json(); setServices(services.map(s => s.id === svc.id ? svc : s)) }
    }
    setEditingService(null); setLoading(false)
  }

  const deleteService = async (id: string) => {
    if (!confirm("Xóa dịch vụ này?")) return
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" })
    setServices(services.filter(s => s.id !== id))
  }

  const totalRevenue = bookings.filter(b => b.status !== "CANCELLED").reduce((s, b) => s + b.totalPrice, 0)
  const pendingCount = bookings.filter(b => b.status === "PENDING").length

  const roleColors: Record<string, string> = { MEMBER: "bg-gray-100 text-gray-700", VIP: "bg-yellow-100 text-yellow-700", SHAREHOLDER: "bg-purple-100 text-purple-700", ADMIN: "bg-red-100 text-red-700" }
  const statusColors: Record<string, string> = { PENDING: "bg-yellow-100 text-yellow-700", CONFIRMED: "bg-green-100 text-green-700", CANCELLED: "bg-red-100 text-red-700", COMPLETED: "bg-blue-100 text-blue-700" }
  const statusLabels: Record<string, string> = { PENDING: "Chờ xác nhận", CONFIRMED: "Đã xác nhận", CANCELLED: "Đã hủy", COMPLETED: "Hoàn thành" }

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none"

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#f0fdf4' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quản Trị Hệ Thống</h1>
          <p className="text-gray-600 mt-1">Làng Cao Phong Admin Panel</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Tổng người dùng", value: users.length, icon: Users, color: '#2d6a4f' },
            { label: "Tổng đặt phòng", value: bookings.length, icon: Calendar, color: '#1d4ed8' },
            { label: "Chờ xác nhận", value: pendingCount, icon: Calendar, color: '#d97706' },
            { label: "Doanh thu", value: formatCurrency(totalRevenue), icon: TrendingUp, color: '#dc2626', small: true },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
              </div>
              <div className={`font-bold text-gray-900 ${(stat as any).small ? 'text-lg' : 'text-2xl'}`}>{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {([
            { key: "users", label: `Người Dùng (${users.length})`, icon: Users },
            { key: "bookings", label: `Đặt Phòng (${bookings.length})`, icon: Calendar },
            { key: "rooms", label: `Phòng (${rooms.length})`, icon: Home },
            { key: "services", label: `Dịch Vụ (${services.length})`, icon: Coffee },
          ] as const).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t.key ? 'text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              style={tab === t.key ? { backgroundColor: '#2d6a4f' } : {}}
            >
              <t.icon className="w-4 h-4 inline mr-1.5" />{t.label}
            </button>
          ))}
        </div>

        {/* Search (users/bookings only) */}
        {(tab === "users" || tab === "bookings") && (
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none"
            />
          </div>
        )}

        {/* Users Tab */}
        {tab === "users" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#f0fdf4' }}>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Người dùng</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">SĐT</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Vai trò</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Chi tiêu</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Cổ phần</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Ngày tham gia</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3"><div className="font-medium text-gray-900 text-sm">{user.name || '—'}</div><div className="text-xs text-gray-500">{user.email}</div></td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.phone || '—'}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[user.role]}`}>{user.role}</span></td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(user.totalSpent)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.sharePercent > 0 ? `${user.sharePercent}%` : '—'}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{formatDate(user.createdAt)}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => { setEditingUser(user); setEditValues({ role: user.role, sharePercent: user.sharePercent, shareAmount: user.shareAmount, freeCoursesLeft: user.freeCoursesLeft, courseDiscount: user.courseDiscount }) }} className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-700 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {tab === "bookings" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#f0fdf4' }}>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Khách hàng</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Phòng / Loại</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Ngày</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Trạng thái</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Tổng tiền</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredBookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3"><div className="font-medium text-gray-900 text-sm">{booking.user?.name || '—'}</div><div className="text-xs text-gray-500">{booking.user?.phone || booking.user?.email}</div></td>
                      <td className="px-4 py-3 text-sm text-gray-700">{booking.isFullVillage ? `Nguyên Làng - ${booking.companyName || ''}` : booking.room?.name || '—'}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{booking.checkIn ? formatDate(booking.checkIn) : '—'}{booking.checkOut ? ` → ${formatDate(booking.checkOut)}` : ''}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>{statusLabels[booking.status]}</span></td>
                      <td className="px-4 py-3 text-sm font-bold" style={{ color: '#2d6a4f' }}>{formatCurrency(booking.totalPrice)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {booking.status === "PENDING" && (
                            <>
                              <button onClick={() => updateBookingStatus(booking.id, "CONFIRMED")} className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100" title="Xác nhận"><Check className="w-3.5 h-3.5" /></button>
                              <button onClick={() => updateBookingStatus(booking.id, "CANCELLED")} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100" title="Hủy"><X className="w-3.5 h-3.5" /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Rooms Tab */}
        {tab === "rooms" && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => { setIsNewRoom(true); setEditingRoom({ ...emptyRoom }) }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium text-sm" style={{ backgroundColor: '#2d6a4f' }}>
                <Plus className="w-4 h-4" /> Thêm Phòng
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map(room => (
                <div key={room.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{room.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${room.type === 'VILLA' ? 'bg-purple-100 text-purple-700' : room.type === 'GLAMPING' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{room.type}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${room.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{room.isAvailable ? 'Có sẵn' : 'Đã đặt'}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Sức chứa: {room.capacity} người</p>
                  {room.description && <p className="text-xs text-gray-400 mb-2">{room.description}</p>}
                  <div className="font-bold text-lg" style={{ color: '#2d6a4f' }}>{formatCurrency(room.pricePerNight)}<span className="text-gray-400 text-xs font-normal">/đêm</span></div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => { setIsNewRoom(false); setEditingRoom({ ...room }) }} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50">
                      <Edit2 className="w-3.5 h-3.5" /> Sửa
                    </button>
                    <button onClick={() => deleteRoom(room.id)} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 border border-red-100 hover:bg-red-50">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {tab === "services" && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => { setIsNewService(true); setEditingService({ ...emptyService }) }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium text-sm" style={{ backgroundColor: '#2d6a4f' }}>
                <Plus className="w-4 h-4" /> Thêm Dịch Vụ
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map(svc => (
                <div key={svc.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {svc.icon && <span className="text-2xl">{svc.icon}</span>}
                      <h3 className="font-bold text-gray-900">{svc.name}</h3>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${svc.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{svc.isActive ? 'Hiện' : 'Ẩn'}</span>
                  </div>
                  {svc.description && <p className="text-xs text-gray-400 mb-2">{svc.description}</p>}
                  <div className="font-bold text-lg" style={{ color: '#2d6a4f' }}>{formatCurrency(svc.price)}</div>
                  <div className="text-xs text-gray-500">{PRICE_UNIT_LABELS[svc.priceUnit] || svc.priceUnit} · {svc.category}</div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => { setIsNewService(false); setEditingService({ ...svc }) }} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50">
                      <Edit2 className="w-3.5 h-3.5" /> Sửa
                    </button>
                    <button onClick={() => deleteService(svc.id)} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 border border-red-100 hover:bg-red-50">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {services.length === 0 && (
                <div className="col-span-3 py-16 text-center text-gray-400">
                  <Coffee className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Chưa có dịch vụ nào. Nhấn "Thêm Dịch Vụ" để bắt đầu.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Chỉnh sửa: {editingUser.name}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                <select value={editValues.role || editingUser.role} onChange={e => setEditValues({ ...editValues, role: e.target.value })} className={inputCls}>
                  <option value="MEMBER">MEMBER</option>
                  <option value="VIP">VIP</option>
                  <option value="SHAREHOLDER">SHAREHOLDER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Cổ phần (%)</label><input type="number" step="0.01" min="0" max="100" value={editValues.sharePercent ?? editingUser.sharePercent} onChange={e => setEditValues({ ...editValues, sharePercent: Number(e.target.value) })} className={inputCls} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Tiền cổ phần</label><input type="number" min="0" value={editValues.shareAmount ?? editingUser.shareAmount} onChange={e => setEditValues({ ...editValues, shareAmount: Number(e.target.value) })} className={inputCls} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">KH miễn phí</label><input type="number" min="0" value={editValues.freeCoursesLeft ?? editingUser.freeCoursesLeft} onChange={e => setEditValues({ ...editValues, freeCoursesLeft: Number(e.target.value) })} className={inputCls} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Giảm giá KH (0-1)</label><input type="number" step="0.01" min="0" max="1" value={editValues.courseDiscount ?? editingUser.courseDiscount} onChange={e => setEditValues({ ...editValues, courseDiscount: Number(e.target.value) })} className={inputCls} /></div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={saveUser} disabled={loading} className="flex-1 py-2.5 rounded-xl text-white font-medium text-sm" style={{ backgroundColor: '#2d6a4f' }}>{loading ? 'Lưu...' : 'Lưu Thay Đổi'}</button>
              <button onClick={() => setEditingUser(null)} className="flex-1 py-2.5 rounded-xl font-medium text-sm border border-gray-200 text-gray-700">Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Room Modal */}
      {editingRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{isNewRoom ? 'Thêm Phòng Mới' : 'Chỉnh Sửa Phòng'}</h3>
            <div className="space-y-3">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Tên phòng</label><input value={editingRoom.name || ""} onChange={e => setEditingRoom({ ...editingRoom, name: e.target.value })} className={inputCls} placeholder="Bungalow Rừng 1" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại phòng</label>
                  <select value={editingRoom.type || "BUNGALOW"} onChange={e => setEditingRoom({ ...editingRoom, type: e.target.value })} className={inputCls}>
                    <option value="BUNGALOW">BUNGALOW</option>
                    <option value="GLAMPING">GLAMPING</option>
                    <option value="VILLA">VILLA</option>
                    <option value="DORMITORY">DORMITORY</option>
                  </select>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Sức chứa (người)</label><input type="number" min="1" value={editingRoom.capacity || 2} onChange={e => setEditingRoom({ ...editingRoom, capacity: Number(e.target.value) })} className={inputCls} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Giá/đêm (đ)</label><input type="number" min="0" value={editingRoom.pricePerNight || 0} onChange={e => setEditingRoom({ ...editingRoom, pricePerNight: Number(e.target.value) })} className={inputCls} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Phí Tip WC + ga gối (đ)</label><input type="number" min="0" value={editingRoom.tipWcBedding || 0} onChange={e => setEditingRoom({ ...editingRoom, tipWcBedding: Number(e.target.value) })} className={inputCls} placeholder="0" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label><textarea rows={2} value={editingRoom.description || ""} onChange={e => setEditingRoom({ ...editingRoom, description: e.target.value })} className={inputCls + " resize-none"} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Tiện nghi (cách nhau bằng dấu phẩy)</label><input value={editingRoom.amenities || ""} onChange={e => setEditingRoom({ ...editingRoom, amenities: e.target.value })} className={inputCls} placeholder="WiFi, Điều hòa, Bồn tắm ngoài trời" /></div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editingRoom.isAvailable !== false} onChange={e => setEditingRoom({ ...editingRoom, isAvailable: e.target.checked })} className="w-4 h-4 accent-green-700" />
                <span className="text-gray-700">Phòng có sẵn để đặt</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={saveRoom} disabled={loading} className="flex-1 py-2.5 rounded-xl text-white font-medium text-sm" style={{ backgroundColor: '#2d6a4f' }}>{loading ? 'Lưu...' : isNewRoom ? 'Tạo Phòng' : 'Lưu Thay Đổi'}</button>
              <button onClick={() => setEditingRoom(null)} className="flex-1 py-2.5 rounded-xl font-medium text-sm border border-gray-200 text-gray-700">Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {editingService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{isNewService ? 'Thêm Dịch Vụ Mới' : 'Chỉnh Sửa Dịch Vụ'}</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-1"><label className="block text-sm font-medium text-gray-700 mb-1">Icon</label><input value={editingService.icon || ""} onChange={e => setEditingService({ ...editingService, icon: e.target.value })} className={inputCls + " text-center text-xl"} placeholder="🍳" /></div>
                <div className="col-span-3"><label className="block text-sm font-medium text-gray-700 mb-1">Tên dịch vụ</label><input value={editingService.name || ""} onChange={e => setEditingService({ ...editingService, name: e.target.value })} className={inputCls} placeholder="Bữa sáng" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label><input value={editingService.description || ""} onChange={e => setEditingService({ ...editingService, description: e.target.value })} className={inputCls} placeholder="Bữa sáng đủ dinh dưỡng" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Giá (đ)</label><input type="number" min="0" value={editingService.price || 0} onChange={e => setEditingService({ ...editingService, price: Number(e.target.value) })} className={inputCls} /></div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị tính</label>
                  <select value={editingService.priceUnit || "booking"} onChange={e => setEditingService({ ...editingService, priceUnit: e.target.value })} className={inputCls}>
                    <option value="booking">đ/lần đặt</option>
                    <option value="person_night">đ/người/đêm</option>
                    <option value="person">đ/người</option>
                    <option value="night">đ/đêm</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                  <select value={editingService.category || "food"} onChange={e => setEditingService({ ...editingService, category: e.target.value })} className={inputCls}>
                    <option value="food">Ăn uống</option>
                    <option value="activity">Hoạt động</option>
                    <option value="facility">Tiện nghi</option>
                  </select>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự hiển thị</label><input type="number" min="0" value={editingService.sortOrder || 0} onChange={e => setEditingService({ ...editingService, sortOrder: Number(e.target.value) })} className={inputCls} /></div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editingService.isActive !== false} onChange={e => setEditingService({ ...editingService, isActive: e.target.checked })} className="w-4 h-4 accent-green-700" />
                <span className="text-gray-700">Hiển thị cho khách đặt phòng</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={saveService} disabled={loading} className="flex-1 py-2.5 rounded-xl text-white font-medium text-sm" style={{ backgroundColor: '#2d6a4f' }}>{loading ? 'Lưu...' : isNewService ? 'Tạo Dịch Vụ' : 'Lưu Thay Đổi'}</button>
              <button onClick={() => setEditingService(null)} className="flex-1 py-2.5 rounded-xl font-medium text-sm border border-gray-200 text-gray-700">Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
