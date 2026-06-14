"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Menu, X, Mountain, User, LogOut, LayoutDashboard, Settings } from "lucide-react"

export default function Navbar() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const role = (session?.user as any)?.role

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl" style={{ color: '#2d6a4f' }}>
            <Mountain className="w-7 h-7" />
            <span className="hidden sm:block">Làng Cao Phong</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-green-700 font-medium transition-colors">Trang Chủ</Link>
            <Link href="/#facilities" className="text-gray-700 hover:text-green-700 font-medium transition-colors">Khu Nghỉ</Link>
            <Link href="/#courses" className="text-gray-700 hover:text-green-700 font-medium transition-colors">Khóa Học</Link>
            <Link href="/booking" className="text-gray-700 hover:text-green-700 font-medium transition-colors">Đặt Phòng</Link>
            <Link href="/#contact" className="text-gray-700 hover:text-green-700 font-medium transition-colors">Liên Hệ</Link>
          </div>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/langcaofong"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#1877f2' }}
          >
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
            </svg>
            Fanpage
          </a>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#2d6a4f' }}>
                    {session.user?.name?.[0] || 'U'}
                  </div>
                  <span className="text-gray-700 font-medium text-sm">{session.user?.name}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-green-50 text-sm" onClick={() => setUserMenuOpen(false)}>
                      <LayoutDashboard className="w-4 h-4" /> Tài Khoản
                    </Link>
                    {role === "ADMIN" && (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-green-50 text-sm" onClick={() => setUserMenuOpen(false)}>
                        <Settings className="w-4 h-4" /> Quản Trị
                      </Link>
                    )}
                    <button
                      onClick={() => { signOut({ callbackUrl: '/' }); setUserMenuOpen(false) }}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-sm w-full"
                    >
                      <LogOut className="w-4 h-4" /> Đăng Xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-green-700 font-medium text-sm transition-colors">
                  Đăng Nhập
                </Link>
                <Link href="/register" className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors" style={{ backgroundColor: '#2d6a4f' }}>
                  Đăng Ký
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg text-gray-700">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-2">
            <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg" onClick={() => setIsOpen(false)}>Trang Chủ</Link>
            <Link href="/#facilities" className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg" onClick={() => setIsOpen(false)}>Khu Nghỉ</Link>
            <Link href="/#courses" className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg" onClick={() => setIsOpen(false)}>Khóa Học</Link>
            <Link href="/booking" className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg" onClick={() => setIsOpen(false)}>Đặt Phòng</Link>
            <Link href="/#contact" className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg" onClick={() => setIsOpen(false)}>Liên Hệ</Link>
            <a href="https://www.facebook.com/langcaofong" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium" style={{ backgroundColor: '#1877f2' }} onClick={() => setIsOpen(false)}>
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
              Fanpage Facebook
            </a>
            {session ? (
              <>
                <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg" onClick={() => setIsOpen(false)}>Tài Khoản</Link>
                {role === "ADMIN" && <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg" onClick={() => setIsOpen(false)}>Quản Trị</Link>}
                <button onClick={() => signOut({ callbackUrl: '/' })} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">Đăng Xuất</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg" onClick={() => setIsOpen(false)}>Đăng Nhập</Link>
                <Link href="/register" className="block px-4 py-2 text-white rounded-lg text-center font-medium" style={{ backgroundColor: '#2d6a4f' }} onClick={() => setIsOpen(false)}>Đăng Ký</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
