import { init, track, pageview } from '@vskstudio/takt-core'

// init() boots the shared instance and fires the initial (auto) pageview.
// excludeLocalhost is disabled so events fire during local dev.
init({
  domain: 'example.com',
  endpoint: '/api/event',
  auto: true,
  notFound: true,
  excludeLocalhost: false,
  // Advanced options (Takt 0.5):
  sampleRate: 1, // fraction of visitors to track (0 to 1); lower it to sample, e.g. 0.25
  tagged: true, // autocapture clicks on [data-takt-tag] elements
  // scriptOrigin: 'https://stats.example.com', // first-party : sert le tracker depuis votre domaine (anti-adblock)
})

const button = document.querySelector<HTMLButtonElement>('#buy')
button?.addEventListener('click', () => {
  track('Purchase', {
    props: { plan: 'pro' },
    revenue: { amount: '29.00', currency: 'EUR' },
  })
})

// Manual pageview, e.g. a virtual route the SPA hook didn't catch.
pageview()
