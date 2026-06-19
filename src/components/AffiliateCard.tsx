"use client"

import { useState, useEffect } from "react"
import { Share2, Copy, Check, Link, TrendingUp, Users } from "lucide-react"

function fmt(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n)
}
function fmtDate(d: string) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(d))
}

const ROLE_RATE_LABELS: Record<number, { label: string; color: string; bg: string }> = {
  0.10: { label: "10% — Thành viên", color: "#6b7280", bg: "#f9fafb" },
  0.15: { label: "15% — VIP / Cổ đông", color: "#2d6a4f", bg: "#f0fdf4" },
}

interface Earning {
  id: string
  amount: number
  status: string
  createdAt: string
  bookingId: string | null
  referredUser: { name: string; email: string } | null
}

export default function AffiliateCard({ code, balance }: { code: string; balance: number }) {
  const [copied, setCopied] = useState<"code" | "link" | null>(null)
  const [earnings, setEarnings] = useState<Earning[]>([])
  const [rate, setRate] = useState<number>(0.10)
  const [totalBalance, setTotalBalance] = useState(balance)
  const [showEarnings, setShowEarnings] = useState(false)

  const siteUrl = "https://www.langcaophong.com"
  const affLink = `${siteUrl}?ref=${code}`

  useEffect(() => {
    fetch("/api/affiliate/earnings")
      .then(r => r.json())
      .then(data => {
        if (data.affiliateRate) setRate(data.affiliateRate)
        if (data.affiliateBalance !== undefined) setTotalBalance(data.affiliateBalance)
        if (data.earnings) setEarnings(data.earnings)
      })
  }, [])

  const copy = async (type: "code" | "link") => {
    await navigator.clipboard.writeText(type === "code" ? code : affLink)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const rateInfo = ROLE_RATE_LABELS[rate] ?? { label: `${Math.round(rate * 100)}%`, color: "#2d6a4f", bg: "#f0fdf4" }
  const totalEarned = earnings.filter(e => e.status === "CONFIRMED").reduce((s, e) => s + e.amount, 0)

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Share2 className="w-4 h-4" style={{ color: "#2d6a4f" }} /> Hoa Hồng Giới Thiệu (Affiliate)
      </h3>

      {/* Rate badge */}
      <div className="flex items-center gap-2 mb-4 p-3 rounded-xl" style={{ backgroundColor: rateInfo.bg }}>
        <TrendingUp className="w-4 h-4 shrink-0" style={{ color: rateInfo.color }} />
        <div>
          <div className="text-xs text-gray-500">Tỷ lệ hoa hồng của bạn</div>
          <div className="font-bold text-sm" style={{ color: rateInfo.color }}>
            {rateInfo.label}
          </div>
        </div>
        <div className="ml-auto text-xs px-2 py-1 rounded-lg font-semibold" style={{ backgroundColor: rateInfo.color, color: '#fff' }}>
          {Math.round(rate * 100)}%
        </div>
      </div>

      {/* Code + copy */}
      <div className="flex items-center justify-between p-3 rounded-xl mb-2" style={{ backgroundColor: "#d1fae5" }}>
        <span className="font-mono font-bold text-lg tracking-widest" style={{ color: "#2d6a4f" }}>
          {code}
        </span>
        <button
          onClick={() => copy("code")}
          className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all"
          style={{ backgroundColor: copied === "code" ? "#2d6a4f" : "#fff", color: copied === "code" ? "#fff" : "#2d6a4f" }}
        >
          {copied === "code" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied === "code" ? "Đã copy!" : "Copy mã"}
        </button>
      </div>

      {/* Link + copy */}
      <div className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-100 bg-gray-50 mb-3">
        <Link className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span className="text-xs text-gray-500 truncate flex-1">{affLink}</span>
        <button
          onClick={() => copy("link")}
          className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg shrink-0 transition-all"
          style={{ backgroundColor: copied === "link" ? "#2d6a4f" : "#e8f5e9", color: copied === "link" ? "#fff" : "#2d6a4f" }}
        >
          {copied === "link" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied === "link" ? "Copied!" : "Copy link"}
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center mb-4">
        Chia sẻ link — nhận <strong>{Math.round(rate * 100)}% hoa hồng</strong> cho mỗi đặt phòng / đăng ký khóa học qua link của bạn
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="rounded-xl p-3 text-center" style={{ backgroundColor: "#f0fdf4" }}>
          <div className="text-xs text-gray-500 mb-0.5">Tổng hoa hồng</div>
          <div className="font-bold text-base" style={{ color: "#2d6a4f" }}>{fmt(totalEarned)}</div>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ backgroundColor: "#fff7ed" }}>
          <div className="text-xs text-gray-500 mb-0.5">Số dư hiện tại</div>
          <div className="font-bold text-base" style={{ color: "#c2410c" }}>{fmt(totalBalance)}</div>
        </div>
      </div>

      {/* Earnings list toggle */}
      {earnings.length > 0 && (
        <div>
          <button
            onClick={() => setShowEarnings(p => !p)}
            className="w-full flex items-center justify-between text-sm text-gray-600 py-2 border-t border-gray-100 hover:text-gray-900 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Lịch sử hoa hồng ({earnings.length})
            </span>
            <span>{showEarnings ? "▲" : "▼"}</span>
          </button>
          {showEarnings && (
            <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
              {earnings.map(e => (
                <div key={e.id} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 text-sm">
                  <div>
                    <div className="font-medium text-gray-800">{e.referredUser?.name || e.referredUser?.email || "Khách"}</div>
                    <div className="text-xs text-gray-400">{fmtDate(e.createdAt)} · {e.bookingId ? "Đặt phòng" : "Khóa học"}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold" style={{ color: "#2d6a4f" }}>+{fmt(e.amount)}</div>
                    <div className={`text-xs font-medium ${e.status === "CONFIRMED" ? "text-green-600" : "text-orange-500"}`}>
                      {e.status === "CONFIRMED" ? "Đã xác nhận" : "Chờ xác nhận"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {earnings.length === 0 && (
        <p className="text-xs text-gray-400 text-center pt-2 border-t border-gray-100">
          Chưa có hoa hồng nào. Chia sẻ link để bắt đầu kiếm tiền!
        </p>
      )}
    </div>
  )
}
