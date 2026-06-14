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
    desc: "Hiểu bức tranh kinh tế vĩ mô, đầu tư thông minh và tư duy chiến lược dài hạn",
    duration: "3 ngày 2 đêm",
    price: 8500000,
    originalPrice: 12000000,
    icon: Brain,
    color: "from-blue-500 to-cyan-500",
  },
  {
    slug: "solo",
    name: "Khóa Học SOLO",
    desc: "Đào tạo Solopreneur - kinh doanh một mình hiệu quả trong thời đại số",
    duration: "5 ngày 4 đêm",
    price: 15000000,
    originalPrice: 20000000,
    icon: BookOpen,
    color: "from-purple-500 to-pink-500",
  },
  {
    slug: "detox-sam",
    name: "Detox Thân Tâm & Trồng Sâm",
    desc: "Detox toàn diện thân-tâm-trí, học trồng Sâm Ngọc Linh và ẩm thực dưỡng sinh",
    duration: "7 ngày 6 đêm",
    price: 18000000,
    originalPrice: 25000000,
    icon: Leaf,
    color: "from-green-500 to-emerald-500",
  },
]

const landmarks = [
  { name: "Hồ Thung Nai", desc: "Hồ nước trong xanh giữa thung lũng, kayak và câu cá", distance: "5km" },
  { name: "Ruộng Bậc Thang Cao Phong", desc: "Những thửa ruộng bậc thang đẹp như tranh vẽ", distance: "2km" },
  { name: "Vườn Cam Cao Phong", desc: "Vùng cam đặc sản nổi tiếng, thu hoạch tháng 11-1", distance: "3km" },
  { name: "Hang Mỡ - Hang Thẩm Lé", desc: "Hệ thống hang động kỳ bí, khám phá thiên nhiên hoang sơ", distance: "15km" },
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
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')` }}
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
            Khu nghỉ dưỡng sinh thái ôm trọn khung cảnh sông núi, mây trời và hồ thung lũng.
            Không gian hoàn hảo để tái tạo năng lượng và kết nối với thiên nhiên.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="px-8 py-4 rounded-full font-semibold text-lg transition-all hover:opacity-90 shadow-lg"
              style={{ backgroundColor: '#2d6a4f', color: 'white' }}
            >
              Đặt Phòng Ngay
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
                Thiên Đường Xanh<br />
                <span style={{ color: '#2d6a4f' }}>Giữa Lòng Hòa Bình</span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Làng Cao Phong tọa lạc tại vùng đất Cao Phong, Hòa Bình — nơi hội tụ của sông, núi, mây trời và hồ thung lũng thơ mộng. Cách Hà Nội chỉ 80km, nhưng đây là một thế giới hoàn toàn khác.
                </p>
                <p>
                  Chúng tôi xây dựng không gian nghỉ dưỡng hòa mình vào thiên nhiên với bungalow, glamping, villa song lập cùng các khóa học nâng cao đời sống tinh thần và sự nghiệp.
                </p>
                <p>
                  Mỗi góc của Làng Cao Phong đều được thiết kế để mang lại sự thư thái tối đa, từ nhà hàng ẩm thực dưỡng sinh, bến kayak trên hồ đến không gian thiền định giữa rừng núi.
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
                  <img src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80" alt="Núi rừng" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden h-32">
                  <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80" alt="Rừng xanh" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="rounded-2xl overflow-hidden h-32">
                  <img src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&q=80" alt="Hồ núi" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden h-48">
                  <img src="https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=400&q=80" alt="Sông núi" className="w-full h-full object-cover" />
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
                  <div className="flex items-center gap-2 text-green-300 text-sm mb-4">
                    <Star className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold" style={{ color: '#95d5b2' }}>{formatCurrency(course.price)}</div>
                      <div className="text-green-400 line-through text-sm">{formatCurrency(course.originalPrice)}</div>
                    </div>
                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-lg font-medium">
                      -{Math.round((1 - course.price / course.originalPrice) * 100)}%
                    </span>
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
              <div key={lm.name} className="p-6 rounded-2xl border border-green-100 shadow-sm card-hover">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5" style={{ color: '#2d6a4f' }} />
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full text-green-700 bg-green-100">{lm.distance}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{lm.name}</h3>
                <p className="text-sm text-gray-600">{lm.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20" style={{ backgroundColor: '#f0fdf4' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Vị Trí <span style={{ color: '#2d6a4f' }}>Làng Cao Phong</span></h2>
            <p className="text-gray-600">Cao Phong, Hòa Bình · 80km từ trung tâm Hà Nội</p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d238623.77032882893!2d105.24!3d20.72!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134fac5bfe1b759%3A0x4052086b67a9ea34!2sCao%20Phong%2C%20H%C3%B2a%20B%C3%ACnh!5e0!3m2!1svi!2svn!4v1700000000000"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bản đồ Làng Cao Phong"
            />
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
