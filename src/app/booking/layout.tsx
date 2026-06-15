import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Đặt Phòng Nghỉ Dưỡng | Làng Cao Phong – Hòa Bình",
  description: "Đặt phòng Bungalow, Glamping, Villa tại Làng Cao Phong — Hòa Bình, cách Hà Nội 80km. Cổ đông & VIP đặt phòng miễn phí. Check-in cuối tuần giữa sông, núi và hồ.",
  openGraph: {
    title: "Đặt Phòng Nghỉ Dưỡng | Làng Cao Phong",
    description: "Bungalow, Glamping, Villa giữa núi rừng Hòa Bình — Cổ đông & VIP miễn phí. Đặt ngay!",
    url: "https://langcaophong.com/booking",
    siteName: "Làng Cao Phong",
    locale: "vi_VN",
    type: "website",
  },
}

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return children
}
