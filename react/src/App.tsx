import { Takt, TaktEvent, useTakt, useTaktEvent } from '@vskstudio/takt-react'

// <Takt> mounts the analytics instance, fires the initial pageview, and
// (with spa) tracks SPA navigations automatically. excludeLocalhost is
// disabled here so events are emitted during local development.
export default function App() {
  return (
    // Advanced options (Takt 0.5): tagged autocaptures [data-takt-tag] clicks;
    // scrubUrl rewrites the URL before it is sent (here: drop the #fragment).
    // scriptOrigin="https://stats.example.com" : sert le tracker depuis votre domaine (first-party / anti-adblock)
    <Takt
      domain="example.com"
      endpoint="/api/event"
      outbound
      files
      spa
      track404
      tagged
      scrubUrl={(url) => url.split('#')[0]}
      excludeLocalhost={false}
    >
      <main>
        <h1>Takt React Example</h1>
        <BuyButton />
        <SignupButton />
        {/* Autocaptured by `tagged`: no handler needed. */}
        <button data-takt-tag="Newsletter">Join newsletter</button>
      </main>
    </Takt>
  )
}

// Imperative tracking via the hook: a click with props + revenue.
function BuyButton() {
  const takt = useTakt()
  return (
    <button
      onClick={() =>
        takt.track('Buy', {
          props: { plan: 'pro', source: 'hero' },
          revenue: { amount: '29.00', currency: 'EUR' },
        })
      }
    >
      Buy pro
    </button>
  )
}

// Declarative tracking: useTaktEvent returns onClick to spread, and
// <TaktEvent> wraps a child element.
function SignupButton() {
  const onSignup = useTaktEvent({ name: 'Signup', props: { plan: 'free' } })
  return (
    <>
      <button {...onSignup}>Sign up</button>
      <TaktEvent name="Contact" props={{ channel: 'footer' }}>
        <button>Contact</button>
      </TaktEvent>
    </>
  )
}
