"use client"

import { useState } from "react"
import { Share2, Copy, Check, Link } from "lucide-react"

export default function AffiliateCard({
  code,
  balance,
}: {
  code: string
  balance: number
}) {
  const [copied, setCopied] = useState<"code" | "link" | null>(null)

  const siteUrl = "https://www.langcaophong.com"
  const affLink = `${siteUrl}?ref=${code}`

  const copy = async (type: "code" | "link") => {
    const text = type === "code" ? code : affLink
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n)

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Share2 className="w-4 h-4" style={{ color: "#2d6a4f" }} /> Mã Giới Thiệu
      </h3>

      {/* Code + copy */}
      <div
        className="flex items-center justify-between p-3 rounded-xl mb-2"
        style={{ backgroundColor: "#d1fae5" }}
      >
        <span className="font-mono font-bold text-lg tracking-widest" style={{ color: "#2d6a4f" }}>
          {code}
        </span>
        <button
          onClick={() => copy("code")}
          className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all"
          style={{
            backgroundColor: copied === "code" ? "#2d6a4f" : "#fff",
            color: copied === "code" ? "#fff" : "#2d6a4f",
          }}
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
          style={{
            backgroundColor: copied === "link" ? "#2d6a4f" : "#e8f5e9",
            color: copied === "link" ? "#fff" : "#2d6a4f",
          }}
        >
          {copied === "link" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied === "link" ? "Copied!" : "Copy link"}
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center mb-3">
        Chia sẻ link trên để nhận hoa hồng khi có người đặt phòng
      </p>

      <div className="flex justify-between text-sm pt-3 border-t border-gray-100">
        <span className="text-gray-500">Số dư hoa hồng</span>
        <span className="font-bold" style={{ color: "#2d6a4f" }}>
          {formatCurrency(balance)}
        </span>
      </div>
    </div>
  )
}
