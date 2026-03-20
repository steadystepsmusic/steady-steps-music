import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const isNikDomain =
    hostname === 'nikmathewsmusic.com' ||
    hostname === 'www.nikmathewsmusic.com'

  if (isNikDomain && request.nextUrl.pathname === '/') {
    return NextResponse.rewrite(new URL('/nik-mathews', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
}
