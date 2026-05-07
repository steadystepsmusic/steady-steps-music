import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      listIds: [2],
      updateEnabled: true,
    }),
  })

  if (res.ok || res.status === 204) {
    return NextResponse.json({ ok: true })
  }

  const body = await res.json()
  // 400 with code DUPLICATE_PARAMETER means already subscribed — treat as success
  if (body.code === 'DUPLICATE_PARAMETER') {
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
}
