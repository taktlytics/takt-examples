<?php

// Smoke check run in CI: loads the published bundle extension in a bare
// container and renders the snippet. Real apps don't need this file: register
// TaktBundle in config/bundles.php; see the controller and Twig template.

require __DIR__ . '/vendor/autoload.php';

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpFoundation\RequestStack;
use Vskstudio\Takt\SnippetRenderer;
use Vskstudio\Takt\Symfony\DependencyInjection\TaktExtension;

$container = new ContainerBuilder();
$container->registerExtension($ext = new TaktExtension());
$ext->load([['domain' => 'example.com', 'endpoint' => 'https://takt.example.com', 'mode' => 'cdn']], $container);
$container->register('request_stack', RequestStack::class);
$container->compile();

$html = $container->get(SnippetRenderer::class)->render();

if (!str_contains($html, 'data-domain="example.com"')) {
    fwrite(STDERR, "snippet did not render expected attributes\n");
    exit(1);
}

echo "ok: snippet rendered\n";
