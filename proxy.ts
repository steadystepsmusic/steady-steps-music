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

  // Browsers and Google fetch /favicon.ico from the domain root regardless of
  // page metadata, so the NMM domain needs its own file at that path.
  if (isNikDomain && request.nextUrl.pathname === '/favicon.ico') {
    return NextResponse.rewrite(new URL('/nmm-favicon.ico', request.url))
  }
  if (isNikDomain && request.nextUrl.pathname === '/apple-touch-icon.png') {
    return NextResponse.rewrite(new URL('/nmm-apple-touch-icon.png', request.url))
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
  matcher: ['/', '/requests', '/favicon.ico', '/apple-touch-icon.png'],
}
