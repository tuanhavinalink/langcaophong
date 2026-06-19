import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"

const courseDescriptions: Record<string, string> = {
  "vi-mo": "Hiểu bức tranh kinh tế vĩ mô, đầu tư thông minh và tư duy chiến lược dài hạn. Khóa học 2 ngày 1 đêm tại Làng Cao Phong — Hòa Bình, cách Hà Nội 80km.",
  "solo": "Vận hành doanh nghiệp 1 người bằng AI. Tìm 350 ngách siêu kiếm tiền trong 7 ngày. Học trực tiếp với thầy Tuấn Hà (Mentor SharkTank) tại Làng Cao Phong.",
  "detox-sam": "Detox thân tâm, thiền Gosinga, ăn thực dưỡng Sâm và học trồng Sâm kinh tế cao. 5 ngày 4 đêm tại Làng Cao Phong — Hòa Bình.",
  "trai-he": "Trại Hè Sáng Tạo Harvard dành cho trẻ 10–17 tuổi. Học 7 phương pháp SCAMPER, khởi nghiệp Junior Startup, thăm Công viên Di sản & Trang Trại. Thầy Tuấn Hà – Mentor SharkTank VN.",
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const course = await prisma.course.findUnique({ where: { slug }, select: { name: true, description: true } })
  if (!course) return {}
  const desc = courseDescriptions[slug] || course.description || ""
  return {
    title: `${course.name} | Làng Cao Phong`,
    description: desc,
    openGraph: {
      title: `${course.name} | Làng Cao Phong`,
      description: desc,
      url: `https://langcaophong.com/courses/${slug}`,
      siteName: "Làng Cao Phong",
      locale: "vi_VN",
      type: "website",
    },
  }
}
import { Clock, Users, Star, Check, BookOpen, ArrowLeft, User, Gift, Calendar } from "lucide-react"
import EnrollButton from "@/components/EnrollButton"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

const gradients: Record<string, string> = {
  "vi-mo": "from-blue-600 to-cyan-500",
  "solo": "from-purple-500 to-pink-500",
  "detox-sam": "from-green-500 to-emerald-500",
  "trai-he": "from-orange-400 to-amber-500",
}

const fixedSchedules: Record<string, string[]> = {
  "vi-mo": ["20 – 21/06/2026", "04 – 05/07/2026"],
  "solo": ["27 – 28/06/2026"],
  "trai-he": ["13 – 17/07/2026"],
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await auth()
  const userId = session?.user ? (session.user as any).id : null

  const course = await prisma.course.findUnique({ where: { slug } })
  if (!course) notFound()

  const benefits: string[] = course.benefits ? JSON.parse(course.benefits) : []
  const curriculum: string[] = course.curriculum ? JSON.parse(course.curriculum) : []
  const scheduleData = course.schedule ? JSON.parse(course.schedule) : null
  const registerOptions = scheduleData?.options || []

  const existingEnrollment = userId
    ? await prisma.courseEnrollment.findFirst({ where: { userId, courseId: course.id } })
    : null

  // Đếm tổng lần đăng ký không bị hủy (để track free slot CĐ Chính)
  const priorEnrollmentCount = userId
    ? await prisma.courseEnrollment.count({
        where: { userId, courseId: course.id, status: { not: "CANCELLED" } }
      })
    : 0

  const user = userId ? await prisma.user.findUnique({ where: { id: userId }, select: { freeCoursesLeft: true, courseDiscount: true, phone: true, role: true } }) : null

  const gradient = gradients[slug] || "from-green-500 to-emerald-600"
  const schedules = fixedSchedules[slug] || []

  // finalPrice chỉ dùng cho EnrollButton (VIP -30%, role khác = giá gốc)
  const finalPrice = user?.role === "VIP" ? Math.round(course.price * 0.7) : course.price

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className={`bg-gradient-to-br ${gradient} py-20`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/#courses" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </Link>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 bg-white/20">
                <BookOpen className="w-3 h-3" /> Khóa Học Đặc Biệt
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{course.name}</h1>
              <p className="text-white/90 text-lg leading-relaxed mb-6">{course.description}</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">
                  <Clock className="w-4 h-4" /> {course.duration}
                </span>
                <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">
                  <Users className="w-4 h-4" /> Tối đa {course.maxStudents} học viên
                </span>
                {course.instructor && (
                  <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">
                    <User className="w-4 h-4" /> {course.instructor}
                  </span>
                )}
              </div>
              {schedules.length > 0 && (
                <div className="mt-6 rounded-2xl overflow-hidden border border-white/30 inline-block">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white text-sm font-semibold">
                    <Calendar className="w-4 h-4" /> Lịch học gần nhất
                  </div>
                  {schedules.map((s, i) => (
                    <div key={i} className="px-4 py-2.5 text-white font-medium text-sm bg-white/10 border-t border-white/20">
                      📅 {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="text-center mb-5">
                <p className="text-gray-500 text-sm mb-1">
                  {slug === "trai-he" ? "Học phí gói đầy đủ (5 ngày)" : "Học phí ăn ở tại Làng"}
                </p>
                <div className="text-4xl font-bold mb-1" style={{ color: '#2d6a4f' }}>{formatCurrency(course.price)}</div>
                {slug === "trai-he" && (
                  <p className="text-xs text-gray-400 mt-1">Gói cơ bản từ 3.000.000 đ — xem chi tiết bên dưới</p>
                )}
              </div>

              {/* Register options */}
              {registerOptions.length > 0 && (
                <div className="mb-4 space-y-2">
                  {registerOptions.map((opt: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-sm px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="text-gray-700 font-medium">{opt.type}</span>
                      <span style={{ color: opt.price ? '#2d6a4f' : '#6b7280' }} className="font-semibold">
                        {opt.price ? formatCurrency(opt.price) : (opt.label || "Liên hệ")}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Role pricing badge — hiển thị ngoài form */}
              {user?.role === "SHAREHOLDER_MAIN" && (
                <div className="mb-3 rounded-xl p-3 text-sm space-y-1" style={{ backgroundColor: '#f5f3ff', border: '1.5px solid #e9d5ff' }}>
                  <div className="font-semibold" style={{ color: '#7c3aed' }}>👑 Quyền lợi Cổ đông Chính</div>
                  {priorEnrollmentCount === 0 ? (
                    <>
                      <div className="text-gray-600">Người 1: <strong className="text-green-700">Miễn phí</strong> (1 lần/khóa học)</div>
                      <div className="text-gray-600">Người 2 trở đi: <strong style={{ color: '#7c3aed' }}>-50% = {formatCurrency(Math.round(course.price * 0.5))}/người</strong></div>
                    </>
                  ) : (
                    <div className="text-gray-600">Đã dùng suất miễn phí · Lần này: <strong style={{ color: '#7c3aed' }}>-50% = {formatCurrency(Math.round(course.price * 0.5))}/người</strong></div>
                  )}
                </div>
              )}
              {user?.role === "SHAREHOLDER_FOLLOW" && (
                <div className="mb-3 rounded-xl p-3 text-sm space-y-1" style={{ backgroundColor: '#eff6ff', border: '1.5px solid #bfdbfe' }}>
                  <div className="font-semibold text-blue-700">🤝 Quyền lợi Cổ đông Shares</div>
                  <div className="text-gray-600">Lên Làng (offline): <strong className="text-blue-700">-50% = {formatCurrency(Math.round(course.price * 0.5))}/người</strong></div>
                  <div className="text-gray-600">Online / Zoom: <strong className="text-green-700">Miễn phí</strong></div>
                </div>
              )}
              {user?.role === "VIP" && (
                <div className="mb-3 rounded-xl p-3 text-sm space-y-1" style={{ backgroundColor: '#fefce8', border: '1.5px solid #fde68a' }}>
                  <div className="font-semibold text-yellow-700">⭐ Quyền lợi VIP</div>
                  <div className="text-gray-600">Giảm <strong className="text-yellow-700">30%</strong> — chỉ còn <strong className="text-green-700">{formatCurrency(Math.round(course.price * 0.7))}/người</strong></div>
                </div>
              )}

              <EnrollButton
                courseId={course.id}
                courseName={course.name}
                slug={slug}
                isLoggedIn={!!userId}
                existingEnrollment={existingEnrollment ? { id: existingEnrollment.id, status: existingEnrollment.status } : null}
                finalPrice={finalPrice}
                userPhone={user?.phone ?? null}
                userRole={user?.role ?? null}
                basePrice={course.price}
                usedFreeSlot={priorEnrollmentCount > 0}
              />

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600 shrink-0" /> Bao gồm chỗ ở & ăn uống tại Làng
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600 shrink-0" /> Coaching 1-1 miễn phí
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600 shrink-0" /> Có thể học Online (LMS / Zoom)
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600 shrink-0" /> Chứng nhận hoàn thành khóa học
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Video embed — vi-mo only */}
            {slug === "vi-mo" && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src="https://www.youtube.com/embed/-OxuDA0mx-Y"
                    title="Giới thiệu Khóa Học Vĩ Mô"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {curriculum.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <BookOpen className="w-6 h-6" style={{ color: '#2d6a4f' }} /> Chương Trình
                </h2>
                <div className="space-y-3">
                  {curriculum.map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-green-200 transition-colors">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ backgroundColor: '#2d6a4f' }}>{i + 1}</div>
                      <div className="pt-1"><span className="text-gray-800 font-medium leading-relaxed">{item}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {schedules.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Calendar className="w-6 h-6" style={{ color: '#2d6a4f' }} /> Lịch Học
                </h2>
                <div className="space-y-3">
                  {schedules.map((s, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100" style={{ backgroundColor: '#f0fdf4' }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ backgroundColor: '#2d6a4f' }}>{i + 1}</div>
                      <div>
                        <div className="font-semibold text-gray-900">📅 {s}</div>
                        <div className="text-sm text-gray-500 mt-0.5">{course.duration} tại Làng Cao Phong</div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-4">* Đăng ký sớm để giữ chỗ, số lượng có hạn mỗi khóa.</p>
              </div>
            )}

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">📍 Địa Điểm Tổ Chức</h2>
              <p className="text-gray-700 font-semibold text-lg mb-1">Làng Cao Phong - Hòa Bình</p>
              <p className="text-gray-600 text-sm">Cách Hà Nội 80km • Giữa sông, núi và hồ trong thung lũng</p>
              <div className="mt-3 flex gap-3 text-sm flex-wrap">
                <span className="px-3 py-1.5 bg-white rounded-full text-gray-700 border border-blue-100">🌿 Không khí trong lành</span>
                <span className="px-3 py-1.5 bg-white rounded-full text-gray-700 border border-blue-100">🏡 Bungalow & Glamping</span>
                <span className="px-3 py-1.5 bg-white rounded-full text-gray-700 border border-blue-100">🍽️ Ăn sạch tại chỗ</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {benefits.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5" style={{ color: '#2d6a4f' }} /> Bạn Sẽ Nhận Được
                </h2>
                <div className="space-y-2">
                  {benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl" style={{ backgroundColor: '#f0fdf4' }}>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: '#d1fae5' }}>
                        <Check className="w-3 h-3" style={{ color: '#2d6a4f' }} />
                      </div>
                      <span className="text-gray-700 text-sm font-medium">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Thông Tin Khóa Học</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Thời lượng</span><span className="font-medium text-gray-900">{course.duration}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Sĩ số</span><span className="font-medium text-gray-900">{course.maxStudents} người</span></div>
                {course.instructor && <div className="flex justify-between"><span className="text-gray-500">Giảng viên</span><span className="font-medium text-gray-900 text-right max-w-[140px]">{course.instructor}</span></div>}
                <div className="flex justify-between border-t pt-3"><span className="text-gray-500">Học phí</span><span className="font-bold text-lg" style={{ color: '#2d6a4f' }}>{formatCurrency(course.price)}</span></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-4 border border-yellow-100 text-center">
              <div className="flex justify-center gap-1 mb-2">{[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}</div>
              <p className="text-sm font-semibold text-gray-800">4.9/5 từ học viên</p>
              <p className="text-xs text-gray-500 mt-1">"Thay đổi cách nhìn hoàn toàn về đầu tư"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
