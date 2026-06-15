import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Thuê Nguyên Làng | Làng Cao Phong – Hội Thảo & Team Building",
  description: "Thuê nguyên Làng Cao Phong cho hội thảo, team building, retreat doanh nghiệp — sức chứa lên đến 100+ người, giữa thiên nhiên Hòa Bình.",
  openGraph: {
    title: "Thuê Nguyên Làng | Làng Cao Phong",
    description: "Không gian retreat doanh nghiệp, hội thảo, team building tại Làng Cao Phong — Hòa Bình.",
    url: "https://langcaophong.com/booking/full-village",
    siteName: "Làng Cao Phong",
    locale: "vi_VN",
    type: "website",
  },
}

export default function FullVillageLayout({ children }: { children: React.ReactNode }) {
  return children
}
