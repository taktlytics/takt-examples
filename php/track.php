<?php

// Server-side: send an event straight to Takt from PHP (no browser involved).
// Run with: php track.php

require __DIR__ . '/vendor/autoload.php';

use Vskstudio\Takt\Revenue;
use Vskstudio\Takt\Takt;

$takt = (new Takt(
    endpoint: 'https://takt.example.com',
    domain: 'example.com',
    apiKey: getenv('TAKT_API_KEY') ?: 'k_your_ingest_key',
    redactRoutes: ['/verify/{token}', '/reset/{code}'],
    redactUndecodablePaths: true,
))->withVisitor(
    // Attribute the event to the real visitor when you have their request.
    ip: '203.0.113.7',
    userAgent: 'Mozilla/5.0',
);

$takt->event('Signup', ['plan' => 'pro'], new Revenue('29.00', 'EUR'));
$takt->pageview('https://example.com/welcome');
$takt->pageview('https://example.com/verify/abc123');

echo "Events sent.\n";
