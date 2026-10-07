import { createHmac, timingSafeEqual } from 'crypto'
import { NextResponse } from 'next/server'
import { SEVENTH_CHORDS_EMAIL } from './emails'

// Stripe sends checkout.session.completed here for every payment on the account.
// Only the 7th chords payment link gets the PDF email; lesson payments are ignored.
// No Stripe API key is used: the payload is trusted only after the signature check.

const PRODUCTS: Record<string, { subject: string; pdfUrl: string; pdfName: string; html: string }> = {
  // Guitar 7th Chord Vocabulary, https://buy.stripe.com/bJe5kvgXueni0J6fb11RC0g
  plink_1UNwpc1qCgCNqXzShZM5GoIV: {
    subject: 'Your Guitar 7th Chord Vocabulary download',
    pdfUrl: 'https://steadystepsmusic.com/downloads/ssm-7th-chords-jr289yin.pdf',
    pdfName: 'Guitar 7th Chord Vocabulary - Steady Steps Music.pdf',
    html: SEVENTH_CHORDS_EMAIL,
  },
}

const TOLERANCE_SECONDS = 300

function verifySignature(payload: string, header: string | null, secret: string): boolean {
  if (!header) return false
  const timestamp = Number(header.split(',').find((p) => p.startsWith('t='))?.slice(2))
  const signatures = header
    .split(',')
    .filter((p) => p.startsWith('v1='))
    .map((p) => p.slice(3))
  if (!timestamp || signatures.length === 0) return false
  if (Math.abs(Date.now() / 1000 - timestamp) > TOLERANCE_SECONDS) return false

  const expected = createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest()
  return signatures.some((sig) => {
    const given = Buffer.from(sig, 'hex')
    return given.length === expected.length && timingSafeEqual(given, expected)
  })
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret || !process.env.BREVO_API_KEY) {
    console.error('Stripe webhook: STRIPE_WEBHOOK_SECRET or BREVO_API_KEY not set')
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
  }

  const payload = await req.text()
  if (!verifySignature(payload, req.headers.get('stripe-signature'), secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(payload)
  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ ignored: event.type })
  }

  const session = event.data.object
  const product = session.payment_link ? PRODUCTS[session.payment_link] : undefined
  if (!product || session.payment_status !== 'paid') {
    return NextResponse.json({ ignored: 'not a digital product sale' })
  }

  const email = session.customer_details?.email
  if (!email) {
    console.error('Stripe webhook: paid session without customer email', session.id)
    return NextResponse.json({ ignored: 'no email' })
  }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: { name: 'Nik at Steady Steps Music', email: 'hello@steadystepsmusic.com' },
      replyTo: { name: 'Nik at Steady Steps Music', email: 'steadystepsmusic@gmail.com' },
      to: [{ email }],
      subject: product.subject,
      htmlContent: product.html,
      attachment: [{ url: product.pdfUrl, name: product.pdfName }],
    }),
  })

  if (!res.ok) {
    // Non-2xx makes Stripe retry the event, so a Brevo hiccup doesn't lose the email
    console.error('Stripe webhook: Brevo send failed', res.status, await res.text().catch(() => ''))
    return NextResponse.json({ error: 'Email send failed' }, { status: 502 })
  }

  return NextResponse.json({ sent: true })
}
