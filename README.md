# Digi News App

Pure React/Vite SPA for Digi News.

## Environment

Copy `.env.example` and set production values:

```bash
VITE_SITE_URL=https://your-news-domain.com
VITE_SITE_NAME=Digi News
VITE_API_ROOT=https://your-django-api.com/api
VITE_API_SITE_ROOT=https://your-django-api.com
```

## AI And SEO Visibility

This app stays a pure React SPA. For SEO bots and AI crawlers, deploy with a prerendering proxy so crawlers receive cached, fully rendered HTML while regular users receive the SPA.

Netlify setup is included:

- `netlify.toml` builds `dist`, keeps SPA fallback routing, and applies the prerender edge function.
- `netlify/edge-functions/prerender.js` detects search and AI crawler user agents.
- Set `PRERENDER_TOKEN` in Netlify environment variables.
- Set `VITE_SITE_URL`, `VITE_API_ROOT`, and `VITE_API_SITE_ROOT` to production URLs.

For Vercel, use the same bot detection logic in Vercel Edge Middleware and proxy bot requests to `https://service.prerender.io/${request.url}` with the `token` header.

The Django API article payload includes `seo_metadata` and `news_schema`, so the prerendered React page can expose complete article metadata, canonical URLs, language alternates, and Schema.org `NewsArticle` JSON-LD.

## Commands

```bash
npm run dev
npm run build
npm run lint
```
