import type { APIRoute } from 'astro'
import { PAYLOAD_PREVIEW_SECRET } from 'astro:env/server'

export const prerender = false

const PREVIEW_COOKIE = 'payload-preview'

/**
 * Entry point for Payload's "Preview" button and live-preview iframe.
 * Validates the shared secret, marks the session as preview, then redirects
 * to the real route, which reads drafts once the cookie is present.
 */
export const GET: APIRoute = ({ url, cookies, redirect }) => {
  const secret = url.searchParams.get('secret')
  const path = url.searchParams.get('path')

  if (!PAYLOAD_PREVIEW_SECRET) {
    return new Response('Preview is not configured.', { status: 501 })
  }

  if (secret !== PAYLOAD_PREVIEW_SECRET) {
    return new Response('Invalid preview secret.', { status: 401 })
  }

  // Only allow same-site paths, so the secret cannot be used as an open redirect.
  if (!path || !path.startsWith('/') || path.startsWith('//')) {
    return new Response('Invalid preview path.', { status: 400 })
  }

  cookies.set(PREVIEW_COOKIE, '1', {
    httpOnly: true,
    sameSite: 'none',
    secure: url.protocol === 'https:',
    path: '/',
    maxAge: 60 * 60,
  })

  return redirect(path, 307)
}
