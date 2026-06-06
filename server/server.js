import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import balickyRoute from './routes/balicky.js';
import internetRoute from './routes/internet.js';
import televizeRoute from './routes/televize.js';
import volaniRoute from './routes/volani.js';
import locationsRoute from './routes/locations.js';
import newsRoute from './routes/news.js';
import newsUploadRoute, { UPLOADS_DIR as NEWS_UPLOADS_DIR } from './routes/newsUpload.js';
import documentsRoute from './routes/documents.js';
import documentsUploadRoute, { UPLOADS_DIR as DOCS_UPLOADS_DIR } from './routes/documentsUpload.js';
import faqRoute from './routes/faq.js';
import authRoute from './routes/auth.js';
import sendEmailRoute from './routes/sendEmail.js';
import contactsRoute from './routes/contacts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8090;
const allowedOrigins = new Set(['http://localhost:5173', 'http://127.0.0.1:5173']);

const server = http.createServer(async (req, res) => {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    // Static: uploaded news images
    if (req.url?.startsWith('/uploads/news/')) {
      await serveNewsImage(req, res);
      return;
    }

    // Static: uploaded PDF documents
    if (req.url?.startsWith('/uploads/documents/')) {
      await serveDocument(req, res);
      return;
    }

    if (req.url === '/api/balicky') {
      await balickyRoute(req, res);
      return;
    }

    if (req.url === '/api/internet') {
      await internetRoute(req, res);
      return;
    }

    if (req.url === '/api/televize') {
      await televizeRoute(req, res);
      return;
    }

    if (req.url === '/api/volani') {
      await volaniRoute(req, res);
      return;
    }

    if (req.url === '/api/locations') {
      await locationsRoute(req, res);
      return;
    }

    // Upload route must come before the general /api/news handler
    if (req.url === '/api/news/upload') {
      await newsUploadRoute(req, res);
      return;
    }

    if (req.url === '/api/news') {
      await newsRoute(req, res);
      return;
    }

    // Upload route must come before the general /api/documents handler
    if (req.url === '/api/documents/upload') {
      await documentsUploadRoute(req, res);
      return;
    }

    if (req.url === '/api/documents') {
      await documentsRoute(req, res);
      return;
    }

    if (req.url === '/api/faq') {
      await faqRoute(req, res);
      return;
    }

    if (req.url === '/api/contacts') {
      await contactsRoute(req, res);
      return;
    }

    if (req.url?.startsWith('/api/auth')) {
      await authRoute(req, res);
      return;
    }

    if (req.url === '/api/sendEmail') {
      await sendEmailRoute(req, res);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Not found' }));
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Server error' }));
  }
});

server.listen(PORT, () => {
  console.log(`BMB-Green API server is running on http://localhost:${PORT}`);
});

function setCorsHeaders(req, res) {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
}

async function serveNewsImage(req, res) {
  // path.basename strips any directory traversal attempts
  const filename = path.basename(req.url.split('?')[0]);

  if (!filename.endsWith('.webp')) {
    res.writeHead(400);
    res.end();
    return;
  }

  try {
    const data = await readFile(path.join(NEWS_UPLOADS_DIR, filename));
    res.writeHead(200, {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
    });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end();
  }
}

async function serveDocument(req, res) {
  const filename = path.basename(req.url.split('?')[0]);

  if (!filename.endsWith('.pdf')) {
    res.writeHead(400);
    res.end();
    return;
  }

  try {
    const data = await readFile(path.join(DOCS_UPLOADS_DIR, filename));
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline',
    });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end();
  }
}
