import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Clock, Users, Star, Check, BookOpen, ArrowLeft, User } from "lucide-react"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

const gradients: Record<string, string> = {
  "vi-mo": "from-blue-500 to-cyan-500",
  "solo": "from-purple-500 to-pink-500",
  "detox-sam": "from-green-500 to-emerald-500",
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = await prisma.course.findUnique({ where: { slug } })
  if (!course) notFound()

  const benefits: string[] = course.benefits ? JSON.parse(course.benefits) : []
  const curriculum: string[] = course.curriculum ? JSON.parse(course.curriculum) : []
  const gradient = gradients[slug] || "from-green-500 to-emerald-600"
  const discount = course.originalPrice ? Math.round((1 - course.price / course.originalPrice) * 100) : 0

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
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.name}</h1>
              <p className="text-white/90 text-lg leading-relaxed mb-6">{course.description}</p>
              <div className="flex flex-wrap gap-4 text-sm">
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
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold mb-1" style={{ color: '#2d6a4f' }}>{formatCurrency(course.price)}</div>
                {course.originalPrice && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-gray-400 line-through text-lg">{formatCurrency(course.originalPrice)}</span>
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-sm rounded-lg font-medium">-{discount}%</span>
                  </div>
                )}
              </div>
              <Link
                href="/booking"
                className="block w-full text-center py-4 rounded-xl text-white font-semibold text-lg mb-3 transition-all hover:opacity-90"
                style={{ backgroundColor: '#2d6a4f' }}
              >
                Đặt Phòng Kết Hợp
              </Link>
              <p className="text-center text-gray-500 text-sm">Cần đăng nhập để đăng ký khóa học</p>
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600" /> Bao gồm chỗ ở và ăn uống
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600" /> Tài liệu học tập
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600" /> Chứng chỉ hoàn thành
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600" /> Networking cùng cộng đồng
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
            {/* Benefits */}
            {benefits.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-6 h-6" style={{ color: '#2d6a4f' }} />
                  Bạn Sẽ Nhận Được
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: '#f0fdf4' }}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: '#d1fae5' }}>
                        <Check className="w-3.5 h-3.5" style={{ color: '#2d6a4f' }} />
                      </div>
                      <span className="text-gray-700 text-sm font-medium">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum */}
            {curriculum.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6" style={{ color: '#2d6a4f' }} />
                  Chương Trình Học
                </h2>
                <div className="space-y-3">
                  {curriculum.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-gray-100">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ backgroundColor: '#2d6a4f' }}>
                        {i + 1}
                      </div>
                      <div className="pt-1">
                        <span className="text-gray-800 font-medium">{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Thông Tin Khóa Học</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Thời lượng</span>
                  <span className="font-medium text-gray-900">{course.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Sĩ số tối đa</span>
                  <span className="font-medium text-gray-900">{course.maxStudents} người</span>
                </div>
                {course.instructor && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Giảng viên</span>
                    <span className="font-medium text-gray-900">{course.instructor}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Học phí</span>
                  <span className="font-bold" style={{ color: '#2d6a4f' }}>{formatCurrency(course.price)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3">Liên Hệ Đăng Ký</h3>
              <p className="text-sm text-gray-600 mb-4">Liên hệ ngay để được tư vấn và đặt chỗ sớm nhất</p>
              <a
                href="tel:0900000000"
                className="block w-full text-center py-3 rounded-xl font-medium border-2 mb-3 transition-colors hover:bg-green-50"
                style={{ borderColor: '#2d6a4f', color: '#2d6a4f' }}
              >
                Gọi: 0900 000 000
              </a>
              <a
                href="mailto:hello@langcaophong.vn"
                className="block w-full text-center py-3 rounded-xl font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Email tư vấn
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
