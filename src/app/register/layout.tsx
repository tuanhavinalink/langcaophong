import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Đăng Ký Thành Viên | Làng Cao Phong",
  description: "Tạo tài khoản Làng Cao Phong để đặt phòng nghỉ dưỡng, đăng ký khóa học và trở thành cổ đông. Cổ đông & VIP đặt phòng miễn phí.",
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children
}
