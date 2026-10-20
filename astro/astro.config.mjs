import { defineConfig } from 'astro/config'
import takt from '@vskstudio/takt-astro'

// Primary path: register the Takt integration (boots core's default instance,
// counts each Astro navigation once). endpoint defaults to /api/event.
// excludeLocalhost is false here so events fire during local dev.
// Alternative per-layout path (do NOT combine, it double-boots):
//   import Takt from '@vskstudio/takt-astro/Takt.astro'  ->  <Takt domain="example.com" /> in <head>
export default defineConfig({
  integrations: [
    // Advanced options (Takt 0.5): keep only the listed query params on pageviews;
    // scrubUrl (integration-only: it can't cross the <Takt /> JSON island) rewrites
    // each URL before send. It is stringified at build time, so keep it self-contained.
    // scriptOrigin: 'https://stats.example.com' -> first-party : sert le tracker depuis votre domaine (anti-adblock)
    takt({
      domain: 'example.com',
      endpoint: '/api/event',
      track404: true,
      excludeLocalhost: false,
      trackQuery: true,
      queryParams: ['utm_source', 'utm_medium', 'utm_campaign'],
      scrubUrl: (url) => url.split('#')[0],
    }),
  ],
})
