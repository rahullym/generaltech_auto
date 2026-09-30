import type { APIRoute } from 'astro'
import {
  CONTACT_FROM_EMAIL,
  CONTACT_TO_EMAIL,
  CONTACT_WEBHOOK_URL,
  RESEND_API_KEY,
} from 'astro:env/server'

export const prerender = false

/**
 * Receives the enquiry form on the contact page.
 *
 * Delivery is one pluggable step. With `RESEND_API_KEY` set, the enquiry is
 * emailed through Resend to `CONTACT_TO_EMAIL`, with the sender as Reply-To so
 * answering it reaches them. Otherwise `CONTACT_WEBHOOK_URL` — anything that
 * accepts a JSON POST — receives it. With neither configured the route answers
 * 501 with a `mailto` fallback, which the page's script uses to hand the
 * message to the reader's own mail client rather than dropping it.
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

const SOURCE = 'generaltechautomation.ae/contact_us'

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

const sendWithResend = async (apiKey: string, submission: Submission) => {
  const rows: [string, string][] = [
    ['Name', submission.name],
    ['Company', submission.company],
    ['Email', submission.email],
    ['Phone', submission.phone],
  ]
  const filled = rows.filter(([, value]) => value)

  const text = [...filled.map(([k, v]) => `${k}: ${v}`), '', submission.message, '', `— ${SOURCE}`].join(
    '\n',
  )
  const html =
    `<table cellpadding="4">${filled
      .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`)
      .join('')}</table>` +
    `<p style="white-space:pre-wrap">${escapeHtml(submission.message)}</p>` +
    `<p style="color:#888;font-size:12px">Sent from ${SOURCE}</p>`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL.split(',').map((address) => address.trim()),
      reply_to: submission.email,
      subject: `Website enquiry from ${submission.name}${submission.company ? ` (${submission.company})` : ''}`,
      text,
      html,
    }),
  })

  if (!res.ok) throw new Error(`resend responded ${res.status}: ${await res.text()}`)
}

const sendToWebhook = async (url: string, submission: Submission) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...submission, source: SOURCE, receivedAt: new Date().toISOString() }),
  })

  if (!res.ok) throw new Error(`webhook responded ${res.status}`)
}

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

  if (!RESEND_API_KEY && !CONTACT_WEBHOOK_URL) {
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
    if (RESEND_API_KEY) await sendWithResend(RESEND_API_KEY, submission)
    else await sendToWebhook(CONTACT_WEBHOOK_URL!, submission)
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
