import http from 'node:http';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { isMailConfigured } from './email.js';
import { handle } from './router.js';
import { createFileStorage } from './storage.js';

// Runs the whole site: the API, uploaded files, and the built client.
const here = path.dirname(fileURLToPath(import.meta.url));

try {
  process.loadEnvFile(path.join(here, '.env'));
} catch {
  console.warn('No .env file found — copy .env.example to .env and fill it in.');
}

const PORT = Number(process.env.PORT) || 8090;
const SITE_DIR = path.join(here, '..', 'client', 'dist');
const storage = createFileStorage(path.join(here, 'data'));

if (!process.env.ADMIN_PASSWORD) console.warn('ADMIN_PASSWORD is not set in .env — the admin cannot sign in.');
if (!isMailConfigured()) console.warn('SMTP_* or MAIL_TO_* is missing in .env — the contact forms cannot send e-mail.');

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

// Request bodies above this size are refused before they are read into memory.
const MAX_BODY_BYTES = 25 * 1024 * 1024;

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');

    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/uploads/')) {
      const body = await readBody(req);
      if (body === null) {
        res.writeHead(413, { 'Content-Type': 'application/json; charset=utf-8', Connection: 'close' });
        res.end(JSON.stringify({ error: 'Požadavek je příliš velký.' }));
        return;
      }
      const response = await handle(toRequest(req, url, body), { storage, ip: visitorAddress(req) });
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(Buffer.from(await response.arrayBuffer()));
      return;
    }

    await serveSite(url.pathname, res);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) res.writeHead(500);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`BMB-Green is running on http://localhost:${PORT}`);
});

// The visitor's address. X-Forwarded-For counts only when the request comes from a proxy on this
// machine or the internal network; its last entry is the one that proxy added, so a visitor cannot choose it.
function visitorAddress(req) {
  const direct = (req.socket.remoteAddress || '').replace(/^::ffff:/, '');
  const forwarded = req.headers['x-forwarded-for'];
  if (isInternalAddress(direct) && typeof forwarded === 'string') return forwarded.split(',').pop().trim() || direct;
  return direct;
}

function isInternalAddress(address) {
  return address === '::1'
    || /^127\./.test(address)
    || /^10\./.test(address)
    || /^192\.168\./.test(address)
    || /^172\.(1[6-9]|2\d|3[01])\./.test(address)
    || /^f[cd]/i.test(address);
}

// Reads the whole body, or answers null once it grows past MAX_BODY_BYTES.
function readBody(req) {
  if (req.method === 'GET' || req.method === 'HEAD') return Promise.resolve(Buffer.alloc(0));
  if (Number(req.headers['content-length']) > MAX_BODY_BYTES) return Promise.resolve(null);

  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        req.pause();
        resolve(null);
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function toRequest(req, url, body) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(req.headers)) {
    if (typeof value === 'string') headers.set(name, value);
  }

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  return new Request(url, { method: req.method, headers, body: hasBody ? body : undefined });
}

// Built files are served as they are; every other path gets index.html and the client picks the page.
// Files in /assets/ with a content hash in the name never change, so browsers may cache them for good.
async function serveSite(pathname, res) {
  let decoded = '/';
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    // A malformed address gets the page like any other unknown path.
  }
  const filePath = path.join(SITE_DIR, path.normalize(decoded));
  const insideSite = filePath.startsWith(SITE_DIR + path.sep);
  const extension = path.extname(filePath);

  if (insideSite && CONTENT_TYPES[extension]) {
    try {
      const data = await readFile(filePath);
      const hashed = /^\/assets\/.+-[\w-]{8}\.\w+$/.test(pathname);
      res.writeHead(200, {
        'Content-Type': CONTENT_TYPES[extension],
        ...(hashed && { 'Cache-Control': 'public, max-age=31536000, immutable' }),
      });
      res.end(data);
      return;
    } catch {
      // Not a built file — fall through to the page.
    }
  }

  try {
    const page = await readFile(path.join(SITE_DIR, 'index.html'));
    res.writeHead(200, { 'Content-Type': CONTENT_TYPES['.html'] });
    res.end(page);
  } catch {
    res.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('The client is not built yet. Run `npm run build` in client/.');
  }
}
