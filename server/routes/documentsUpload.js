import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import Busboy from 'busboy';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const UPLOADS_DIR = path.join(__dirname, '..', 'uploads', 'documents');

const MAX_BYTES = 20 * 1024 * 1024; // 20 MB

// Ensure uploads directory exists when this module loads
await mkdir(UPLOADS_DIR, { recursive: true });

export default async function documentsUploadRoute(req, res) {
  if (req.method === 'DELETE') {
    const body = await readRequestBody(req);
    let payload = {};
    try {
      payload = JSON.parse(body || '{}');
    } catch {
      payload = {};
    }

    const filePath = payload?.path;
    if (typeof filePath !== 'string' || !filePath.startsWith('/uploads/documents/')) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Neplatná cesta k souboru.' }));
      return;
    }

    const filename = path.basename(filePath);
    if (!filename.endsWith('.pdf')) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Neplatný soubor.' }));
      return;
    }

    try {
      await unlink(path.join(UPLOADS_DIR, filename));
    } catch {
      // ignore missing files
    }

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const { chunks, error } = await parseUpload(req);

  if (error === 'TOO_LARGE') {
    res.writeHead(413, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Soubor je příliš velký. Maximální velikost je 20 MB.' }));
    return;
  }

  if (error === 'BAD_MIME') {
    res.writeHead(415, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Povoleny jsou pouze soubory PDF.' }));
    return;
  }

  if (!chunks || error === 'NO_FILE') {
    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Žádný soubor nebyl nalezen v požadavku.' }));
    return;
  }

  const filename = `${Date.now()}-${randomBytes(3).toString('hex')}.pdf`;
  const destPath = path.join(UPLOADS_DIR, filename);

  try {
    await writeFile(destPath, Buffer.concat(chunks));
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ path: `/uploads/documents/${filename}` }));
  } catch {
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Uložení souboru selhalo.' }));
  }
}

function parseUpload(req) {
  return new Promise((resolve) => {
    const busboy = Busboy({
      headers: req.headers,
      limits: { files: 1, fileSize: MAX_BYTES },
    });

    let chunks = null;
    let error = null;

    busboy.on('file', (fieldname, stream, info) => {
      const mime = info.mimeType?.toLowerCase();
      if (mime !== 'application/pdf') {
        error = 'BAD_MIME';
        stream.resume();
        return;
      }

      chunks = [];

      stream.on('data', (chunk) => {
        if (chunks) chunks.push(chunk);
      });

      stream.on('limit', () => {
        error = 'TOO_LARGE';
        chunks = null;
        stream.resume();
      });
    });

    busboy.on('finish', () => {
      if (!error && chunks === null) error = 'NO_FILE';
      resolve({ chunks, error });
    });

    busboy.on('error', () => {
      resolve({ chunks: null, error: 'PARSE_ERROR' });
    });

    req.pipe(busboy);
  });
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}
