import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Đăng Nhập | Làng Cao Phong",
  description: "Đăng nhập tài khoản Làng Cao Phong để đặt phòng, đăng ký khóa học và nhận quyền lợi thành viên VIP.",
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
