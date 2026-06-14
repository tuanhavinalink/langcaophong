import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // NextAuth v5 dùng cookie name khác với v4
  const cookieName = req.url.startsWith("https")
    ? "__Secure-authjs.session-token"
    : "authjs.session-token"

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    cookieName,
  })

  const isLoggedIn = !!token
  const protectedRoutes = ["/dashboard", "/booking", "/admin"]
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (pathname.startsWith("/admin")) {
    const role = (token as any)?.role
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/booking/:path*", "/admin/:path*"]
}
