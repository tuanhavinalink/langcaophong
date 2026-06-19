import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  User, Calendar, BookOpen, Star, Crown, Home, Settings, Bell, Pin, Users
} from "lucide-react"
import AffiliateCard from "@/components/AffiliateCard"
import ShareCapitalPopup from "@/components/ShareCapitalPopup"
import MemberBenefitsPopup from "@/components/MemberBenefitsPopup"
import BookingList from "@/components/BookingDetailPopup"
import CourseEnrollmentList from "@/components/CourseEnrollmentPopup"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

function formatDate(date: Date | null | undefined) {
  if (!date) return "-"
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date))
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  ENROLLED: "bg-green-100 text-green-700",
}

const statusLabels: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  CANCELLED: "Đã hủy",
  COMPLETED: "Hoàn thành",
  ENROLLED: "Đã đăng ký",
}

const roleColors: Record<string, string> = {
  MEMBER: "bg-gray-100 text-gray-700",
  VIP: "bg-yellow-100 text-yellow-700",
  SHAREHOLDER: "bg-purple-100 text-purple-700",
  SHAREHOLDER_MAIN: "bg-purple-100 text-purple-700",
  SHAREHOLDER_FOLLOW: "bg-blue-100 text-blue-700",
  ADMIN: "bg-red-100 text-red-700",
}

const roleLabels: Record<string, string> = {
  MEMBER: "Thành Viên",
  VIP: "VIP",
  SHAREHOLDER: "Cổ Đông",
  SHAREHOLDER_MAIN: "Cổ Đông Chính",
  SHAREHOLDER_FOLLOW: "Cổ Đông Shares",
  ADMIN: "Quản Trị",
}

const roleIcons: Record<string, any> = {
  MEMBER: User,
  VIP: Star,
  SHAREHOLDER: Crown,
  SHAREHOLDER_MAIN: Crown,
  SHAREHOLDER_FOLLOW: Users,
  ADMIN: Crown,
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const userId = (session.user as any).id
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      bookings: { include: { room: true }, orderBy: { createdAt: "desc" }, take: 20 },
      courseEnrollments: { include: { course: true }, orderBy: { createdAt: "desc" } },
      parentShareholder: { select: { id: true, name: true, shareAmount: true } },
    }
  })

  if (!user) redirect("/login")

  // Cổ đông chưa được kích hoạt → màn hình đợi
  if (!user.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#f0fdf4' }}>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: '#fef3c7' }}>
            <span className="text-4xl">⏳</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đang chờ kích hoạt</h2>
          <p className="text-gray-600 mb-4">
            Tài khoản <strong>{roleLabels[user.role] ?? user.role}</strong> của bạn đã được tạo thành công.<br />
            Admin sẽ xem xét và kích hoạt quyền cổ đông trong thời gian sớm nhất.
          </p>
          <div className="rounded-xl p-4 mb-5 text-left space-y-1.5 text-sm" style={{ backgroundColor: '#f9fafb' }}>
            <div className="flex justify-between"><span className="text-gray-500">Họ tên</span><span className="font-medium">{user.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium">{user.email}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Loại tài khoản</span><span className="font-medium" style={{ color: '#7c3aed' }}>{roleLabels[user.role] ?? user.role}</span></div>
          </div>
          <p className="text-sm text-gray-500">
            Liên hệ Hoàng Nga: <strong>0986 655 894</strong> để được hỗ trợ nhanh hơn.
          </p>
        </div>
      </div>
    )
  }

  // totalSpent = chỉ tính booking đã CONFIRMED hoặc COMPLETED
  const confirmedSpent = user.bookings
    .filter(b => b.status === "CONFIRMED" || b.status === "COMPLETED")
    .reduce((sum, b) => sum + b.totalPrice, 0)

  const notifications = await prisma.notification.findMany({
    where: {
      isActive: true,
      OR: [
        { targetRoles: "ALL" },
        { targetRoles: user.role },
        ...(["SHAREHOLDER_MAIN", "SHAREHOLDER_FOLLOW"].includes(user.role)
          ? [{ targetRoles: "SHAREHOLDER" }]
          : []),
      ]
    },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    take: 10,
  })

  const RoleIcon = roleIcons[user.role] || User

  // Serialize enrollments for client component
  const enrollmentsSerialized = user.courseEnrollments.map(e => ({
    id: e.id,
    status: e.status,
    paidPrice: e.paidPrice,
    createdAt: e.createdAt.toISOString(),
    scheduleDate: e.scheduleDate?.toISOString() ?? null,
    course: {
      name: e.course.name,
      duration: e.course.duration,
      instructor: e.course.instructor ?? null,
    },
  }))

  // Serialize bookings for client component
  const bookingsSerialized = user.bookings.map(b => ({
    id: b.id,
    bookingCode: b.bookingCode ?? null,
    status: b.status,
    checkIn: b.checkIn?.toISOString() ?? null,
    checkOut: b.checkOut?.toISOString() ?? null,
    guests: b.guests,
    isFullVillage: b.isFullVillage,
    companyName: b.companyName ?? null,
    purpose: b.purpose ?? null,
    notes: b.notes ?? null,
    basePrice: b.basePrice,
    tipWcBedding: (b as any).tipWcBedding ?? 0,
    servicesPrice: b.servicesPrice,
    serviceItems: (b as any).serviceItems ?? null,
    roomQty: (b as any).roomQty ?? 1,
    discount: b.discount,
    totalPrice: b.totalPrice,
    includeBreakfast: b.includeBreakfast,
    includeLunch: b.includeLunch,
    includeDinner: b.includeDinner,
    includeCampfire: b.includeCampfire,
    kitchenTip: b.kitchenTip,
    createdAt: b.createdAt.toISOString(),
    room: b.room ? { name: b.room.name } : null,
  }))

  return (
    <div className="min-h-screen py-10" style={{ backgroundColor: '#f0fdf4' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tài Khoản Của Tôi</h1>
          <p className="text-gray-600 mt-1">Quản lý đặt phòng và khóa học</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-white" style={{ backgroundColor: '#2d6a4f' }}>
                  {user.name?.[0] || 'U'}
                </div>
                <h2 className="font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-500 text-sm">{user.email}</p>
                {user.phone && <p className="text-gray-500 text-sm">{user.phone}</p>}
              </div>

              <div className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium mb-4 ${roleColors[user.role]}`}>
                <RoleIcon className="w-4 h-4" />
                {roleLabels[user.role] ?? user.role}
              </div>

              <div className="space-y-2 text-sm">
                {/* Cổ đông Chính: popup tổng vốn */}
                {user.shareAmount > 0 && user.role === "SHAREHOLDER_MAIN" && (
                  <ShareCapitalPopup shareAmount={user.shareAmount} />
                )}

                {/* Cổ đông Shares: thông tin nhánh */}
                {user.role === "SHAREHOLDER_FOLLOW" && (
                  <div className="rounded-xl p-3 space-y-1.5" style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
                    <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#1d4ed8' }}>Nhánh Cổ Đông</div>
                    {user.parentShareholder ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Thuộc nhánh</span>
                          <span className="font-bold text-gray-900">{user.parentShareholder.name}</span>
                        </div>
                        {user.parentShareholder.shareAmount > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Vốn nhánh chính</span>
                            <span className="font-medium text-gray-900">{formatCurrency(user.parentShareholder.shareAmount)}</span>
                          </div>
                        )}
                        {user.shareAmount > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Bạn đóng</span>
                            <span className="font-bold" style={{ color: '#1d4ed8' }}>{formatCurrency(user.shareAmount)}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-xs text-gray-500">Đang chờ Admin phân nhánh</p>
                    )}
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-500">Tổng chi tiêu</span>
                  <span className="font-medium text-gray-900">{formatCurrency(confirmedSpent)}</span>
                </div>

                {user.courseDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Giảm giá khóa học</span>
                    <span className="font-medium text-green-600">{(user.courseDiscount * 100).toFixed(0)}%</span>
                  </div>
                )}

                {user.freeCoursesLeft > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Khóa học miễn phí</span>
                    <span className="font-medium text-green-600">{user.freeCoursesLeft} khóa</span>
                  </div>
                )}
              </div>

              {user.role === "MEMBER" && confirmedSpent < 10_000_000 && user.shareAmount === 0 && (
                <div className="mt-4 p-3 rounded-xl text-xs" style={{ backgroundColor: '#f0fdf4' }}>
                  <p className="text-gray-600">Chi tiêu {formatCurrency(10_000_000 - confirmedSpent)} nữa để lên <strong style={{ color: '#2d6a4f' }}>VIP</strong> và nhận giảm 30% tất cả khóa học + được đặt phòng miễn phí không hạn chế!</p>
                </div>
              )}
            </div>

            {/* Benefits */}
            {user.role !== "ADMIN" && (
              <MemberBenefitsPopup currentRole={user.role} />
            )}

            {/* Affiliate */}
            {user.affiliateCode && (
              <AffiliateCard code={user.affiliateCode} balance={user.affiliateBalance} />
            )}

            <div className="space-y-2">
              {user.role === "ADMIN" && (
                <Link href="/admin" className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-white font-medium text-sm bg-red-600 hover:bg-red-700">
                  <Settings className="w-4 h-4" /> Quản Trị Admin
                </Link>
              )}
              <Link href="/booking" className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-white font-medium text-sm" style={{ backgroundColor: '#2d6a4f' }}>
                <Home className="w-4 h-4" /> Đặt Phòng Mới
              </Link>
              <Link href="/booking/full-village" className="flex items-center gap-2 w-full px-4 py-3 rounded-xl font-medium text-sm border-2" style={{ borderColor: '#2d6a4f', color: '#2d6a4f' }}>
                <Home className="w-4 h-4" /> Thuê Nguyên Làng
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Notifications */}
            {notifications.length > 0 && (
              <div className="space-y-2">
                {notifications.map(n => (
                  <div key={n.id} className={`rounded-2xl px-5 py-4 border ${n.isPinned ? 'border-amber-200 bg-amber-50' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${n.isPinned ? 'bg-amber-100' : 'bg-green-50'}`}>
                        {n.isPinned ? <Pin className="w-4 h-4 text-amber-500" /> : <Bell className="w-4 h-4" style={{ color: '#2d6a4f' }} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-sm">{n.title}</div>
                        <p className="text-sm text-gray-600 mt-0.5 whitespace-pre-wrap">{n.content}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(n.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bookings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5" style={{ color: '#2d6a4f' }} /> Lịch Sử Đặt Phòng
                </h2>
                <span className="text-sm text-gray-500">{user.bookings.length} đặt phòng</span>
              </div>
              {user.bookings.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Chưa có đặt phòng nào</p>
                  <Link href="/booking" className="mt-3 inline-block text-sm font-medium" style={{ color: '#2d6a4f' }}>Đặt phòng ngay</Link>
                </div>
              ) : (
                <BookingList bookings={bookingsSerialized} userPhone={user.phone} />
              )}
            </div>

            {/* Course Enrollments */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" style={{ color: '#2d6a4f' }} /> Khóa Học Đã Đăng Ký
                </h2>
              </div>
              {user.courseEnrollments.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Chưa đăng ký khóa học nào</p>
                  <Link href="/#courses" className="mt-3 inline-block text-sm font-medium" style={{ color: '#2d6a4f' }}>Xem khóa học</Link>
                </div>
              ) : (
                <CourseEnrollmentList enrollments={enrollmentsSerialized} userPhone={user.phone} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
