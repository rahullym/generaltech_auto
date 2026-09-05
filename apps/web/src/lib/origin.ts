/**
 * The origin the site should name as its own.
 *
 * Anything that has to write an absolute URL — the canonical link, og:url,
 * robots.txt, the sitemap — needs the public origin, and `Astro.site` is only
 * as good as the configuration behind it. When that configuration is missing
 * the default is `http://localhost:4331`, and a production page published with
 * a localhost canonical is not merely wrong, it is uncrawlable. So a localhost
 * value is treated as absent and the request's own origin is used instead.
 */
const LOCAL = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:|$)/

export const publicOrigin = (site: URL | undefined, requestUrl: URL): string => {
  const configured = site?.origin
  return configured && !LOCAL.test(configured) ? configured : requestUrl.origin
}
