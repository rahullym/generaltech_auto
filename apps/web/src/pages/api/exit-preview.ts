import type { APIRoute } from 'astro'

export const prerender = false

export const GET: APIRoute = ({ cookies, redirect, url }) => {
  cookies.delete('payload-preview', { path: '/' })

  const path = url.searchParams.get('path')
  const safe = path && path.startsWith('/') && !path.startsWith('//') ? path : '/'

  return redirect(safe, 307)
}
