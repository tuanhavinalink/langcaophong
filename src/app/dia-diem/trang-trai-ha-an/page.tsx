import Link from "next/link"
import { ArrowLeft, MapPin, Clock, Users, Star } from "lucide-react"

export const metadata = {
  title: "Trang Trại Hà An – Farm Sạch Cạnh Làng Cao Phong | Cách 200m",
  description: "Trang Trại Hà An — farm nông nghiệp sạch tiêu biểu ngay cạnh Làng Cao Phong. Trải nghiệm hái rau, trồng Sâm và không khí đồng quê thuần Việt.",
  openGraph: {
    title: "Trang Trại Hà An | Làng Cao Phong",
    description: "Farm trang trại sạch ngay cạnh Làng Cao Phong — trải nghiệm nông nghiệp và thiên nhiên đặc sắc.",
    url: "https://langcaophong.com/dia-diem/trang-trai-ha-an",
    siteName: "Làng Cao Phong",
    locale: "vi_VN",
    type: "website",
  },
}

export default function TrangTraiHaAnPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-72 md:h-96 overflow-hidden" style={{ background: 'linear-gradient(135deg, #166534 0%, #2d6a4f 60%, #4ade80 100%)' }}>
        <img src="/z7452915816520_a8f81d70379add2ede0d6d8c65858670.jpg" alt="Trang Trại Hà An" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm"><ArrowLeft className="w-4 h-4" /> Trang chủ</Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3 bg-green-500/30 text-green-100 border border-green-400/30">
            <MapPin className="w-3 h-3" /> Cách Làng 200m
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white">🌿 Trang Trại Hà An</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: MapPin, label: "Khoảng cách", value: "200m từ Làng" },
            { icon: Clock, label: "Thời gian tham quan", value: "1 – 3 giờ" },
            { icon: Users, label: "Phù hợp", value: "Gia đình, nhóm" },
          ].map(i => (
            <div key={i.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#d1fae5' }}>
                <i.icon className="w-5 h-5" style={{ color: '#2d6a4f' }} />
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
            <p>Trang trại Hà An là farm nông nghiệp sạch tiêu biểu, nằm ngay sát cạnh Làng Cao Phong chỉ cách 200m. Đây là mô hình trang trại kết hợp trải nghiệm du lịch nông nghiệp độc đáo.</p>
            <p>Du khách có thể trực tiếp tham gia các hoạt động: thu hoạch rau sạch, tìm hiểu quy trình canh tác hữu cơ, trải nghiệm cuộc sống nông thôn thuần Việt giữa không gian trong lành của vùng cao Hòa Bình.</p>
            <p>Trang trại cũng là nơi cung cấp nguồn thực phẩm sạch trực tiếp cho bếp ăn của Làng Cao Phong — đảm bảo mỗi bữa ăn tại đây đều từ vườn trang trại tươi ngon nhất.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hoạt Động Tại Trang Trại</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {["Thu hoạch rau củ quả hữu cơ", "Tham quan quy trình canh tác sạch", "Trải nghiệm cuộc sống nông dân", "Chụp ảnh giữa vườn rau xanh mát", "Mua nông sản tươi trực tiếp", "Học kỹ thuật trồng Sâm và cây dược liệu"].map(a => (
              <div key={a} className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: '#f0fdf4' }}>
                <Star className="w-4 h-4 shrink-0" style={{ color: '#2d6a4f' }} />
                <span className="text-sm text-gray-700">{a}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-2xl p-6 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Đến Tham Quan Ngay</h3>
          <p className="text-green-200 text-sm mb-5">Chỉ cách Làng Cao Phong 200m — đi bộ 3 phút</p>
          <Link href="/booking" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-white" style={{ color: '#2d6a4f' }}>
            Book Phòng & Tham Quan
          </Link>
        </div>
      </div>
    </div>
  )
}
