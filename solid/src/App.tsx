import type { Component } from 'solid-js'
import { Takt, useTakt } from '@vskstudio/takt-solid'

const BuyButton: Component = () => {
  // never-throwing no-op until <Takt> has mounted
  const takt = useTakt()

  const buy = () =>
    takt.track('Purchase', {
      props: { plan: 'pro' },
      revenue: { amount: '29.00', currency: 'EUR' },
    })

  return <button onClick={buy}>Buy pro</button>
}

const App: Component = () => (
  // domain + default /api/event endpoint; <Takt> fires the initial pageview.
  // excludeLocalhost={false} so events fire during local dev.
  // Advanced option (Takt 0.5): sampleRate is the fraction of visitors to track
  // (0 to 1); lower it to sample, e.g. 0.25.
  // scriptOrigin="https://stats.example.com" : sert le tracker depuis votre domaine (first-party / anti-adblock)
  <Takt domain="example.com" endpoint="/api/event" track404 sampleRate={1} excludeLocalhost={false}>
    <main>
      <h1>Takt + SolidJS</h1>
      <BuyButton />
    </main>
  </Takt>
)

export default App
