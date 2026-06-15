import Link from "next/link"
import { ArrowLeft, MapPin, Clock, Users, Star } from "lucide-react"

export const metadata = {
  title: "Động Thiên Đường – Đền Bồng Lai | Cách Làng Cao Phong 5km",
  description: "Khám phá Động Thiên Đường và Đền Bồng Lai — hang động hùng vĩ và đền thiêng nổi tiếng vùng Cao Phong, Hòa Bình, chỉ cách Làng Cao Phong 5km.",
  openGraph: {
    title: "Động Thiên Đường – Đền Bồng Lai | Làng Cao Phong",
    description: "Hang động hùng vĩ và đền thiêng nổi tiếng vùng Cao Phong, Hòa Bình — điểm tham quan không thể bỏ lỡ khi lên Làng.",
    url: "https://langcaophong.com/dia-diem/dong-thien-duong",
    siteName: "Làng Cao Phong",
    locale: "vi_VN",
    type: "website",
  },
}

export default function DongThienDuongPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-72 md:h-96 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d4a7a 60%, #60a5fa 100%)' }}>
        <img src="/z7056127176717_fd49b2e048c01c8f1ae1b8f666d3fdad.jpg" alt="Động Thiên Đường" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm"><ArrowLeft className="w-4 h-4" /> Trang chủ</Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3 bg-blue-500/30 text-blue-100 border border-blue-400/30">
            <MapPin className="w-3 h-3" /> Cách Làng 5km
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white">⛩️ Động Thiên Đường – Đền Bồng Lai</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: MapPin, label: "Khoảng cách", value: "5km từ Làng" },
            { icon: Clock, label: "Thời gian tham quan", value: "2 – 4 giờ" },
            { icon: Users, label: "Phù hợp", value: "Mọi đối tượng" },
          ].map(i => (
            <div key={i.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#dbeafe' }}>
                <i.icon className="w-5 h-5" style={{ color: '#1d4ed8' }} />
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
            <p>Động Thiên Đường là hang động hùng vĩ với hệ thống thạch nhũ nguyên sơ kỳ ảo, được mệnh danh là một trong những hang động đẹp nhất vùng Tây Bắc. Hang có chiều dài hàng trăm mét với các khối thạch nhũ đủ hình dạng như thiên đường huyền bí.</p>
            <p>Ngay bên cạnh Động Thiên Đường là Đền Bồng Lai — ngôi đền linh thiêng nổi tiếng trong vùng, thu hút hàng ngàn du khách thập phương về lễ bái mỗi năm. Đền tọa lạc trên thế đất đẹp, bao quanh bởi rừng núi xanh mát và không khí tâm linh thanh tịnh.</p>
            <p>Từ Làng Cao Phong, du khách chỉ cần 10-15 phút lái xe để đến khám phá điểm đến tâm linh và thiên nhiên độc đáo này.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trải Nghiệm Tại Đây</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {["Khám phá hang động thạch nhũ kỳ ảo", "Chụp ảnh check-in trong hang đá độc đáo", "Thắp hương lễ bái tại Đền Bồng Lai", "Chiêm bái kiến trúc đền cổ truyền thống", "Ngắm cảnh núi rừng hùng vĩ từ trên cao", "Tìm hiểu truyền thuyết và văn hóa bản địa"].map(a => (
              <div key={a} className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: '#eff6ff' }}>
                <Star className="w-4 h-4 shrink-0" style={{ color: '#1d4ed8' }} />
                <span className="text-sm text-gray-700">{a}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-6 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Ghé Thăm Địa Điểm Tâm Linh</h3>
          <p className="text-blue-200 text-sm mb-5">Chỉ cách Làng Cao Phong 5km — 10 phút lái xe</p>
          <Link href="/booking" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-white" style={{ color: '#1d4ed8' }}>
            Book Phòng & Khám Phá
          </Link>
        </div>
      </div>
    </div>
  )
}
