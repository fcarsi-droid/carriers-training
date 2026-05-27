import { NextResponse } from 'next/server'

export function middleware(req) {
  const token = req.cookies.get('token')?.value
  const { pathname } = req.nextUrl

  // Protect admin API routes
  if (pathname.startsWith('/api/admin') || pathname.startsWith('/api/quiz')) {
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // Clone request and add Authorization header
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('authorization', `Bearer ${token}`)
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  // Protect admin page
  if (pathname === '/admin') {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  // Protect training page
  if (pathname === '/training') {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/training', '/api/admin/:path*', '/api/quiz/:path*']
}
