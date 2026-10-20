<?php

// Smoke check run in CI: proves the published package resolves and the snippet
// renders. Real apps don't need this file. See index.php and track.php.

require __DIR__ . '/vendor/autoload.php';

use Vskstudio\Takt\Mode;
use Vskstudio\Takt\Options;
use Vskstudio\Takt\SnippetRenderer;

$html = (new SnippetRenderer(new Options(domain: 'example.com', mode: Mode::Cdn)))->render();

if (!str_contains($html, 'data-domain="example.com"')) {
    fwrite(STDERR, "snippet did not render expected attributes\n");
    exit(1);
}

echo "ok: snippet rendered\n";
