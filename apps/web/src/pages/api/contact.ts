import type { APIRoute } from 'astro'
import { CONTACT_WEBHOOK_URL } from 'astro:env/server'

export const prerender = false

/**
 * Receives the enquiry form on the contact page.
 *
 * There is no mail server in this project, so delivery is deliberately one
 * pluggable step: set `CONTACT_WEBHOOK_URL` to anything that accepts a JSON
 * POST — a form service, a Zapier/Make hook, an inbox relay — and submissions
 * are forwarded to it. With nothing configured the route answers 501 with a
 * `mailto` fallback, which the page's script uses to hand the message to the
 * reader's own mail client rather than dropping it.
 */

type Submission = {
  name: string
  company: string
  email: string
  phone: string
  message: string
}

const MAX = { name: 120, company: 160, email: 254, phone: 40, message: 5000 }

const read = (form: FormData, key: keyof typeof MAX): string =>
  String(form.get(key) ?? '')
    .replace(/\r\n/g, '\n')
    .trim()
    .slice(0, MAX[key])

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })

export const POST: APIRoute = async ({ request }) => {
  let form: FormData

  try {
    form = await request.formData()
  } catch {
    return json({ message: 'That submission could not be read.' }, 400)
  }

  // Honeypot: the field is off-screen and unlabelled for anything but a bot,
  // so a filled one is discarded — answered 200 so the sender learns nothing.
  if (String(form.get('website') ?? '').trim()) {
    return json({ message: 'Thank you — your enquiry has been sent.' }, 200)
  }

  const submission: Submission = {
    name: read(form, 'name'),
    company: read(form, 'company'),
    email: read(form, 'email'),
    phone: read(form, 'phone'),
    message: read(form, 'message'),
  }

  if (!submission.name || !submission.message) {
    return json({ message: 'Please add your name and a message.' }, 422)
  }

  // Deliberately permissive: a shape check, not an attempt to decide which
  // addresses exist. A wrong address is the sender's to correct.
  if (!/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(submission.email)) {
    return json({ message: 'Please check the email address and try again.' }, 422)
  }

  if (!CONTACT_WEBHOOK_URL) {
    return json(
      {
        fallback: 'mailto',
        message:
          'Opening your email app with the message ready to send. If nothing happens, email or call us directly.',
      },
      501,
    )
  }

  try {
    const res = await fetch(CONTACT_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...submission,
        source: 'generaltechautomation.ae/contact_us',
        receivedAt: new Date().toISOString(),
      }),
    })

    if (!res.ok) throw new Error(`webhook responded ${res.status}`)
  } catch (error) {
    console.error('[contact] delivery failed', error)
    return json(
      {
        fallback: 'mailto',
        message:
          'We could not send that automatically. Opening your email app instead — or call us and we will pick it up.',
      },
      502,
    )
  }

  return json({ message: 'Thank you — your enquiry has been sent. We reply within one business day.' }, 200)
}
