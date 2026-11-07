import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import https from 'node:https';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import esbuild from 'esbuild';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const slashPath = (relative) => path.join(root, relative).replace(/\\/g, '/');

// Resolve dynamic SEO pages before touching dist. A failed network request must
// not silently publish a truncated sitemap or destroy the last successful build.
const siteOrigin = 'https://tamanharapanmu.com';
const seoApiOrigin = (process.env.SIMK_SEO_API_ORIGIN || siteOrigin).replace(/\/$/, '');
const execFileAsync = promisify(execFile);

const jsonViaHttpsIpv4 = (url) => new Promise((resolve, reject) => {
  const request = https.get(url, {
    family: 4,
    timeout: 20000,
    headers: { Accept: 'application/json' },
  }, (response) => {
    if (response.statusCode !== 200) {
      response.resume();
      reject(new Error(`HTTP ${response.statusCode}`));
      return;
    }
    let body = '';
    response.setEncoding('utf8');
    response.on('data', (chunk) => {
      body += chunk;
      if (body.length > 8 * 1024 * 1024) {
        request.destroy(new Error('Respons SEO terlalu besar'));
      }
    });
    response.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch (error) { reject(error); }
    });
    response.on('error', reject);
  });
  request.on('timeout', () => request.destroy(new Error('HTTPS IPv4 timeout')));
  request.on('error', reject);
});

const jsonViaWindowsPowerShell = async (url) => {
  // Windows PowerShell uses the system's proxy/TLS settings. This fallback is
  // useful when Node's own network stack cannot reach an otherwise working API.
  const safeUrl = url.replace(/'/g, "''");
  const command = `$ProgressPreference = 'SilentlyContinue'; [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false); (Invoke-WebRequest -UseBasicParsing -TimeoutSec 30 -Uri '${safeUrl}').Content`;
  const encoded = Buffer.from(command, 'utf16le').toString('base64');
  const { stdout } = await execFileAsync('powershell.exe', [
    '-NoProfile', '-NonInteractive', '-EncodedCommand', encoded,
  ], { timeout: 35000, maxBuffer: 12 * 1024 * 1024, windowsHide: true });
  return JSON.parse(stdout.trim().replace(/^\uFEFF/, ''));
};

const fetchSeoData = async (apiPath) => {
  const url = `${seoApiOrigin}/api/v1/${apiPath}`;
  const failures = [];
  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    failures.push(`Node fetch: ${error.message}`);
  }
  try {
    return await jsonViaHttpsIpv4(url);
  } catch (error) {
    failures.push(`HTTPS IPv4: ${error.message}`);
  }
  if (process.platform === 'win32') {
    try {
      return await jsonViaWindowsPowerShell(url);
    } catch (error) {
      failures.push(`Windows PowerShell: ${error.message}`);
    }
  }
  throw new Error(`SEO API ${apiPath} tidak dapat diakses: ${failures.join('; ')}`);
};

const seoSources = [];
for (const [apiPath, prefix] of [['articles', '/berita/'], ['campaigns', '/campaign/']]) {
  const payload = await fetchSeoData(apiPath);
  if (!Array.isArray(payload?.data)) {
    throw new Error(`SEO API ${apiPath} tidak mengembalikan array data. Build dibatalkan.`);
  }
  seoSources.push({ apiPath, prefix, items: payload.data });
  console.log(`SEO API ${apiPath}: ${payload.data.length} item`);
}

const copyTree = async (source, destination) => {
  await fs.mkdir(destination, { recursive: true });
  for (const entry of await fs.readdir(source, { withFileTypes: true })) {
    if (['dist', 'node_modules', '.git', 'scripts'].includes(entry.name)) continue;
    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      await copyTree(from, to);
    } else if (entry.isFile() && !entry.name.toLowerCase().endsWith('.jsx')) {
      // Source JSX is not needed by browsers after compilation.
      await fs.copyFile(from, to);
    }
  }
};

await fs.rm(dist, { recursive: true, force: true });
await fs.mkdir(dist, { recursive: true });
for (const folder of ['js', 'css', 'assets']) {
  const source = path.join(root, folder);
  if (await fs.stat(source).catch(() => null)) {
    await copyTree(source, path.join(dist, folder));
  }
}

let html = await fs.readFile(path.join(root, 'index.html'), 'utf8');
const originalHtml = html;

// Preserve the original Tailwind theme using a build-time configuration.
// There is no need for another tailwind.config.cjs file.
const tailwindConfig = {
  content: [
    slashPath('index.html'),
    slashPath('js/**/*.{js,jsx}'),
    slashPath('css/**/*.css'),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        emerald: {
          50: '#ecfdf5', 100: '#d1fae5', 500: '#10b981',
          600: '#059669', 700: '#047857', 800: '#065f46',
          900: '#064e3b', 950: '#022c22',
        },
        teal: {
          50: '#f0fdfa', 100: '#ccfbf1', 500: '#14b8a6',
          600: '#0d9488', 700: '#0f766e', 800: '#115e59',
          900: '#134e4a',
        },
        indigo: {
          50: '#eef2ff', 100: '#e0e7ff', 500: '#6366f1',
          600: '#4f46e5', 700: '#4338ca', 800: '#3730a3',
          900: '#312e81',
        },
      },
    },
  },
  plugins: [],
};

// The development page remains untouched. Only dist/index.html is rewritten.
html = html.replace(
  /<script\s+src="https:\/\/(?:cdn\.tailwindcss\.com|cdn\.jsdelivr\.net\/npm\/@tailwindcss\/browser[^\"]*)"\s*><\/script>/gi,
  '<link rel="stylesheet" href="/css/tailwind.production.css">',
);
html = html.replace(/<script>\s*tailwind\.config\s*=\s*\{[\s\S]*?\};\s*<\/script>/g, '');
html = html.replace(/<script\s+src="https:\/\/unpkg\.com\/@babel\/standalone[^\"]*"\s*><\/script>/gi, '');

// The old favicon asset was removed when images moved to Laravel public storage.
html = html.replace('href="/assets/images/logo-panti.png"', 'href="/storage/site/logo-panti.png"');

const jsxPattern = /<script\s+type="text\/babel"\s+src="([^"]+\.jsx)(\?[^"]*)?"\s*><\/script>/gi;
const matches = [...html.matchAll(jsxPattern)];
if (!matches.length) throw new Error('No Babel JSX script sources found in index.html');

for (const match of matches) {
  const relative = match[1];
  const sourceFile = path.resolve(root, relative);
  if (!sourceFile.startsWith(path.join(root, 'js') + path.sep)) {
    throw new Error(`Unsafe JSX path: ${relative}`);
  }
  const source = await fs.readFile(sourceFile, 'utf8');
  const compiled = await esbuild.transform(source, {
    loader: 'jsx', jsx: 'transform', target: ['es2019'],
    minifySyntax: true, minifyWhitespace: true, minifyIdentifiers: false,
    sourcefile: relative,
  });
  const outputRelative = relative.replace(/\.jsx$/i, '.compiled.js');
  const outputFile = path.join(dist, outputRelative);
  await fs.mkdir(path.dirname(outputFile), { recursive: true });
  await fs.writeFile(outputFile, compiled.code);
  html = html.replace(match[0], `<script src="/${outputRelative}"></script>`);
}

// The ReactDOM.createRoot(<App />) block is also Babel JSX.
const inlineJsxPattern = /<script\s+type="text\/babel"\s*>([\s\S]*?)<\/script>/gi;
const inlineMatches = [...html.matchAll(inlineJsxPattern)];
for (const match of inlineMatches) {
  const compiled = await esbuild.transform(match[1], {
    loader: 'jsx', jsx: 'transform', target: ['es2019'],
    minifySyntax: true, minifyWhitespace: true, minifyIdentifiers: false,
    sourcefile: 'index-inline.jsx',
  });
  html = html.replace(match[0], `<script>${compiled.code}</script>`);
}

const cssInput = '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n';
const cssPath = path.join(dist, 'css', 'tailwind.production.css');
const result = await postcss([tailwindcss(tailwindConfig)]).process(cssInput, {
  from: path.join(root, 'css', 'tailwind.input.css'),
  to: cssPath,
});
await fs.mkdir(path.dirname(cssPath), { recursive: true });
await fs.writeFile(cssPath, result.css);

if (originalHtml.includes('cdn.tailwindcss.com') && html.includes('cdn.tailwindcss.com')) {
  throw new Error('Tailwind Play CDN was not removed');
}
if (/text\/babel|@babel\/standalone|cdn\.tailwindcss\.com|tailwind\.config\s*=/.test(html)) {
  throw new Error('Development-only runtime remains in the production index');
}
await fs.writeFile(path.join(dist, 'index.html'), html);
console.log(`Production frontend ready: ${matches.length} JSX files, ${inlineMatches.length} inline JSX script(s), Tailwind CSS`);
console.log(`Output: ${dist}`);

// The full sitemap is generated only after both APIs were fetched successfully.
const pages = new Set(['/', '/profil', '/donasi', '/keuangan-publik', '/program', '/berita', '/faq']);
const seoEntries = [];
for (const { apiPath, prefix, items } of seoSources) {
  for (const item of items) {
    const slug = String(item?.slug || '');
    if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      pages.add(prefix + slug + '/');
      seoEntries.push({ prefix, slug, item, article: apiPath === 'articles' });
    }
  }
}
const escapeXml = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  [...pages].map((page) => `  <url><loc>${escapeXml(siteOrigin + page)}</loc></url>`).join('\n') +
  '\n</urlset>\n';
await fs.writeFile(path.join(dist, 'sitemap.xml'), xml);
await fs.writeFile(path.join(dist, 'robots.txt'), 'User-agent: *\nAllow: /\nDisallow: /pengelola/\nDisallow: /login\nDisallow: /register\nDisallow: /dashboard\nDisallow: /laporan\nSitemap: https://tamanharapanmu.com/sitemap.xml\n');

// Server-readable HTML for known public article/program detail URLs. React will
// hydrate through createRoot() on the client; non-JavaScript crawlers see the
// title and excerpt rather than an empty SPA root. This is build-time content.
const escapeHtml = (text) => String(text ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
for (const { prefix, slug, item, article } of seoEntries) {
  const title = String(item.title || '').trim();
  if (!title) continue;
  const sourceDescription = article ? (item.excerpt || item.content || '') : (item.description || '');
  const description = String(sourceDescription).replace(/<[^>]+>/g, '').trim().slice(0, 165);
  const canonical = `${siteOrigin}${prefix}${slug}/`;
  let detailHtml = html;
  detailHtml = detailHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)} | LKSA Taman Harapan Muhammadiyah</title>`);
  detailHtml = detailHtml.replace(/(<meta\s+name="description"\s+content=")[^"]*(")/i, `$1${escapeHtml(description)}$2`);
  detailHtml = detailHtml.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/i, `$1${escapeHtml(canonical)}$2`);
  detailHtml = detailHtml.replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/i, `$1${escapeHtml(title)}$2`);
  detailHtml = detailHtml.replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/i, `$1${escapeHtml(description)}$2`);
  detailHtml = detailHtml.replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/i, `$1${escapeHtml(canonical)}$2`);
  const initialContent = `<main style="margin:4rem auto;max-width:780px;padding:1rem;font-family:sans-serif"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p><p><a href="/">LKSA Taman Harapan Muhammadiyah</a></p></main>`;
  detailHtml = detailHtml.replace('<div id="root"></div>', `<div id="root">${initialContent}</div>`);
  const target = path.join(dist, prefix.slice(1), slug, 'index.html');
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, detailHtml);
}
console.log(`SEO build: ${seoEntries.length} detail pages, ${pages.size} sitemap URLs`);
