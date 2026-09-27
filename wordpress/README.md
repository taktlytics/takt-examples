# Takt WordPress example

A real WordPress + WooCommerce site running the [Takt Analytics plugin](https://github.com/taktlytics/takt-wordpress), verified end-to-end with [Playwright](https://playwright.dev) against a mocked Takt ingest. It proves the two things the plugin promises:

1. the Takt **snippet** is injected into `<head>` and fires a **pageview** beacon;
2. a completed **WooCommerce order** sends a server-to-server **Purchase** event with revenue.

Unlike the other examples, this one isn't a single app you `npm run build`: WordPress needs a database, so it runs in Docker via [`wp-env`](https://www.npmjs.com/package/@wordpress/env).

## Requirements

- Docker (for `wp-env`)
- Node 20+

## Run it

```bash
npm install
npx playwright install chromium
npm run e2e        # starts WP + WooCommerce, configures the plugin, runs Playwright
```

`npm run e2e` does three things:

1. `wp-env start` — boots WordPress, downloads WooCommerce and the Takt plugin (the [latest release ZIP](https://github.com/taktlytics/takt-wordpress/releases), per `.wp-env.json`);
2. `wp eval-file …/setup-wp.php` — points the plugin at the mock ingest (`domain=localhost`, localhost tracking on);
3. `playwright test` — the mock ingest (`e2e/mock-ingest.cjs`) starts automatically as Playwright's `webServer`, then the specs run.

Stop everything with `npm run env:stop` (or `npm run env:clean` to wipe the instance).

## How the pieces fit

| Path | Role |
| --- | --- |
| `.wp-env.json` | WordPress + WooCommerce + the Takt plugin, plus a mapping of `e2e/wp` to `wp-content/takt-e2e`. |
| `e2e/mock-ingest.cjs` | Stand-in ingest: records `POST /api/event`, serves them on `GET /__events`. |
| `e2e/snippet.spec.js` | Asserts the `<head>` snippet and the pageview beacon. |
| `e2e/purchase.spec.js` | Triggers a WooCommerce order, asserts the S2S `Purchase` event and revenue. |
| `e2e/wp/setup-wp.php` | Configures the plugin (run through wp-cli). |
| `e2e/wp/trigger-order.php` | Creates and completes an order (run through wp-cli). |

The S2S endpoint is `http://host.docker.internal:9911`, so the WordPress container reaches the mock ingest running on the host.

## Running against a local plugin build

Before a release is published, point `wp-env` at a locally built ZIP instead of the release URL. Unzip [`takt-wordpress`](https://github.com/taktlytics/takt-wordpress)'s `dist/takt-analytics.zip` into `./plugin/takt-analytics`, then add a `.wp-env.override.json` (git-ignored):

```json
{
  "plugins": ["./plugin/takt-analytics", "https://downloads.wordpress.org/plugin/woocommerce.zip"],
  "mappings": { "wp-content/takt-e2e": "./e2e/wp" },
  "config": { "WP_DEBUG": true }
}
```
