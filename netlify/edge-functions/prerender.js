/* global Netlify */

const BOT_USER_AGENT_PATTERN = /\b(googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|facebookexternalhit|twitterbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|developers\.google\.com\/\+\/web\/snippet|gptbot|chatgpt-user|oai-searchbot|claudebot|anthropic-ai|perplexitybot|bytespider|ccbot|google-extended)\b/i
const STATIC_ASSET_PATTERN = /\.(?:js|mjs|css|map|json|xml|txt|png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|eot)$/i

export default async (request, context) => {
  const url = new URL(request.url)
  const userAgent = request.headers.get('user-agent') || ''
  const prerenderToken = Netlify.env.get('PRERENDER_TOKEN')

  if (
    request.method !== 'GET' ||
    !prerenderToken ||
    !BOT_USER_AGENT_PATTERN.test(userAgent) ||
    STATIC_ASSET_PATTERN.test(url.pathname) ||
    request.headers.get('x-prerender') === '1'
  ) {
    return context.next()
  }

  const prerenderUrl = `https://service.prerender.io/${url.href}`
  const response = await fetch(prerenderUrl, {
    headers: {
      token: prerenderToken,
      'x-prerender': '1',
    },
  })

  if (!response.ok) {
    return context.next()
  }

  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'X-Prerendered-By': 'Prerender.io',
    },
  })
}
