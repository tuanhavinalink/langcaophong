import Link from "next/link"
import {
  Mountain, TreePine, Waves, Cloud, Star, MapPin, Phone, Mail,
  ArrowRight, ChevronRight, Home, Tent, Building2,
  Anchor, Car, DoorOpen, Utensils, Dumbbell,
  BookOpen, Leaf, Brain
} from "lucide-react"


const courses = [
  {
    slug: "vi-mo",
    name: "Khóa Học Vĩ Mô",
    desc: "Hiểu bức tranh kinh tế vĩ mô, đầu tư thông minh và tư duy chiến lược dài hạn. Học phí miễn phí, chỉ trả chi phí ăn ở tại Làng.",
    duration: "2 ngày 1 đêm",
    price: 2300000,
    originalPrice: null,
    icon: Brain,
    color: "from-blue-500 to-cyan-500",
    schedules: ["20 – 21/06/2026", "04 – 05/07/2026"],
  },
  {
    slug: "solo",
    name: "Khóa Học Solopreneur (OPC)",
    desc: "Vận hành doanh nghiệp 1 người bằng AI — Tìm 350 ngách siêu kiếm tiền trong 7 ngày — Học trực tiếp với thầy Tuấn Hà.",
    duration: "2 ngày 1 đêm",
    price: 2300000,
    originalPrice: null,
    icon: BookOpen,
    color: "from-purple-500 to-pink-500",
    schedules: ["27 – 28/06/2026"],
  },
  {
    slug: "detox-sam",
    name: "Detox Thân Tâm & Trồng Sâm",
    desc: "3 trụ cột Thân Khỏe – Tâm An – Tiền Nhiều. Ăn thực dưỡng Sâm, thiền Gosinga, học trồng Sâm có giá trị kinh tế cao.",
    duration: "5 ngày 4 đêm",
    price: 3300000,
    originalPrice: null,
    icon: Leaf,
    color: "from-green-500 to-emerald-500",
    schedules: [],
  },
]

const landmarks = [
  { slug: "trang-trai-ha-an", name: "Trang Trại Hà An", desc: "Farm trang trại tiêu biểu ngay cạnh Làng, trải nghiệm nông nghiệp sạch và thiên nhiên", distance: "200m", icon: "🌿" },
  { slug: "dong-thien-duong", name: "Động Thiên Đường – Đền Bồng Lai", desc: "Hang động hùng vĩ và đền thiêng nổi tiếng vùng Cao Phong", distance: "5km", icon: "⛩️" },
  { slug: "cong-vien-di-san", name: "Công Viên Di Sản", desc: "Không gian văn hóa lịch sử độc đáo ngay gần Làng Cao Phong", distance: "900m", icon: "🏛️" },
  { slug: "san-may-vuon-hong", name: "Săn Mây Vườn Hồng", desc: "Điểm check-in săn mây tuyệt đẹp giữa vườn hồng bốn mùa", distance: "2,5km", icon: "🌸" },
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/z7056126901427_4b21cec6241c5f5ef1637af674801c17.jpg')` }}
        />
        <div className="absolute inset-0 hero-gradient" />

        <div className="absolute top-20 left-10 opacity-20">
          <Cloud className="w-16 h-16 text-white animate-pulse" />
        </div>
        <div className="absolute top-32 right-20 opacity-20">
          <Mountain className="w-20 h-20 text-white" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-green-300/50 bg-green-900/30 backdrop-blur-sm">
            <MapPin className="w-4 h-4" style={{ color: '#95d5b2' }} />
            <span style={{ color: '#95d5b2' }}>Hòa Bình · Cách Hà Nội 80km</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Làng Cao Phong
          </h1>
          <p className="text-2xl sm:text-3xl font-light mb-4" style={{ color: '#95d5b2' }}>
            Chốn Bình Yên Giữa Núi Rừng
          </p>
          <p className="text-lg text-green-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Khu Làng Nghỉ dưỡng duy nhất trên Thế giới <strong className="text-white">Miễn phí đặt phòng qua đêm</strong> dành cho Cư dân Làng và khách mời — Đăng ký thành viên để được Booking miễn phí.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="px-8 py-4 rounded-full font-semibold text-lg transition-all hover:opacity-90 shadow-lg"
              style={{ backgroundColor: '#d97706', color: 'white' }}
            >
              🏡 Book Phòng Miễn Phí
            </Link>
            <Link
              href="/kham-pha-lang"
              className="px-8 py-4 rounded-full font-semibold text-lg border-2 border-white/70 text-white hover:bg-white/20 transition-all"
            >
              Khám Phá Làng
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-16">
            {[
              { number: "16+", label: "Phòng Bungalow" },
              { number: "6", label: "Lều Glamping" },
              { number: "2", label: "Villa Song Lập" },
              { number: "3", label: "Khóa Học" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold" style={{ color: '#95d5b2' }}>{stat.number}</div>
                <div className="text-sm text-green-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/70 rounded-full" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 text-green-800 bg-green-100">
                <Leaf className="w-4 h-4" />
                Về Chúng Tôi
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Khu Làng Doanh Nhân<br />
                <span style={{ color: '#2d6a4f' }}>Phong Cách Châu Âu Giữa Núi Rừng Hòa Bình</span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Làng Cao Phong là khu làng được các cư dân chung tay xây dựng — phòng nghỉ đạt tiêu chuẩn du lịch được <strong className="text-gray-800">Tổng cục Du lịch xếp hạng Sao</strong>, với công suất lên tới <strong className="text-gray-800">50 khách ở miễn phí</strong> qua đêm.
                </p>
                <p>
                  Bạn chỉ cần TIP tiền WC + thay chăn ga gối cho bà con xứ Mường — bạn sẽ được sở hữu phòng nghỉ tiêu chuẩn gia đình 2 giường miễn phí. Tự nấu ăn, hái Sâm miễn phí trong Làng, hoặc book dịch vụ ăn uống & lửa trại của bà con Mường cho sự kiện.
                </p>
                <p>
                  Công ty hay tổ chức có thể <strong className="text-gray-800">Team Building & Đào tạo nội bộ</strong> riêng biệt cả khu khi book trọn Làng — dễ dàng, linh hoạt, độc đáo.
                </p>
              </div>
              <div className="flex gap-4 mt-8">
                <Link href="/booking" className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium" style={{ backgroundColor: '#2d6a4f' }}>
                  Đặt Phòng <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="#contact" className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium border-2" style={{ borderColor: '#2d6a4f', color: '#2d6a4f' }}>
                  Liên Hệ
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden h-48">
                  <img src="/z7056127181688_6230a0ef5607b1659885219b5a435698.jpg" alt="Làng Cao Phong" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden h-32">
                  <img src="/z7264667266760_1522b2ec6eb59e06a4df0abfbb273c1f.jpg" alt="Làng Cao Phong" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="rounded-2xl overflow-hidden h-32">
                  <img src="/z7452915816520_a8f81d70379add2ede0d6d8c65858670.jpg" alt="Làng Cao Phong" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden h-48">
                  <img src="/z6847239039731_003_dcad8b1d6cb6a013db846a5c659a7c11.jpg" alt="Làng Cao Phong" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16" style={{ backgroundColor: '#f0fdf4' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Mountain, title: "Núi Rừng Hùng Vĩ", desc: "Bao quanh bởi dãy núi Hòa Bình" },
              { icon: Waves, title: "Sông & Hồ Thung Lũng", desc: "Cảnh sắc nên thơ, yên bình" },
              { icon: Cloud, title: "Mây Trời Bồng Bềnh", desc: "Khí hậu mát mẻ quanh năm" },
              { icon: TreePine, title: "Sinh Thái Thuần Khiết", desc: "Không khí trong lành, thiên nhiên nguyên sơ" },
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#d1fae5' }}>
                  <item.icon className="w-7 h-7" style={{ color: '#2d6a4f' }} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="py-20" style={{ backgroundColor: '#1b4332' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-green-800 text-green-200">
              <BookOpen className="w-4 h-4" />
              Khóa Học Đặc Biệt
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Học Tập Giữa <span style={{ color: '#95d5b2' }}>Thiên Nhiên</span>
            </h2>
            <p className="text-green-200 max-w-2xl mx-auto">
              Các khóa học độc đáo kết hợp kiến thức chuyên sâu với trải nghiệm thiền định và hòa mình vào thiên nhiên Cao Phong
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.slug} className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 card-hover group">
                <div className={`h-40 bg-gradient-to-br ${course.color} flex items-center justify-center`}>
                  <course.icon className="w-16 h-16 text-white opacity-80" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{course.name}</h3>
                  <p className="text-green-200 text-sm mb-4 leading-relaxed">{course.desc}</p>
                  <div className="flex items-center gap-2 text-green-300 text-sm mb-3">
                    <Star className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  {course.schedules.length > 0 && (
                    <div className="mb-4 rounded-xl overflow-hidden border border-white/20">
                      <div className="px-3 py-1.5 text-xs font-semibold text-green-300 uppercase tracking-wide bg-white/10">🗓 Lịch học gần nhất</div>
                      {course.schedules.map((s, i) => (
                        <div key={i} className="px-3 py-2 text-sm text-white font-medium bg-white/5 border-t border-white/10">
                          {s}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold" style={{ color: '#95d5b2' }}>{formatCurrency(course.price)}</div>
                      {course.originalPrice && (
                        <div className="text-green-400 line-through text-sm">{formatCurrency(course.originalPrice)}</div>
                      )}
                    </div>
                    {course.originalPrice && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-lg font-medium">
                        -{Math.round((1 - course.price / course.originalPrice) * 100)}%
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium"
                    style={{ backgroundColor: '#2d6a4f', color: 'white' }}
                  >
                    Xem Chi Tiết <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Landmarks */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 text-green-800 bg-green-100">
              <MapPin className="w-4 h-4" />
              Điểm Tham Quan
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Khám Phá <span style={{ color: '#2d6a4f' }}>Vùng Đất Cao Phong</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {landmarks.map((lm) => (
              <Link key={lm.name} href={`/dia-diem/${lm.slug}`} className="group p-6 rounded-2xl border border-green-100 shadow-sm card-hover hover:border-green-300 transition-all block">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{lm.icon}</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full text-green-700 bg-green-100">{lm.distance}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">{lm.name}</h3>
                <p className="text-sm text-gray-600">{lm.desc}</p>
                <div className="mt-3 text-xs font-medium flex items-center gap-1" style={{ color: '#2d6a4f' }}>
                  Xem chi tiết <ChevronRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-20" style={{ backgroundColor: '#2d6a4f' }}>
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Sẵn Sàng Trải Nghiệm?</h2>
          <p className="text-xl text-green-200 mb-8">
            Đặt phòng ngay hôm nay và nhận ưu đãi đặc biệt. Chúng tôi sẽ chuẩn bị không gian nghỉ dưỡng hoàn hảo cho bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="px-8 py-4 rounded-full font-semibold text-lg bg-white transition-all hover:opacity-90 shadow-lg"
              style={{ color: '#2d6a4f' }}
            >
              Đặt Phòng Ngay
            </Link>
            <Link
              href="/booking/full-village"
              className="px-8 py-4 rounded-full font-semibold text-lg border-2 border-white/70 text-white hover:bg-white/20 transition-all"
            >
              Thuê Nguyên Làng
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-green-200 text-sm">
            <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> Hoàng Nga: 0986 655 894</span>
            <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> langcaophong@gmail.com</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Xóm Môn, Cao Phong, Hòa Bình</span>
          </div>
        </div>
      </section>
    </div>
  )
}
