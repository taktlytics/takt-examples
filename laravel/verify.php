<?php

// Smoke check run in CI: boots the published service provider in a bare
// container and renders the snippet. Real apps don't need this file. Laravel
// auto-discovers the provider; see the controller and Blade view.

require __DIR__ . '/vendor/autoload.php';

use Illuminate\Config\Repository;
use Illuminate\Container\Container;
use Vskstudio\Takt\Laravel\TaktServiceProvider;
use Vskstudio\Takt\SnippetRenderer;

$app = new Container();
Container::setInstance($app);
$app->instance('config', new Repository(['takt' => require __DIR__ . '/config/takt.php']));

(new TaktServiceProvider($app))->register();

$html = $app->make(SnippetRenderer::class)->render();

if (!str_contains($html, 'data-domain="example.com"')) {
    fwrite(STDERR, "snippet did not render expected attributes\n");
    exit(1);
}

echo "ok: snippet rendered\n";
