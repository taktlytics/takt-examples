<?php

// Client-side: render the Takt browser snippet into your HTML <head>.
// Run with: php -S localhost:8000 index.php

require __DIR__ . '/vendor/autoload.php';

use Vskstudio\Takt\Mode;
use Vskstudio\Takt\Options;
use Vskstudio\Takt\SnippetRenderer;

// Mode::Sdk renders a full `import{init};init({...})` ES module instead of the
// lightweight data-* snippet. It is the only mode able to express scrubUrl (a
// JS function grafted as raw code), and it carries every advanced option.
$snippet = (new SnippetRenderer(new Options(
    domain: 'example.com',
    endpoint: 'https://takt.example.com',
    mode: Mode::Sdk,
    // scriptOrigin: 'https://stats.example.com', // first-party : sert le tracker depuis votre domaine (anti-adblock)
    // Fire events during local development (Takt's privacy default is true).
    excludeLocalhost: false,
    // Advanced options (Takt 0.5):
    sampleRate: 1.0, // fraction of visitors to track (0 to 1); lower it to sample, e.g. 0.25
    trackQuery: true, // keep the query string on pageviews...
    queryParams: ['utm_source', 'utm_medium', 'utm_campaign'], // ...but only these params
    scrubUrl: '(u) => u.split("#")[0]', // raw JS, Mode::Sdk only: here, drop the #fragment
    redactRoutes: ['/verify/{token}', '/reset/{code}'],
)))->render();

?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Takt PHP example</title>
    <?= $snippet ?>
</head>
<body>
    <h1>Takt PHP example</h1>
    <p>The snippet above tracks page views in the browser.</p>
</body>
</html>
