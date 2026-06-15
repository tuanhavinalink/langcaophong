import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Khám Phá Làng Cao Phong – Hoạt Động & Trải Nghiệm | Hòa Bình",
  description: "Khám phá Làng Cao Phong — bungalow giữa sông núi, thiền Gosinga, trồng Sâm, chèo thuyền, dã ngoại rừng. Trải nghiệm retreat sinh thái đặc sắc tại Hòa Bình.",
  openGraph: {
    title: "Khám Phá Làng Cao Phong | Hòa Bình",
    description: "Trải nghiệm retreat sinh thái: thiền, trồng Sâm, chèo thuyền, bungalow giữa sông núi Hòa Bình.",
    url: "https://langcaophong.com/kham-pha-lang",
    siteName: "Làng Cao Phong",
    locale: "vi_VN",
    type: "website",
  },
}

export default function KhamPhaLangLayout({ children }: { children: React.ReactNode }) {
  return children
}
