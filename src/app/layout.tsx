import type { Metadata } from "next"
import "./globals.css"
import SessionProvider from "@/components/SessionProvider"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  metadataBase: new URL("https://langcaophong.com"),
  title: {
    default: "Làng Cao Phong – Khu Nghỉ Dưỡng Sinh Thái Hòa Bình",
    template: "%s | Làng Cao Phong",
  },
  description: "Khu nghỉ dưỡng sinh thái Làng Cao Phong — chốn bình yên giữa sông, núi và hồ tại Hòa Bình, cách Hà Nội 80km. Bungalow, Glamping, Villa, khóa học Vĩ Mô, Solopreneur, Detox Sâm.",
  keywords: ["Làng Cao Phong", "nghỉ dưỡng Hòa Bình", "bungalow Hòa Bình", "glamping Hòa Bình", "retreat Hà Nội", "khóa học Tuấn Hà", "Cao Phong"],
  authors: [{ name: "Làng Cao Phong" }],
  openGraph: {
    siteName: "Làng Cao Phong",
    locale: "vi_VN",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <Navbar />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}
