import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PLUGINS, fetchPlugin, sha256Matches } from './fetch-takt-plugin.mjs';

const here = dirname(fileURLToPath(import.meta.url));

test('every plugin is pinned to an explicit version and a URL that names it', () => {
  for (const plugin of PLUGINS) {
    assert.match(plugin.version, /^v?\d+\.\d+\.\d+$/, plugin.slug);
    assert.ok(plugin.url.includes(plugin.version), `${plugin.slug} URL must name ${plugin.version}`);
    assert.ok(!plugin.url.includes('latest'), plugin.slug);
  }
});

test('every plugin carries a 64-character hex SHA-256', () => {
  for (const plugin of PLUGINS) {
    assert.match(plugin.sha256, /^[0-9a-f]{64}$/, plugin.slug);
  }
});

test('sha256Matches accepts the exact digest and rejects any other content', () => {
  const payload = Buffer.from('takt-analytics');
  const digest = createHash('sha256').update(payload).digest('hex');
  assert.equal(sha256Matches(payload, digest), true);
  assert.equal(sha256Matches(Buffer.from('tampered'), digest), false);
});

test('fetchPlugin refuses an archive whose checksum does not match', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(Buffer.from('not the plugin'), { status: 200 });
  const destination = mkdtempSync(join(tmpdir(), 'takt-plugin-'));
  try {
    await assert.rejects(
      fetchPlugin({ ...PLUGINS[0], url: 'https://example.invalid/takt-analytics.zip' }, destination),
      /unexpected SHA-256/,
    );
    assert.equal(existsSync(join(destination, 'takt-analytics')), false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('wp-env loads the verified local plugin folders, not remote URLs', () => {
  const config = JSON.parse(readFileSync(join(here, '..', '.wp-env.json'), 'utf8'));
  assert.deepEqual(config.plugins, ['./plugin/takt-analytics', './plugin/woocommerce']);
});
