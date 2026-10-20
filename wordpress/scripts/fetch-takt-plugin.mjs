import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const PLUGINS = [
  {
    slug: 'takt-analytics',
    version: 'v0.4.0',
    url: 'https://github.com/taktlytics/takt-wordpress/releases/download/v0.4.0/takt-analytics.zip',
    sha256: 'df8e48f4ebdbbef9b5f75d88e2052b7aa7828dae98049e8ca699e59fda361d62',
  },
  {
    slug: 'woocommerce',
    version: '11.2.1',
    url: 'https://downloads.wordpress.org/plugin/woocommerce.11.2.1.zip',
    sha256: '5317434cb381b5fdc7c1dd6ee258324f08c390976aaf8d1199f2a0e9a3ab8586',
  },
];

export const sha256Matches = (buffer, expected) =>
  createHash('sha256').update(buffer).digest('hex') === expected;

const wordpressDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const pluginsDir = join(wordpressDir, 'plugin');

export const fetchPlugin = async (plugin, destination = pluginsDir) => {
  const response = await fetch(plugin.url);
  if (!response.ok) {
    throw new Error(`cannot download ${plugin.slug} ${plugin.version} (${response.status}): ${plugin.url}`);
  }
  const archive = Buffer.from(await response.arrayBuffer());
  if (!sha256Matches(archive, plugin.sha256)) {
    throw new Error(`unexpected SHA-256 for ${plugin.slug} ${plugin.version}, refusing to extract it`);
  }
  const zipPath = join(destination, `${plugin.slug}.zip`);
  rmSync(join(destination, plugin.slug), { recursive: true, force: true });
  mkdirSync(destination, { recursive: true });
  writeFileSync(zipPath, archive);
  execFileSync('unzip', ['-q', '-o', zipPath, '-d', destination]);
  rmSync(zipPath);
  return join(destination, plugin.slug);
};

export const fetchAllPlugins = async (destination = pluginsDir) => {
  const extracted = [];
  for (const plugin of PLUGINS) {
    extracted.push(await fetchPlugin(plugin, destination));
  }
  return extracted;
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const path of await fetchAllPlugins()) {
    console.log(`verified and extracted to ${path}`);
  }
}
