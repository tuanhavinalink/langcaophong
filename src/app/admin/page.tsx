"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Users, Calendar, Search, Edit2, Check, X, Crown, Star, User, TrendingUp } from "lucide-react"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(dateString))
}

interface UserData {
  id: string
  name: string | null
  email: string
  phone: string | null
  role: string
  totalSpent: number
  sharePercent: number
  shareAmount: number
  affiliateCode: string | null
  affiliateBalance: number
  freeCoursesLeft: number
  courseDiscount: number
  createdAt: string
}

interface BookingData {
  id: string
  status: string
  type: string
  checkIn: string | null
  checkOut: string | null
  totalPrice: number
  isFullVillage: boolean
  companyName: string | null
  user: { name: string | null; email: string; phone: string | null }
  room: { name: string } | null
  createdAt: string
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tab, setTab] = useState<"users" | "bookings">("users")
  const [users, setUsers] = useState<UserData[]>([])
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [search, setSearch] = useState("")
  const [editingUser, setEditingUser] = useState<UserData | null>(null)
  const [editValues, setEditValues] = useState<Partial<UserData>>({})
  const [loading, setLoading] = useState(false)

  const role = (session?.user as any)?.role

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
    if (status === "authenticated" && role !== "ADMIN") router.push("/dashboard")
  }, [status, role, router])

  useEffect(() => {
    fetch("/api/admin/users").then(r => r.json()).then(setUsers)
    fetch("/api/bookings").then(r => r.json()).then(setBookings)
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
    if (res.ok) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...editValues } : u))
      setEditingUser(null)
    }
    setLoading(false)
  }

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    await fetch(`/api/bookings`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, status: newStatus })
    })
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b))
  }

  const totalRevenue = bookings.filter(b => b.status !== "CANCELLED").reduce((s, b) => s + b.totalPrice, 0)
  const pendingCount = bookings.filter(b => b.status === "PENDING").length

  const roleColors: Record<string, string> = {
    MEMBER: "bg-gray-100 text-gray-700",
    VIP: "bg-yellow-100 text-yellow-700",
    SHAREHOLDER: "bg-purple-100 text-purple-700",
    ADMIN: "bg-red-100 text-red-700",
  }

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    COMPLETED: "bg-blue-100 text-blue-700",
  }

  const statusLabels: Record<string, string> = {
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    CANCELLED: "Đã hủy",
    COMPLETED: "Hoàn thành",
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#f0fdf4' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
              <div className={`font-bold text-gray-900 ${stat.small ? 'text-lg' : 'text-2xl'}`}>{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("users")}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === "users" ? 'text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            style={tab === "users" ? { backgroundColor: '#2d6a4f' } : {}}
          >
            <Users className="w-4 h-4 inline mr-1.5" />Người Dùng ({users.length})
          </button>
          <button
            onClick={() => setTab("bookings")}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === "bookings" ? 'text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            style={tab === "bookings" ? { backgroundColor: '#2d6a4f' } : {}}
          >
            <Calendar className="w-4 h-4 inline mr-1.5" />Đặt Phòng ({bookings.length})
          </button>
        </div>

        {/* Search */}
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

        {/* Users Table */}
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
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 text-sm">{user.name || '—'}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.phone || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(user.totalSpent)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {user.sharePercent > 0 ? `${user.sharePercent}%` : '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{formatDate(user.createdAt)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => { setEditingUser(user); setEditValues({ role: user.role, sharePercent: user.sharePercent, shareAmount: user.shareAmount, freeCoursesLeft: user.freeCoursesLeft, courseDiscount: user.courseDiscount }) }}
                          className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-700 transition-colors"
                        >
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

        {/* Bookings Table */}
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
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 text-sm">{booking.user?.name || '—'}</div>
                        <div className="text-xs text-gray-500">{booking.user?.phone || booking.user?.email}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {booking.isFullVillage ? `Nguyên Làng - ${booking.companyName || ''}` : booking.room?.name || '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {booking.checkIn ? formatDate(booking.checkIn) : '—'}
                        {booking.checkOut ? ` → ${formatDate(booking.checkOut)}` : ''}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                          {statusLabels[booking.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-bold" style={{ color: '#2d6a4f' }}>{formatCurrency(booking.totalPrice)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {booking.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => updateBookingStatus(booking.id, "CONFIRMED")}
                                className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
                                title="Xác nhận"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => updateBookingStatus(booking.id, "CANCELLED")}
                                className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                                title="Hủy"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
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
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Chỉnh sửa: {editingUser.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                <select
                  value={editValues.role || editingUser.role}
                  onChange={e => setEditValues({ ...editValues, role: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm"
                >
                  <option value="MEMBER">MEMBER</option>
                  <option value="VIP">VIP</option>
                  <option value="SHAREHOLDER">SHAREHOLDER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phần trăm cổ phần (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={editValues.sharePercent ?? editingUser.sharePercent}
                    onChange={e => setEditValues({ ...editValues, sharePercent: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền cổ phần</label>
                  <input
                    type="number"
                    min="0"
                    value={editValues.shareAmount ?? editingUser.shareAmount}
                    onChange={e => setEditValues({ ...editValues, shareAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Khóa học miễn phí</label>
                  <input
                    type="number"
                    min="0"
                    value={editValues.freeCoursesLeft ?? editingUser.freeCoursesLeft}
                    onChange={e => setEditValues({ ...editValues, freeCoursesLeft: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giảm giá KH (0-1)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={editValues.courseDiscount ?? editingUser.courseDiscount}
                    onChange={e => setEditValues({ ...editValues, courseDiscount: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={saveUser}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl text-white font-medium text-sm"
                style={{ backgroundColor: '#2d6a4f' }}
              >
                {loading ? 'Lưu...' : 'Lưu Thay Đổi'}
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 py-2.5 rounded-xl font-medium text-sm border border-gray-200 text-gray-700"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
