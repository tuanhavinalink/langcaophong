"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mountain, Eye, EyeOff, LogIn } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Email hoặc mật khẩu không đúng")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError("Đã xảy ra lỗi, vui lòng thử lại")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ backgroundColor: '#f0fdf4' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#d1fae5' }}>
            <Mountain className="w-8 h-8" style={{ color: '#2d6a4f' }} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Đăng Nhập</h1>
          <p className="text-gray-600 mt-2">Chào mừng trở lại Làng Cao Phong</p>
        </div>

        {/* Promo banner */}
        <div className="mb-5 rounded-2xl px-5 py-4 text-center" style={{ backgroundColor: '#fef3c7', border: '1.5px solid #fde68a' }}>
          <div className="text-lg font-bold mb-1" style={{ color: '#92400e' }}>🎁 Ưu Đãi 200 Thành Viên Đầu Tiên</div>
          <p className="text-sm" style={{ color: '#78350f' }}>
            Đăng ký sớm được tặng quyền <strong>Booking phòng nghỉ miễn phí</strong> — không hạn chế số lượng &amp; thời gian — dành riêng cho <strong>200 thành viên đầu tiên</strong>.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 transition-all"
                style={{ focusRingColor: '#2d6a4f' } as any}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold transition-all hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: '#2d6a4f' }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" /> Đăng Nhập
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Muốn đăng ký thành viên để Booking miễn phí?{" "}
              <Link href="/register" className="font-semibold hover:underline" style={{ color: '#2d6a4f' }}>
                Đăng Ký Ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
