#!/usr/bin/env node
/* Injects PWA + OG meta tags into dist/index.html after `expo export --platform web`. */
const fs = require('fs');
const path = require('path');

const DIST = path.resolve(__dirname, '..', 'dist');
const INDEX = path.join(DIST, 'index.html');

if (!fs.existsSync(INDEX)) {
  console.error('postbuild: dist/index.html not found — run expo export first.');
  process.exit(1);
}

const TITLE = 'VION Vibracional — Em que frequência vibras?';
const DESCRIPTION =
  'Mapeia o teu nível de consciência em 24 situações reais. 17 níveis baseados na escala de Hawkins. Para reflexão pessoal.';
const URL = 'https://vion.vercel.app';
const OG_IMAGE = `${URL}/og-image.png`;

const HEAD_BLOCK = `
  <title>${TITLE}</title>
  <meta name="description" content="${DESCRIPTION}" />
  <meta name="theme-color" content="#7C5CFC" />
  <meta name="color-scheme" content="dark" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="VION" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="application-name" content="VION Vibracional" />

  <link rel="manifest" href="/manifest.json" />
  <link rel="icon" type="image/png" href="/favicon.png" />
  <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
  <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.png" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="VION Vibracional" />
  <meta property="og:locale" content="pt_PT" />
  <meta property="og:title" content="${TITLE}" />
  <meta property="og:description" content="${DESCRIPTION}" />
  <meta property="og:url" content="${URL}" />
  <meta property="og:image" content="${OG_IMAGE}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="VION Vibracional" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${TITLE}" />
  <meta name="twitter:description" content="${DESCRIPTION}" />
  <meta name="twitter:image" content="${OG_IMAGE}" />

  <style>
    html, body { background-color: #030308; }
    body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
  </style>
`;

let html = fs.readFileSync(INDEX, 'utf8');

// Remove auto-generated title + description + theme-color so we don't end up with duplicates.
html = html.replace(/<title>[\s\S]*?<\/title>/i, '');
html = html.replace(/<meta\s+name="description"[^>]*\/?>/gi, '');
html = html.replace(/<meta\s+name="theme-color"[^>]*\/?>/gi, '');
html = html.replace(/<link\s+rel="shortcut icon"[^>]*\/?>/gi, '');

html = html.replace('</head>', `${HEAD_BLOCK}</head>`);

fs.writeFileSync(INDEX, html);
console.log('postbuild: injected PWA + OG meta tags into dist/index.html');
