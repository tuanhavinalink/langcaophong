"use client"
import { useState } from "react"
import { X, TrendingUp } from "lucide-react"

const TOTAL_CAPITAL = 11_600_000_000

function fmt(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + " đ"
}

const breakdown = [
  {
    label: "15 Cổ đông lớn × 650 triệu",
    amount: 9_750_000_000,
    color: "#7c3aed",
    detail: "15 × 650.000.000 đ",
  },
  {
    label: "Thầy Tuấn Hà đầu tư thêm",
    amount: 1_150_000_000,
    color: "#2d6a4f",
    sub: [
      { label: "Làng vay", amount: 650_000_000 },
      { label: "Cây trồng", amount: 250_000_000 },
      { label: "Phòng hội thảo kính", amount: 250_000_000 },
    ],
  },
  {
    label: "VCF đầu tư thêm",
    amount: 550_000_000,
    color: "#b45309",
    sub: [
      { label: "Nhà tròn, bến thuyền, Quán Bar", amount: 550_000_000 },
    ],
  },
  {
    label: "Hoàng Nga – Tiền thuê đất 3 năm (2025–2027)",
    amount: 150_000_000,
    color: "#0369a1",
    detail: null,
  },
]

export default function ShareCapitalPopup({ shareAmount }: { shareAmount: number }) {
  const [open, setOpen] = useState(false)
  const dynamicPercent = ((shareAmount / TOTAL_CAPITAL) * 100).toFixed(4)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full text-left rounded-xl p-3 mb-1 space-y-1.5 transition hover:opacity-80 cursor-pointer"
        style={{ backgroundColor: '#f5f3ff', border: '1px solid #e9d5ff' }}
      >
        <div className="text-xs font-semibold uppercase tracking-wide flex items-center justify-between" style={{ color: '#7c3aed' }}>
          <span>Cổ Phần Làng Cao Phong</span>
          <span className="text-xs normal-case font-normal opacity-60">Nhấn để xem chi tiết →</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Số tiền đầu tư</span>
          <span className="font-bold text-gray-900">{fmt(shareAmount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Tổng vốn làng</span>
          <span className="font-bold text-gray-900">{new Intl.NumberFormat('vi-VN').format(TOTAL_CAPITAL)} đ</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Tỷ lệ sở hữu</span>
          <span className="font-bold" style={{ color: '#7c3aed' }}>{dynamicPercent}%</span>
        </div>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white rounded-t-2xl p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" style={{ color: '#7c3aed' }} />
                <h2 className="font-bold text-gray-900">Cơ Cấu Vốn Đầu Tư</h2>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Total */}
              <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#f5f3ff', border: '2px solid #7c3aed' }}>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Tổng Vốn Đầu Tư Toàn Bộ</div>
                <div className="text-2xl font-bold" style={{ color: '#7c3aed' }}>
                  {new Intl.NumberFormat('vi-VN').format(TOTAL_CAPITAL)} đ
                </div>
                <div className="text-sm text-gray-500 mt-1">11,6 tỷ VNĐ</div>
              </div>

              {/* Breakdown */}
              <div className="space-y-3">
                {breakdown.map((item, i) => (
                  <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: '#fafafa' }}>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-sm font-semibold text-gray-800">{item.label}</span>
                      </div>
                      <span className="text-sm font-bold shrink-0 ml-2" style={{ color: item.color }}>{fmt(item.amount)}</span>
                    </div>
                    {item.sub && (
                      <div className="px-4 pb-3 pt-1 space-y-1.5 bg-white">
                        {item.sub.map((s, j) => (
                          <div key={j} className="flex justify-between text-xs text-gray-500 pl-4">
                            <span>• {s.label}</span>
                            <span className="font-medium text-gray-700">{fmt(s.amount)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {item.detail && (
                      <div className="px-4 pb-3 pt-1 bg-white">
                        <div className="text-xs text-gray-400 pl-4">{item.detail}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* User's stake */}
              <div className="rounded-xl p-4" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Phần Của Bạn</div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Đầu tư</span>
                  <span className="font-bold text-gray-900">{fmt(shareAmount)}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-600">Tỷ lệ sở hữu</span>
                  <span className="font-bold text-lg" style={{ color: '#7c3aed' }}>{dynamicPercent}%</span>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  = {fmt(shareAmount)} ÷ {new Intl.NumberFormat('vi-VN').format(TOTAL_CAPITAL)} đ
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="w-full py-3 rounded-xl font-medium text-white text-sm"
                style={{ backgroundColor: '#7c3aed' }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
