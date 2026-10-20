import { createApp } from 'vue'
import { TaktPlugin } from '@vskstudio/takt-vue'
import App from './App.vue'

const app = createApp(App)

// Installing with options bootstraps a single instance: fires the initial
// pageview, wires SPA navigation, and registers the v-takt-event directive.
// excludeLocalhost is disabled so events fire during local development.
app.use(TaktPlugin, {
  domain: 'example.com',
  endpoint: '/api/event',
  track404: true,
  excludeLocalhost: false,
  // Advanced options (Takt 0.5): keep the query string on pageviews, but only
  // the listed params (drops everything else, e.g. session ids).
  trackQuery: true,
  queryParams: ['utm_source', 'utm_medium', 'utm_campaign'],
  // scriptOrigin: 'https://stats.example.com', // first-party : sert le tracker depuis votre domaine (anti-adblock)
})

app.mount('#app')
