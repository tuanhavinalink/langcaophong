"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Users, Calendar, Search, Edit2, Check, X, TrendingUp, Home, Plus, Trash2, Coffee, Bell, Pin, Send, BookOpen, Video, Image as ImageIcon, Lock } from "lucide-react"
import BookingDetailPopup from "@/components/BookingDetailPopup"

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
  freeCoursesLeft: number; courseDiscount: number
  isActive: boolean; parentShareholderId: string | null
  parentShareholder?: { id: string; name: string | null } | null
  createdAt: string
}

interface BookingData {
  id: string; status: string; type: string; checkIn: string | null; checkOut: string | null
  totalPrice: number; isFullVillage: boolean; companyName: string | null
  user: { name: string | null; email: string; phone: string | null }
  room: { name: string } | null; createdAt: string
}

interface RoomData {
  id: string; name: string; type: string; capacity: number
  pricePerNight: number; memberPrice: number | null; tipService: number; tipWcBedding: number; totalUnits: number; description: string | null
  amenities: string | null; isAvailable: boolean
}

interface EnrollData {
  id: string; status: string; paidPrice: number; scheduleDate: string | null; createdAt: string
  course: { name: string; slug: string }
  user: { name: string | null; email: string; phone: string | null }
}

interface NotifData {
  id: string; title: string; content: string; targetRoles: string
  isPinned: boolean; isActive: boolean; createdAt: string
}

const TARGET_ROLES = [
  { value: "ALL", label: "Tất cả thành viên" },
  { value: "MEMBER", label: "Thành viên thường" },
  { value: "VIP", label: "VIP" },
  { value: "SHAREHOLDER", label: "Cổ đông" },
  { value: "ADMIN", label: "Admin" },
]

const emptyNotif: Partial<NotifData> = { title: "", content: "", targetRoles: "ALL", isPinned: false, isActive: true }

interface ServiceData {
  id: string; name: string; description: string | null; icon: string | null
  price: number; priceUnit: string; category: string; isActive: boolean; sortOrder: number
}

interface MediaData {
  id: string; title: string; description: string | null; type: string
  url: string; thumbnail: string | null; sortOrder: number; isActive: boolean
}

const emptyMedia: Partial<MediaData> = { title: "", description: "", type: "image", url: "", thumbnail: "", sortOrder: 0, isActive: true }

const PRICE_UNIT_LABELS: Record<string, string> = {
  booking: "đ/lần đặt",
  person_night: "đ/người/đêm",
  person: "đ/người",
  night: "đ/đêm",
  night_unit: "đ/đêm/phòng",
}

const emptyRoom: Partial<RoomData> = { name: "", type: "BUNGALOW", capacity: 2, pricePerNight: 0, tipService: 50000, tipWcBedding: 0, totalUnits: 1, description: "", isAvailable: true }
const emptyService: Partial<ServiceData> = { name: "", description: "", icon: "", price: 0, priceUnit: "booking", category: "food", isActive: true, sortOrder: 0 }

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tab, setTab] = useState<"users" | "bookings" | "rooms" | "services" | "notifications" | "courses" | "media" | "blocked">("users")
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null)
  const [users, setUsers] = useState<UserData[]>([])
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [rooms, setRooms] = useState<RoomData[]>([])
  const [services, setServices] = useState<ServiceData[]>([])
  const [notifications, setNotifications] = useState<NotifData[]>([])
  const [enrollments, setEnrollments] = useState<EnrollData[]>([])
  const [editingNotif, setEditingNotif] = useState<Partial<NotifData> | null>(null)
  const [isNewNotif, setIsNewNotif] = useState(false)
  const [search, setSearch] = useState("")
  const [editingUser, setEditingUser] = useState<UserData | null>(null)
  const [editValues, setEditValues] = useState<Partial<UserData> & { parentShareholderId?: string | null }>({})
  const [showPendingOnly, setShowPendingOnly] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Partial<RoomData> | null>(null)
  const [isNewRoom, setIsNewRoom] = useState(false)
  const [editingService, setEditingService] = useState<Partial<ServiceData> | null>(null)
  const [isNewService, setIsNewService] = useState(false)
  const [mediaItems, setMediaItems] = useState<MediaData[]>([])
  const [editingMedia, setEditingMedia] = useState<Partial<MediaData> | null>(null)
  const [isNewMedia, setIsNewMedia] = useState(false)
  const [blockedDates, setBlockedDates] = useState<{ id: string; checkIn: string; checkOut: string; reason: string }[]>([])
  const [newBlock, setNewBlock] = useState({ checkIn: "", checkOut: "", reason: "" })
  const [loading, setLoading] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [newMember, setNewMember] = useState({ name: "", email: "", phone: "", password: "", role: "MEMBER", shareAmount: 0, parentShareholderId: "" })

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
    fetch("/api/admin/notifications").then(r => r.json()).then(setNotifications)
    fetch("/api/courses/enroll").then(r => r.json()).then(setEnrollments)
    fetch("/api/admin/media").then(r => r.json()).then(setMediaItems)
    fetch("/api/admin/blocked-dates").then(r => r.json()).then(setBlockedDates)
  }, [])

  const pendingUsers = users.filter(u => !u.isActive)
  const filteredUsers = users.filter(u => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search)
    return matchSearch && (!showPendingOnly || !u.isActive)
  })
  const mainShareholders = users.filter(u => u.role === "SHAREHOLDER_MAIN" && u.isActive)
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
    if (res.ok) {
    const updated = await res.json()
    setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...updated } : u))
    setEditingUser(null)
  }
    setLoading(false)
  }

  const addMember = async () => {
    if (!newMember.name || !newMember.email || !newMember.phone || !newMember.password) return
    setLoading(true)
    const body: any = {
      name: newMember.name,
      email: newMember.email,
      phone: newMember.phone,
      password: newMember.password,
      memberType: newMember.role,
    }
    const res = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    if (res.ok) {
      const { userId } = await res.json()
      const patchBody: any = { userId, role: newMember.role, isActive: true }
      if (newMember.shareAmount > 0) patchBody.shareAmount = newMember.shareAmount
      if (newMember.parentShareholderId) patchBody.parentShareholderId = newMember.parentShareholderId
      const patch = await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patchBody) })
      if (patch.ok) {
        const updated = await patch.json()
        setUsers(prev => [updated, ...prev])
      }
      setShowAddMember(false)
      setNewMember({ name: "", email: "", phone: "", password: "", role: "MEMBER", shareAmount: 0, parentShareholderId: "" })
    }
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

  const updateEnrollStatus = async (enrollmentId: string, status: string) => {
    await fetch("/api/courses/enroll", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ enrollmentId, status }) })
    setEnrollments(enrollments.map(e => e.id === enrollmentId ? { ...e, status } : e))
  }

  const saveNotif = async () => {
    if (!editingNotif) return
    setLoading(true)
    if (isNewNotif) {
      const res = await fetch("/api/admin/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingNotif) })
      if (res.ok) { const n = await res.json(); setNotifications([n, ...notifications]) }
    } else {
      const res = await fetch(`/api/admin/notifications/${(editingNotif as NotifData).id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingNotif) })
      if (res.ok) { const n = await res.json(); setNotifications(notifications.map(x => x.id === n.id ? n : x)) }
    }
    setEditingNotif(null); setLoading(false)
  }

  const deleteNotif = async (id: string) => {
    if (!confirm("Xóa thông báo này?")) return
    await fetch(`/api/admin/notifications/${id}`, { method: "DELETE" })
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const deleteService = async (id: string) => {
    if (!confirm("Xóa dịch vụ này?")) return
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" })
    setServices(services.filter(s => s.id !== id))
  }

  const saveMedia = async () => {
    if (!editingMedia) return
    setLoading(true)
    if (isNewMedia) {
      const res = await fetch("/api/admin/media", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingMedia) })
      if (res.ok) { const m = await res.json(); setMediaItems([...mediaItems, m]) }
    } else {
      const res = await fetch(`/api/admin/media/${(editingMedia as MediaData).id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingMedia) })
      if (res.ok) { const m = await res.json(); setMediaItems(mediaItems.map(x => x.id === m.id ? m : x)) }
    }
    setEditingMedia(null); setLoading(false)
  }

  const deleteMedia = async (id: string) => {
    if (!confirm("Xóa mục này?")) return
    await fetch(`/api/admin/media/${id}`, { method: "DELETE" })
    setMediaItems(mediaItems.filter(m => m.id !== id))
  }

  const totalRevenue = bookings.filter(b => b.status !== "CANCELLED").reduce((s, b) => s + b.totalPrice, 0)
  const pendingCount = bookings.filter(b => b.status === "PENDING").length

  const roleColors: Record<string, string> = { MEMBER: "bg-gray-100 text-gray-700", VIP: "bg-yellow-100 text-yellow-700", SHAREHOLDER: "bg-purple-100 text-purple-700", SHAREHOLDER_MAIN: "bg-purple-100 text-purple-700", SHAREHOLDER_FOLLOW: "bg-blue-100 text-blue-700", ADMIN: "bg-red-100 text-red-700" }
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
            { key: "courses", label: `Khóa Học (${enrollments.length})`, icon: BookOpen },
            { key: "notifications", label: `Thông Báo (${notifications.length})`, icon: Bell },
            { key: "media", label: `Khám Phá Làng (${mediaItems.length})`, icon: Video },
            { key: "blocked", label: `Khóa Ngày (${blockedDates.length})`, icon: Lock },
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
          <div className="space-y-4">
            {/* Pending alert */}
            {pendingUsers.length > 0 && (
              <div className="rounded-2xl p-4 flex items-center justify-between" style={{ backgroundColor: '#fef3c7', border: '1.5px solid #fde68a' }}>
                <div>
                  <span className="font-bold text-amber-800">⏳ {pendingUsers.length} cổ đông chờ kích hoạt</span>
                  <div className="text-sm text-amber-700 mt-0.5">{pendingUsers.map(u => u.name || u.email).join(', ')}</div>
                </div>
                <button
                  onClick={() => setShowPendingOnly(p => !p)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: showPendingOnly ? '#92400e' : '#d97706', color: 'white' }}
                >
                  {showPendingOnly ? 'Xem tất cả' : 'Lọc cổ đông chờ'}
                </button>
              </div>
            )}

          <div className="flex justify-end">
            <button
              onClick={() => setShowAddMember(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium"
              style={{ backgroundColor: '#2d6a4f' }}
            >
              <Plus className="w-4 h-4" /> Thêm Member
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#f0fdf4' }}>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Người dùng</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">SĐT</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Vai trò</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Trạng thái</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Vốn đầu tư</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Ngày tham gia</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className={`hover:bg-gray-50 ${!user.isActive ? 'bg-amber-50' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 text-sm">{user.name || '—'}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                        {user.parentShareholder && (
                          <div className="text-xs mt-0.5" style={{ color: '#1d4ed8' }}>↳ {user.parentShareholder.name}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.phone || '—'}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[user.role] || 'bg-gray-100 text-gray-700'}`}>{user.role}</span></td>
                      <td className="px-4 py-3">
                        {user.isActive
                          ? <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>
                          : <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Chờ duyệt</span>
                        }
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.shareAmount > 0 ? formatCurrency(user.shareAmount) : '—'}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{formatDate(user.createdAt)}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => {
                          setEditingUser(user)
                          setEditValues({
                            role: user.role,
                            sharePercent: user.sharePercent,
                            shareAmount: user.shareAmount,
                            freeCoursesLeft: user.freeCoursesLeft,
                            courseDiscount: user.courseDiscount,
                            isActive: user.isActive,
                            parentShareholderId: user.parentShareholderId,
                          })
                        }} className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-700 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                    <tr key={booking.id} className="hover:bg-green-50 cursor-pointer" onClick={() => setSelectedBooking(booking)}>
                      <td className="px-4 py-3"><div className="font-medium text-gray-900 text-sm">{booking.user?.name || '—'}</div><div className="text-xs text-gray-500">{booking.user?.phone || booking.user?.email}</div></td>
                      <td className="px-4 py-3 text-sm text-gray-700">{booking.isFullVillage ? `Nguyên Làng - ${booking.companyName || ''}` : booking.room?.name || '—'}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{booking.checkIn ? formatDate(booking.checkIn) : '—'}{booking.checkOut ? ` → ${formatDate(booking.checkOut)}` : ''}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>{statusLabels[booking.status]}</span></td>
                      <td className="px-4 py-3 text-sm font-bold" style={{ color: '#2d6a4f' }}>{formatCurrency(booking.totalPrice)}</td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
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
                  <p className="text-sm text-gray-500 mb-1">Sức chứa: {room.capacity} người · {room.totalUnits} phòng</p>
                  {room.description && <p className="text-xs text-gray-400 mb-2">{room.description}</p>}
                  <div className="space-y-0.5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-yellow-600 font-medium">VIP/CĐ:</span>
                      <span className="font-bold text-base" style={{ color: '#2d6a4f' }}>{formatCurrency(room.pricePerNight)}</span>
                      <span className="text-gray-400 text-xs">/đêm</span>
                    </div>
                    {room.memberPrice != null && (
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-gray-500 font-medium">Member:</span>
                        <span className="font-semibold text-base text-gray-700">{formatCurrency(room.memberPrice)}</span>
                        <span className="text-gray-400 text-xs">/đêm</span>
                      </div>
                    )}
                  </div>
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

        {/* Courses Tab */}
        {tab === "courses" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#f0fdf4' }}>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Học viên</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Khóa học</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Ngày mong muốn</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Học phí</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Trạng thái</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {enrollments.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-12 text-gray-400"><BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" /><p>Chưa có đăng ký khóa học nào</p></td></tr>
                )}
                {enrollments.map(e => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 text-sm">{e.user.name || '—'}</div>
                      <div className="text-xs text-gray-500">{e.user.phone || e.user.email}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{e.course.name}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{e.scheduleDate ? formatDate(e.scheduleDate) : '—'}</td>
                    <td className="px-4 py-3 text-sm font-bold" style={{ color: '#2d6a4f' }}>{e.paidPrice === 0 ? 'Miễn phí' : formatCurrency(e.paidPrice)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[e.status] || 'bg-gray-100 text-gray-600'}`}>{statusLabels[e.status] || e.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {e.status === "ENROLLED" && (
                          <>
                            <button onClick={() => updateEnrollStatus(e.id, "CONFIRMED")} className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100" title="Xác nhận"><Check className="w-3.5 h-3.5" /></button>
                            <button onClick={() => updateEnrollStatus(e.id, "CANCELLED")} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100" title="Hủy"><X className="w-3.5 h-3.5" /></button>
                          </>
                        )}
                        {e.status === "CONFIRMED" && (
                          <button onClick={() => updateEnrollStatus(e.id, "COMPLETED")} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-medium px-2">Hoàn thành</button>
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

      {/* Media Tab */}
      {tab === "media" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">Quản lý ảnh và video hiển thị trên trang <strong>/kham-pha-lang</strong></p>
            <button onClick={() => { setIsNewMedia(true); setEditingMedia({ ...emptyMedia }) }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium text-sm" style={{ backgroundColor: '#2d6a4f' }}>
              <Plus className="w-4 h-4" /> Thêm Mục Mới
            </button>
          </div>
          {mediaItems.length === 0 ? (
            <div className="py-20 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
              <Video className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Chưa có ảnh/video nào. Nhấn "Thêm Mục Mới" để bắt đầu.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mediaItems.map(m => (
                <div key={m.id} className={`bg-white rounded-2xl border overflow-hidden shadow-sm ${!m.isActive ? 'opacity-50' : 'border-gray-100'}`}>
                  <div className="aspect-video bg-gray-100 relative">
                    {m.type === "video" ? (
                      (() => {
                        const ytMatch = m.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
                        const thumb = m.thumbnail || (ytMatch ? `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg` : null)
                        return thumb
                          ? <img src={thumb} alt={m.title} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center"><Video className="w-10 h-10 text-gray-300" /></div>
                      })()
                    ) : (
                      <img src={m.url} alt={m.title} className="w-full h-full object-cover" onError={e => { (e.target as any).src = '' }} />
                    )}
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${m.type === 'video' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {m.type === 'video' ? '▶ Video' : '🖼 Ảnh'}
                      </span>
                    </div>
                    {!m.isActive && <div className="absolute top-2 right-2 px-2 py-0.5 bg-gray-800/70 text-white text-xs rounded-full">Đã ẩn</div>}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{m.title}</p>
                        {m.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{m.description}</p>}
                        <p className="text-xs text-gray-400 mt-1">Thứ tự: {m.sortOrder}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => { setIsNewMedia(false); setEditingMedia({ ...m }) }} className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-green-700"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => deleteMedia(m.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Notifications Tab */}
      {tab === "notifications" && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => { setIsNewNotif(true); setEditingNotif({ ...emptyNotif }) }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium text-sm" style={{ backgroundColor: '#2d6a4f' }}>
              <Plus className="w-4 h-4" /> Tạo Thông Báo
            </button>
          </div>
          <div className="space-y-3">
            {notifications.length === 0 && (
              <div className="py-16 text-center text-gray-400">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Chưa có thông báo nào. Nhấn "Tạo Thông Báo" để bắt đầu.</p>
              </div>
            )}
            {notifications.map(n => (
              <div key={n.id} className={`bg-white rounded-2xl p-5 shadow-sm border ${n.isPinned ? 'border-amber-200' : 'border-gray-100'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {n.isPinned && <Pin className="w-3.5 h-3.5 text-amber-500" />}
                      <h3 className="font-bold text-gray-900">{n.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        n.targetRoles === "ALL" ? "bg-blue-100 text-blue-700" :
                        n.targetRoles === "SHAREHOLDER" ? "bg-purple-100 text-purple-700" :
                        n.targetRoles === "VIP" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {TARGET_ROLES.find(r => r.value === n.targetRoles)?.label || n.targetRoles}
                      </span>
                      {!n.isActive && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">Đã ẩn</span>}
                    </div>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{n.content}</p>
                    <p className="text-xs text-gray-400 mt-2">{formatDate(n.createdAt)}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => { setIsNewNotif(false); setEditingNotif({ ...n }) }} className="p-2 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-green-700"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => deleteNotif(n.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" style={{ color: '#2d6a4f' }} /> Thêm Thành Viên Mới
            </h3>
            <div className="space-y-3">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Họ tên *</label><input value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} className={inputCls} placeholder="Nguyễn Văn A" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" value={newMember.email} onChange={e => setNewMember({ ...newMember, email: e.target.value })} className={inputCls} placeholder="email@example.com" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label><input value={newMember.phone} onChange={e => setNewMember({ ...newMember, phone: e.target.value })} className={inputCls} placeholder="0912345678" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu *</label><input type="password" value={newMember.password} onChange={e => setNewMember({ ...newMember, password: e.target.value })} className={inputCls} placeholder="Mật khẩu ban đầu" /></div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                <select value={newMember.role} onChange={e => setNewMember({ ...newMember, role: e.target.value, parentShareholderId: "" })} className={inputCls}>
                  <option value="MEMBER">Member thường</option>
                  <option value="VIP">VIP</option>
                  <option value="SHAREHOLDER_MAIN">Cổ đông Chính</option>
                  <option value="SHAREHOLDER_FOLLOW">Cổ đông Shares</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              {(newMember.role === "SHAREHOLDER_MAIN" || newMember.role === "SHAREHOLDER_FOLLOW") && (
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Vốn đầu tư (VNĐ)</label><input type="number" min="0" value={newMember.shareAmount || ""} onChange={e => setNewMember({ ...newMember, shareAmount: Number(e.target.value) })} className={inputCls} placeholder="650000000" /></div>
              )}
              {newMember.role === "SHAREHOLDER_FOLLOW" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nhánh Cổ đông Chính</label>
                  <select value={newMember.parentShareholderId} onChange={e => setNewMember({ ...newMember, parentShareholderId: e.target.value })} className={inputCls}>
                    <option value="">— Chưa phân nhánh —</option>
                    {mainShareholders.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({formatCurrency(m.shareAmount)})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={addMember} disabled={loading || !newMember.name || !newMember.email || !newMember.phone || !newMember.password} className="flex-1 py-2.5 rounded-xl text-white font-medium text-sm disabled:opacity-50" style={{ backgroundColor: '#2d6a4f' }}>{loading ? 'Đang tạo...' : 'Tạo Tài Khoản'}</button>
              <button onClick={() => setShowAddMember(false)} className="flex-1 py-2.5 rounded-xl font-medium text-sm border border-gray-200 text-gray-700">Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Chỉnh sửa: {editingUser.name}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                <select value={editValues.role ?? editingUser.role} onChange={e => setEditValues({ ...editValues, role: e.target.value })} className={inputCls}>
                  <option value="MEMBER">Member thường</option>
                  <option value="VIP">VIP</option>
                  <option value="SHAREHOLDER_MAIN">Cổ đông Chính</option>
                  <option value="SHAREHOLDER_FOLLOW">Cổ đông Shares</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#f0fdf4' }}>
                <label className="text-sm font-medium text-gray-700 flex-1">Kích hoạt tài khoản</label>
                <button
                  onClick={() => setEditValues({ ...editValues, isActive: !(editValues.isActive ?? editingUser.isActive) })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${(editValues.isActive ?? editingUser.isActive) ? '' : 'bg-gray-300'}`}
                  style={(editValues.isActive ?? editingUser.isActive) ? { backgroundColor: '#2d6a4f' } : {}}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${(editValues.isActive ?? editingUser.isActive) ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className="text-sm text-gray-600">{(editValues.isActive ?? editingUser.isActive) ? 'Active' : 'Chờ duyệt'}</span>
              </div>
              {((editValues.role ?? editingUser.role) === "SHAREHOLDER_FOLLOW") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nhánh Cổ đông Chính</label>
                  <select
                    value={editValues.parentShareholderId ?? editingUser.parentShareholderId ?? ""}
                    onChange={e => setEditValues({ ...editValues, parentShareholderId: e.target.value || null })}
                    className={inputCls}
                  >
                    <option value="">— Chưa phân nhánh —</option>
                    {mainShareholders.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({formatCurrency(m.shareAmount)})</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Tiền cổ phần (VNĐ)</label><input type="number" min="0" value={editValues.shareAmount ?? editingUser.shareAmount} onChange={e => setEditValues({ ...editValues, shareAmount: Number(e.target.value) })} className={inputCls} /></div>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá VIP/CĐ (đ/đêm)</label>
                  <input type="number" min="0" value={editingRoom.pricePerNight || 0} onChange={e => setEditingRoom({ ...editingRoom, pricePerNight: Number(e.target.value) })} className={inputCls} />
                  <p className="text-xs text-gray-400 mt-0.5">Áp dụng cho VIP & Cổ đông</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá Member thường (đ/đêm)</label>
                  <input type="number" min="0" value={(editingRoom as RoomData).memberPrice ?? ""} onChange={e => setEditingRoom({ ...editingRoom, memberPrice: e.target.value === "" ? null : Number(e.target.value) } as Partial<RoomData>)} className={inputCls} placeholder="Để trống = dùng giá VIP" />
                  <p className="text-xs text-gray-400 mt-0.5">Để trống nếu giá như nhau</p>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Tổng số phòng / lều</label><input type="number" min="1" value={editingRoom.totalUnits || 1} onChange={e => setEditingRoom({ ...editingRoom, totalUnits: Number(e.target.value) })} className={inputCls} /></div>
                <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Phí Tip WC + ga gối (đ)</label><input type="number" min="0" value={editingRoom.tipWcBedding || 0} onChange={e => setEditingRoom({ ...editingRoom, tipWcBedding: Number(e.target.value) })} className={inputCls} placeholder="0" /></div>
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

      {/* Notification Modal */}
      {editingNotif && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" style={{ color: '#2d6a4f' }} />
              {isNewNotif ? 'Tạo Thông Báo Mới' : 'Chỉnh Sửa Thông Báo'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                <input value={editingNotif.title || ""} onChange={e => setEditingNotif({ ...editingNotif, title: e.target.value })} className={inputCls} placeholder="Thông báo quan trọng..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                <textarea rows={5} value={editingNotif.content || ""} onChange={e => setEditingNotif({ ...editingNotif, content: e.target.value })} className={inputCls + " resize-none"} placeholder="Nội dung thông báo chi tiết..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gửi đến</label>
                <div className="grid grid-cols-2 gap-2">
                  {TARGET_ROLES.map(r => (
                    <label key={r.value} className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${editingNotif.targetRoles === r.value ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input type="radio" name="targetRoles" value={r.value} checked={editingNotif.targetRoles === r.value} onChange={() => setEditingNotif({ ...editingNotif, targetRoles: r.value })} className="accent-green-700" />
                      <span className="text-sm font-medium text-gray-700">{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={editingNotif.isPinned || false} onChange={e => setEditingNotif({ ...editingNotif, isPinned: e.target.checked })} className="w-4 h-4 accent-amber-500" />
                  <Pin className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-gray-700">Ghim lên đầu</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={editingNotif.isActive !== false} onChange={e => setEditingNotif({ ...editingNotif, isActive: e.target.checked })} className="w-4 h-4 accent-green-700" />
                  <span className="text-gray-700">Hiển thị</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={saveNotif} disabled={loading || !editingNotif.title || !editingNotif.content} className="flex-1 py-2.5 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50" style={{ backgroundColor: '#2d6a4f' }}>
                <Send className="w-4 h-4" /> {loading ? 'Đang gửi...' : isNewNotif ? 'Gửi Thông Báo' : 'Lưu Thay Đổi'}
              </button>
              <button onClick={() => setEditingNotif(null)} className="flex-1 py-2.5 rounded-xl font-medium text-sm border border-gray-200 text-gray-700">Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Media Modal */}
      {editingMedia && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Video className="w-5 h-5" style={{ color: '#2d6a4f' }} />
              {isNewMedia ? 'Thêm Ảnh / Video Mới' : 'Chỉnh Sửa'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
                <div className="flex gap-3">
                  {[{ value: "image", label: "🖼 Hình ảnh" }, { value: "video", label: "▶ Video" }].map(t => (
                    <label key={t.value} className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer text-sm font-medium transition-colors ${editingMedia.type === t.value ? 'border-green-500 bg-green-50 text-green-800' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                      <input type="radio" name="mediaType" checked={editingMedia.type === t.value} onChange={() => setEditingMedia({ ...editingMedia, type: t.value })} className="sr-only" />
                      {t.label}
                    </label>
                  ))}
                </div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label><input value={editingMedia.title || ""} onChange={e => setEditingMedia({ ...editingMedia, title: e.target.value })} className={inputCls} placeholder="Bungalow view sông..." /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Mô tả (tuỳ chọn)</label><textarea rows={2} value={editingMedia.description || ""} onChange={e => setEditingMedia({ ...editingMedia, description: e.target.value })} className={inputCls + " resize-none"} placeholder="Mô tả ngắn..." /></div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editingMedia.type === "video" ? "URL Video (YouTube hoặc link trực tiếp)" : "URL Hình ảnh"}
                </label>
                <input value={editingMedia.url || ""} onChange={e => setEditingMedia({ ...editingMedia, url: e.target.value })} className={inputCls} placeholder={editingMedia.type === "video" ? "https://youtube.com/watch?v=..." : "https://..."} />
              </div>
              {editingMedia.type === "video" && (
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL (tuỳ chọn — tự động lấy từ YouTube)</label><input value={editingMedia.thumbnail || ""} onChange={e => setEditingMedia({ ...editingMedia, thumbnail: e.target.value })} className={inputCls} placeholder="https://..." /></div>
              )}
              {/* Preview */}
              {editingMedia.url && (
                <div className="rounded-xl overflow-hidden border border-gray-100 aspect-video bg-gray-100">
                  {editingMedia.type === "video" ? (
                    (() => {
                      const ytMatch = (editingMedia.url || "").match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
                      const thumb = editingMedia.thumbnail || (ytMatch ? `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg` : null)
                      return thumb ? <img src={thumb} alt="preview" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Không có thumbnail</div>
                    })()
                  ) : (
                    <img src={editingMedia.url} alt="preview" className="w-full h-full object-cover" onError={e => { (e.target as any).style.display = 'none' }} />
                  )}
                </div>
              )}
              <div className="flex gap-3">
                <div className="flex-1"><label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự hiển thị</label><input type="number" min="0" value={editingMedia.sortOrder ?? 0} onChange={e => setEditingMedia({ ...editingMedia, sortOrder: Number(e.target.value) })} className={inputCls} /></div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={editingMedia.isActive !== false} onChange={e => setEditingMedia({ ...editingMedia, isActive: e.target.checked })} className="w-4 h-4 accent-green-700" />
                    <span className="text-gray-700">Hiển thị</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={saveMedia} disabled={loading || !editingMedia.title || !editingMedia.url} className="flex-1 py-2.5 rounded-xl text-white font-medium text-sm disabled:opacity-50" style={{ backgroundColor: '#2d6a4f' }}>{loading ? 'Lưu...' : isNewMedia ? 'Thêm Mục' : 'Lưu Thay Đổi'}</button>
              <button onClick={() => setEditingMedia(null)} className="flex-1 py-2.5 rounded-xl font-medium text-sm border border-gray-200 text-gray-700">Hủy</button>
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
                    <option value="night_unit">đ/đêm/phòng</option>
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

      {/* ===== BLOCKED DATES ===== */}
      {tab === "blocked" && (
        <div className="space-y-6">
          {/* Add form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4" style={{ color: '#2d6a4f' }} /> Khóa Ngày Đặt Phòng (khi có lớp học)
            </h3>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Từ ngày</label>
                <input type="date" value={newBlock.checkIn} onChange={e => setNewBlock({ ...newBlock, checkIn: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Đến ngày</label>
                <input type="date" value={newBlock.checkOut} min={newBlock.checkIn} onChange={e => setNewBlock({ ...newBlock, checkOut: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Lý do</label>
                <input type="text" value={newBlock.reason} placeholder="VD: Khóa học Vĩ Mô 20-21/06" onChange={e => setNewBlock({ ...newBlock, reason: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900" />
              </div>
            </div>
            <button
              className="mt-3 px-5 py-2.5 rounded-xl text-white font-medium text-sm flex items-center gap-2"
              style={{ backgroundColor: '#2d6a4f' }}
              onClick={async () => {
                if (!newBlock.checkIn || !newBlock.checkOut || !newBlock.reason) return
                setLoading(true)
                const res = await fetch("/api/admin/blocked-dates", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(newBlock)
                })
                if (res.ok) {
                  const b = await res.json()
                  setBlockedDates([...blockedDates, b])
                  setNewBlock({ checkIn: "", checkOut: "", reason: "" })
                }
                setLoading(false)
              }}
              disabled={loading}
            >
              <Lock className="w-4 h-4" /> Khóa Ngày
            </button>
          </div>

          {/* List */}
          {blockedDates.length === 0 ? (
            <div className="py-16 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
              <Lock className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Chưa có ngày nào bị khóa.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <tr>
                    <th className="px-5 py-3 text-left">Từ ngày</th>
                    <th className="px-5 py-3 text-left">Đến ngày</th>
                    <th className="px-5 py-3 text-left">Lý do</th>
                    <th className="px-5 py-3 text-right">Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {blockedDates.map(b => (
                    <tr key={b.id} className="hover:bg-yellow-50">
                      <td className="px-5 py-3 font-medium text-gray-900">{formatDate(b.checkIn)}</td>
                      <td className="px-5 py-3 text-gray-700">{formatDate(b.checkOut)}</td>
                      <td className="px-5 py-3 text-gray-600">{b.reason}</td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={async () => {
                          await fetch("/api/admin/blocked-dates", {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: b.id })
                          })
                          setBlockedDates(blockedDates.filter(x => x.id !== b.id))
                        }} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      </div>

      {/* Booking detail popup */}
      {selectedBooking && (
        <BookingDetailPopup booking={selectedBooking as any} onClose={() => setSelectedBooking(null)} />
      )}
    </div>
  )
}
