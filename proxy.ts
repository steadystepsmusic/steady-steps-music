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

  const isSteadyDomain =
    hostname === 'steadystepsmusic.com' ||
    hostname === 'www.steadystepsmusic.com'

  if (isSteadyDomain && request.nextUrl.pathname === '/requests') {
    return NextResponse.redirect(new URL('https://nikmathewsmusic.com/requests'))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/requests'],
}
