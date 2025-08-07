import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('token')?.value
    if (!token) {
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = '/loginAdmin'
      return NextResponse.redirect(loginUrl)
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any
      if (payload.role !== 'ADMIN') {
        const homeUrl = req.nextUrl.clone()
        homeUrl.pathname = '/'
        return NextResponse.redirect(homeUrl)
      }
    } catch {
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = '/loginAdmin'
      return NextResponse.redirect(loginUrl)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
