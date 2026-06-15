"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mountain, Eye, EyeOff, UserPlus } from "lucide-react"

function formatCurrency(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + " đ"
}

interface MainShareholder { id: string; name: string | null; shareAmount: number }

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "", memberType: "MEMBER", parentShareholderId: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [mainShareholders, setMainShareholders] = useState<MainShareholder[]>([])

  useEffect(() => {
    if (form.memberType === "SHAREHOLDER_FOLLOW") {
      fetch("/api/shareholders").then(r => r.json()).then(setMainShareholders)
    }
  }, [form.memberType])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      return
    }
    if (form.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password, memberType: form.memberType, parentShareholderId: form.parentShareholderId || null })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Đăng ký thất bại")
      } else {
        router.push("/login?registered=true")
      }
    } catch {
      setError("Đã xảy ra lỗi, vui lòng thử lại")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ backgroundColor: '#f0fdf4' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#d1fae5' }}>
            <Mountain className="w-8 h-8" style={{ color: '#2d6a4f' }} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Đăng Ký</h1>
          <p className="text-gray-600 mt-2">Tạo tài khoản để đặt phòng và đăng ký khóa học</p>
        </div>

        <div className="mb-5 rounded-2xl px-5 py-4 text-center" style={{ backgroundColor: '#f0fdf4', border: '1.5px solid #bbf7d0' }}>
          <p className="text-sm font-medium" style={{ color: '#166534' }}>
            🏡 <strong>Cổ đông / VIP</strong> được Booking phòng nghỉ <strong>miễn phí</strong> — không hạn chế thời gian &amp; số lượng.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Member type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Loại thành viên</label>
              <select
                name="memberType"
                value={form.memberType}
                onChange={e => setForm({ ...form, memberType: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 text-gray-900 bg-white"
              >
                <option value="MEMBER">👤 Member thường</option>
                <option value="SHAREHOLDER_MAIN">👑 Cổ đông Chính (15 người ban đầu)</option>
                <option value="SHAREHOLDER_FOLLOW">🤝 Cổ đông Theo (mua lại / theo suất cổ đông chính)</option>
              </select>
              {form.memberType === "MEMBER" && (
                <p className="text-xs text-gray-500 mt-1.5">Chi tiêu 10 triệu → tự động lên <strong>VIP</strong> và nhận quyền book phòng miễn phí.</p>
              )}
              {(form.memberType === "SHAREHOLDER_MAIN" || form.memberType === "SHAREHOLDER_FOLLOW") && (
                <p className="text-xs mt-1.5" style={{ color: '#7c3aed' }}>Tài khoản cổ đông sẽ được Admin xác nhận và cấp quyền đầy đủ sau khi đăng ký.</p>
              )}
            </div>

            {/* Parent shareholder picker — SHAREHOLDER_FOLLOW only */}
            {form.memberType === "SHAREHOLDER_FOLLOW" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Đăng ký theo nhánh Cổ đông Chính nào?</label>
                <select
                  value={form.parentShareholderId}
                  onChange={e => setForm({ ...form, parentShareholderId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 text-gray-900 bg-white"
                >
                  <option value="">— Chưa biết / Để Admin phân nhánh sau —</option>
                  {mainShareholders.map(m => (
                    <option key={m.id} value={m.id}>
                      👑 {m.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1.5">Nếu chưa chắc, Admin sẽ phân nhánh sau khi xác nhận tài khoản.</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Nguyễn Văn A"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="0900 000 000"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 text-gray-900"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 text-gray-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold transition-all hover:opacity-90 disabled:opacity-60 mt-2"
              style={{ backgroundColor: '#2d6a4f' }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><UserPlus className="w-5 h-5" /> Đăng Ký</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Đã có tài khoản?{" "}
              <Link href="/login" className="font-semibold hover:underline" style={{ color: '#2d6a4f' }}>
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
