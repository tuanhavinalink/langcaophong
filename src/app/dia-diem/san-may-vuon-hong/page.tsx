import Link from "next/link"
import { ArrowLeft, MapPin, Clock, Users, Star } from "lucide-react"

export const metadata = {
  title: "Săn Mây Vườn Hồng Cao Phong | Check-in Đẹp Cách Làng 2,5km",
  description: "Điểm check-in săn mây tuyệt đẹp giữa vườn hồng bốn mùa tại Cao Phong, Hòa Bình — chỉ cách Làng Cao Phong 2,5km. Thiên nhiên hoang sơ, bình minh mây phủ.",
  openGraph: {
    title: "Săn Mây Vườn Hồng Cao Phong | Làng Cao Phong",
    description: "Check-in săn mây giữa vườn hồng bốn mùa — trải nghiệm không thể bỏ qua khi nghỉ dưỡng tại Làng Cao Phong.",
    url: "https://langcaophong.com/dia-diem/san-may-vuon-hong",
    siteName: "Làng Cao Phong",
    locale: "vi_VN",
    type: "website",
  },
}

export default function SanMayVuonHongPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-72 md:h-96 overflow-hidden" style={{ background: 'linear-gradient(135deg, #831843 0%, #9d174d 60%, #f472b6 100%)' }}>
        <img src="/z7276968928711_2aedf34508d4ba228c3c3785fdd358d4.jpg" alt="Săn Mây Vườn Hồng" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm"><ArrowLeft className="w-4 h-4" /> Trang chủ</Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3 bg-pink-500/30 text-pink-100 border border-pink-400/30">
            <MapPin className="w-3 h-3" /> Cách Làng 2,5km
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white">🌸 Săn Mây Vườn Hồng</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: MapPin, label: "Khoảng cách", value: "2,5km từ Làng" },
            { icon: Clock, label: "Thời điểm lý tưởng", value: "Sáng sớm 5–7h" },
            { icon: Users, label: "Phù hợp", value: "Giới trẻ, nhiếp ảnh" },
          ].map(i => (
            <div key={i.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#fdf2f8' }}>
                <i.icon className="w-5 h-5" style={{ color: '#9d174d' }} />
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
            <p>Săn Mây Vườn Hồng là điểm check-in tuyệt đẹp nằm giữa những vườn cam bạt ngàn của Cao Phong — một trong những vùng cam nổi tiếng nhất miền Bắc Việt Nam. Cách Làng Cao Phong chỉ 2,5km, nơi đây là "thánh địa" check-in của giới trẻ yêu thiên nhiên.</p>
            <p>Điều đặc biệt nhất ở đây là màn săn mây huyền ảo vào sáng sớm, khi những dải mây trắng lãng đãng lướt qua những vườn hồng rực rỡ, tạo nên khung cảnh như chốn bồng lai tiên cảnh. Đây là cảnh tượng hiếm có chỉ xuất hiện vào mùa thu – đông.</p>
            <p>Mùa cam chín (tháng 10-12) là thời điểm đẹp nhất để ghé thăm — du khách có thể hái cam bằng thuyền trên những con mương xanh mát chạy qua vườn cam bát ngát.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trải Nghiệm Tại Đây</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {["Săn mây buổi sáng sớm huyền ảo", "Chụp ảnh giữa vườn hồng và biển mây", "Hái cam bằng thuyền trên mương nước", "Thưởng thức cam Cao Phong tươi ngon nhất", "Khám phá vườn cam rộng hàng trăm hecta", "Ngắm hoàng hôn từ trên đỉnh đồi"].map(a => (
              <div key={a} className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: '#fdf2f8' }}>
                <Star className="w-4 h-4 shrink-0" style={{ color: '#9d174d' }} />
                <span className="text-sm text-gray-700">{a}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-l-4" style={{ borderLeftColor: '#f472b6' }}>
          <p className="text-sm font-semibold text-gray-900 mb-1">💡 Mẹo Săn Mây</p>
          <p className="text-sm text-gray-600">Để có cơ hội săn mây đẹp nhất, hãy thức dậy từ 5h sáng và đến điểm view trước khi mặt trời mọc. Thời điểm từ tháng 10 đến tháng 2 năm sau là mùa mây đẹp nhất tại Cao Phong.</p>
        </div>

        <div className="bg-gradient-to-br from-pink-700 to-pink-900 rounded-2xl p-6 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Trải Nghiệm Săn Mây Huyền Ảo</h3>
          <p className="text-pink-200 text-sm mb-5">Chỉ cách Làng Cao Phong 2,5km — 5 phút lái xe</p>
          <Link href="/booking" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-white" style={{ color: '#9d174d' }}>
            Book Phòng & Săn Mây
          </Link>
        </div>
      </div>
    </div>
  )
}
