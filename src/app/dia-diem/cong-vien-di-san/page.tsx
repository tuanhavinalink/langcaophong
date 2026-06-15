import Link from "next/link"
import { ArrowLeft, MapPin, Clock, Users, Star } from "lucide-react"

export const metadata = {
  title: "Công Viên Di Sản Cao Phong | Cách Làng 900m",
  description: "Không gian văn hóa lịch sử độc đáo tại Công Viên Di Sản Cao Phong — điểm tham quan văn hóa nổi bật, chỉ cách Làng Cao Phong 900m.",
  openGraph: {
    title: "Công Viên Di Sản Cao Phong | Làng Cao Phong",
    description: "Không gian văn hóa lịch sử độc đáo ngay gần Làng Cao Phong, Hòa Bình.",
    url: "https://langcaophong.com/dia-diem/cong-vien-di-san",
    siteName: "Làng Cao Phong",
    locale: "vi_VN",
    type: "website",
  },
}

export default function CongVienDiSanPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-72 md:h-96 overflow-hidden" style={{ background: 'linear-gradient(135deg, #78350f 0%, #92400e 60%, #fbbf24 100%)' }}>
        <img src="/z7264667266760_1522b2ec6eb59e06a4df0abfbb273c1f.jpg" alt="Công Viên Di Sản" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm"><ArrowLeft className="w-4 h-4" /> Trang chủ</Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3 bg-amber-500/30 text-amber-100 border border-amber-400/30">
            <MapPin className="w-3 h-3" /> Cách Làng 900m
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white">🏛️ Công Viên Di Sản</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: MapPin, label: "Khoảng cách", value: "900m từ Làng" },
            { icon: Clock, label: "Thời gian tham quan", value: "1 – 2 giờ" },
            { icon: Users, label: "Phù hợp", value: "Gia đình, học sinh" },
          ].map(i => (
            <div key={i.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#fef3c7' }}>
                <i.icon className="w-5 h-5" style={{ color: '#92400e' }} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{i.label}</p>
                <p className="font-semibold text-gray-900 text-sm">{i.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Giới Thiệu</h2>
          <div className="space-y-3 text-gray-600 leading-relaxed">
            <p>Công Viên Di Sản là không gian văn hóa lịch sử độc đáo nằm ngay trong vùng Cao Phong, cách Làng Cao Phong chỉ 900m — đi bộ thong thả dưới 15 phút.</p>
            <p>Đây là điểm đến lý tưởng để tìm hiểu về di sản văn hóa, lịch sử và nếp sống truyền thống của người dân vùng cao Hòa Bình. Không gian được thiết kế kết hợp hài hòa giữa thiên nhiên và các hiện vật văn hóa bản địa.</p>
            <p>Công viên còn là điểm check-in nổi tiếng với nhiều góc chụp ảnh độc đáo giữa kiến trúc truyền thống và cảnh quan thiên nhiên núi rừng.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trải Nghiệm Tại Đây</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {["Tham quan không gian văn hóa lịch sử", "Khám phá hiện vật và di sản bản địa", "Chụp ảnh giữa kiến trúc truyền thống", "Tìm hiểu văn hóa người Mường – Hòa Bình", "Đi dạo trong không gian thiên nhiên xanh mát", "Picnic và thư giãn cuối tuần cùng gia đình"].map(a => (
              <div key={a} className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: '#fffbeb' }}>
                <Star className="w-4 h-4 shrink-0" style={{ color: '#92400e' }} />
                <span className="text-sm text-gray-700">{a}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-700 to-amber-900 rounded-2xl p-6 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Khám Phá Di Sản Văn Hóa</h3>
          <p className="text-amber-200 text-sm mb-5">Chỉ cách Làng Cao Phong 900m — đi bộ 12 phút</p>
          <Link href="/booking" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-white" style={{ color: '#92400e' }}>
            Book Phòng & Tham Quan
          </Link>
        </div>
      </div>
    </div>
  )
}
