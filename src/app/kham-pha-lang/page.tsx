"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Play, Image as ImageIcon } from "lucide-react"

interface MediaItem {
  id: string
  title: string
  description: string | null
  type: string
  url: string
  thumbnail: string | null
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

function getEmbedUrl(url: string): string {
  const ytId = getYouTubeId(url)
  if (ytId) return `https://www.youtube.com/embed/${ytId}?rel=0&autoplay=1`
  // For direct video files or other embeds, return as-is
  return url
}

function getThumbnail(item: MediaItem): string | null {
  if (item.thumbnail) return item.thumbnail
  const ytId = getYouTubeId(item.url)
  if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
  return null
}

export default function KhamPhaLangPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [lightbox, setLightbox] = useState<MediaItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/media").then(r => r.json()).then(data => { setItems(data); setLoading(false) })
  }, [])

  const videos = items.filter(i => i.type === "video")
  const images = items.filter(i => i.type === "image")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 60%, #40916c 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Trang chủ
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Khám Phá Làng Cao Phong</h1>
          <p className="text-white/80 text-lg max-w-2xl">Hành trình trải nghiệm giữa sông, núi và hồ trong thung lũng xanh mát cách Hà Nội 80km</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {loading && (
          <div className="text-center py-20 text-gray-400">
            <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4" />
            Đang tải...
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Nội dung đang được cập nhật...</p>
          </div>
        )}

        {/* Videos */}
        {videos.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#d1fae5' }}>
                <Play className="w-5 h-5" style={{ color: '#2d6a4f' }} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Video</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map(item => {
                const thumb = getThumbnail(item)
                return (
                  <button key={item.id} onClick={() => setLightbox(item)} className="group text-left rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                    <div className="relative aspect-video bg-gray-900">
                      {thumb ? (
                        <img src={thumb} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                          <Play className="w-12 h-12 text-white/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 ml-1" style={{ color: '#2d6a4f' }} />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
                      {item.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>}
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* Images */}
        {images.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#d1fae5' }}>
                <ImageIcon className="w-5 h-5" style={{ color: '#2d6a4f' }} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Hình Ảnh</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map(item => (
                <button key={item.id} onClick={() => setLightbox(item)} className="group text-left rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  {item.title && (
                    <div className="px-3 py-2 bg-white">
                      <p className="text-xs text-gray-600 line-clamp-1">{item.title}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        {!loading && (
          <div className="text-center py-10 border-t border-gray-100">
            <p className="text-gray-600 mb-5 text-lg">Sẵn sàng trải nghiệm Làng Cao Phong?</p>
            <Link href="/booking" className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all hover:opacity-90 shadow-md" style={{ backgroundColor: '#2d6a4f' }}>
              Đặt Phòng Ngay
            </Link>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="relative w-full max-w-4xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setLightbox(null)} className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm flex items-center gap-1">
              ✕ Đóng
            </button>
            {lightbox.type === "video" ? (
              <div className="aspect-video rounded-xl overflow-hidden bg-black">
                <iframe
                  src={getEmbedUrl(lightbox.url)}
                  className="w-full h-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </div>
            ) : (
              <img src={lightbox.url} alt={lightbox.title} className="max-h-[80vh] mx-auto rounded-xl object-contain" />
            )}
            <div className="mt-4 text-white text-center">
              <p className="font-semibold text-lg">{lightbox.title}</p>
              {lightbox.description && <p className="text-white/70 text-sm mt-1">{lightbox.description}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
