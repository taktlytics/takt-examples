# takt-examples


> 📚 **Documentation** — [taktlytics.com/docs](https://taktlytics.com/docs)

Minimal, self-contained example apps for [Takt](https://www.npmjs.com/package/@vskstudio/takt-core) — a privacy-friendly, self-hosted analytics SDK — one per framework, for both JavaScript and PHP. Each app consumes the real published `@vskstudio/takt-*` (npm) or `vskstudio/takt-*` (Packagist) package and builds in CI.

Copy any folder, run it, and adapt.

## Examples

| Folder | Package | Stack |
|--------|---------|-------|
| [`vanilla`](vanilla) | [`@vskstudio/takt-core`](https://www.npmjs.com/package/@vskstudio/takt-core) | Vite + TypeScript, no framework |
| [`react`](react) | [`@vskstudio/takt-react`](https://www.npmjs.com/package/@vskstudio/takt-react) | Vite + React |
| [`vue`](vue) | [`@vskstudio/takt-vue`](https://www.npmjs.com/package/@vskstudio/takt-vue) | Vite + Vue 3 |
| [`svelte`](svelte) | [`@vskstudio/takt-svelte`](https://www.npmjs.com/package/@vskstudio/takt-svelte) | Vite + Svelte 5 |
| [`solid`](solid) | [`@vskstudio/takt-solid`](https://www.npmjs.com/package/@vskstudio/takt-solid) | Vite + SolidJS |
| [`angular`](angular) | [`@vskstudio/takt-angular`](https://www.npmjs.com/package/@vskstudio/takt-angular) | Angular 20 standalone |
| [`astro`](astro) | [`@vskstudio/takt-astro`](https://www.npmjs.com/package/@vskstudio/takt-astro) | Astro 5 integration |
| [`php`](php) | [`vskstudio/takt-core-php`](https://packagist.org/packages/vskstudio/takt-core-php) | Plain PHP 8.1+, no framework |
| [`laravel`](laravel) | [`vskstudio/takt-laravel`](https://packagist.org/packages/vskstudio/takt-laravel) | Laravel 11/12 |
| [`symfony`](symfony) | [`vskstudio/takt-symfony`](https://packagist.org/packages/vskstudio/takt-symfony) | Symfony 6.4/7 bundle |
| [`wordpress`](wordpress) | [`takt-wordpress`](https://github.com/taktlytics/takt-wordpress) | WordPress + WooCommerce, verified end-to-end |

## Run one

JavaScript:

```bash
cd react        # or any JS folder above
npm install
npm run dev      # local dev
npm run build    # type-check + production build
```

PHP:

```bash
cd laravel      # or php / symfony
composer install
composer run build    # resolves the published package and renders the snippet
```

The PHP examples render the browser snippet server-side; see each folder's
`track.php`/controller for sending server-to-server events.

WordPress is different: it needs a database, so the [`wordpress`](wordpress) example
runs a real WP + WooCommerce stack in Docker (via `wp-env`) and verifies the plugin
end-to-end with Playwright. See its [README](wordpress/README.md) — it needs Docker.

Each example sets `excludeLocalhost: false` so events fire during local development (Takt's privacy default is `true`). Point `endpoint` at your own Takt instance to collect them.

## First-party / anti-adblock

Each example also ships a commented-out `scriptOrigin` option (JS init/component), `script_origin` (Laravel/Symfony config) or the `data-script-origin` attribute (browser snippet). When set, the tracker and event collection are served from a domain you control (e.g. `https://stats.example.com`), so ad-blockers can no longer tell analytics traffic apart from your own site. Uncomment the line and point it at your custom first-party Takt domain to enable it.

See the Takt docs guide **`/docs/guides/domaine-personnalise`** for how to set up the first-party domain.

## Advanced options (Takt 0.5)

Each example also wires at least one of the advanced tracker options introduced in
Takt 0.5, so you can see the idiomatic spelling per framework (component prop,
plugin/config key, `data-*` attribute, or `init()` field):

| Option | What it does |
|--------|--------------|
| `sampleRate` | Fraction of visitors to track (`0`–`1`); lower it to sample. |
| `trackQuery` | Keep the query string on pageview paths instead of stripping it. |
| `queryParams` | Allowlist of query params to keep when `trackQuery` is on. |
| `scrubUrl` | A function that rewrites each URL before it is sent (dev-controlled). |
| `enabled` | Master kill-switch — set to `false` to disable all tracking at runtime. |
| `tagged` | Autocapture clicks on `[data-takt-tag]` elements. |

Where each option shows up: `vanilla` (`sampleRate`, `tagged`), `react` (`scrubUrl`,
`tagged`), `vue` (`trackQuery`, `queryParams`), `svelte` (`scrubUrl`), `solid`
(`sampleRate`), `angular` (`tagged`), `astro` (`trackQuery`, `queryParams`,
`scrubUrl`).

`scrubUrl` is a function, so it can't be a `data-*` attribute or survive a JSON
config island. In the JS wrappers it is a real prop; for PHP it requires the new
`Mode::Sdk` renderer, which emits a full `import{init};init({…})` ES module — the
[`php`](php) example shows `Mode::Sdk` + `scrubUrl`, and the
[`laravel`](laravel)/[`symfony`](symfony) configs demonstrate the `data-*` options
(with `scrub_url` + `mode: sdk` shown as a commented switch).

## License

MIT
