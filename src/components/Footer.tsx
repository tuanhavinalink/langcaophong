import Link from "next/link"
import { Mountain, Phone, Mail, MapPin, Share2, Play } from "lucide-react"

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1b4332' }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Mountain className="w-7 h-7" style={{ color: '#95d5b2' }} />
              <span className="text-xl font-bold">Làng Cao Phong</span>
            </div>
            <p className="text-green-200 text-sm leading-relaxed">
              Khu nghỉ dưỡng sinh thái giữa núi rừng Hòa Bình. Không gian yên tĩnh,
              thanh thản cách Hà Nội 80km.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="p-2 rounded-full hover:bg-green-700 transition-colors" style={{ backgroundColor: '#2d6a4f' }}>
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full hover:bg-green-700 transition-colors" style={{ backgroundColor: '#2d6a4f' }}>
                <Play className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4" style={{ color: '#95d5b2' }}>Liên Kết Nhanh</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-green-200 hover:text-white text-sm transition-colors">Trang Chủ</Link></li>
              <li><Link href="/#facilities" className="text-green-200 hover:text-white text-sm transition-colors">Khu Nghỉ Dưỡng</Link></li>
              <li><Link href="/#courses" className="text-green-200 hover:text-white text-sm transition-colors">Khóa Học</Link></li>
              <li><Link href="/booking" className="text-green-200 hover:text-white text-sm transition-colors">Đặt Phòng</Link></li>
              <li><Link href="/booking/full-village" className="text-green-200 hover:text-white text-sm transition-colors">Thuê Nguyên Làng</Link></li>
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="font-semibold text-lg mb-4" style={{ color: '#95d5b2' }}>Khóa Học</h3>
            <ul className="space-y-2">
              <li><Link href="/courses/vi-mo" className="text-green-200 hover:text-white text-sm transition-colors">Khóa Học Vĩ Mô</Link></li>
              <li><Link href="/courses/solo" className="text-green-200 hover:text-white text-sm transition-colors">Khóa Học SOLO</Link></li>
              <li><Link href="/courses/detox-sam" className="text-green-200 hover:text-white text-sm transition-colors">Detox & Trồng Sâm</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div id="contact">
            <h3 className="font-semibold text-lg mb-4" style={{ color: '#95d5b2' }}>Liên Hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-green-200 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#95d5b2' }} />
                <span>Xóm Môn, Cao Phong, Hòa Bình (Cách Hà Nội 80km)</span>
              </li>
              <li className="flex items-center gap-2 text-green-200 text-sm">
                <Phone className="w-4 h-4 shrink-0" style={{ color: '#95d5b2' }} />
                <a href="tel:0986655894" className="hover:text-white transition-colors">Hoàng Nga: 0986 655 894</a>
              </li>
              <li className="flex items-center gap-2 text-green-200 text-sm">
                <Mail className="w-4 h-4 shrink-0" style={{ color: '#95d5b2' }} />
                <a href="mailto:langcaophong@gmail.com" className="hover:text-white transition-colors">langcaophong@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-800 mt-8 pt-6 text-center text-green-400 text-sm">
          <p>© 2024 Làng Cao Phong. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
