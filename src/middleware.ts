import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Try both cookie names - NextAuth v5 uses __Secure- prefix on HTTPS
  // Vercel internal requests may use HTTP so we try both
  let token = await getToken({
    req,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    cookieName: "__Secure-authjs.session-token",
  })

  if (!token) {
    token = await getToken({
      req,
      secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
      cookieName: "authjs.session-token",
    })
  }

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
