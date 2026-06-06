import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import Busboy from 'busboy';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const UPLOADS_DIR = path.join(__dirname, '..', 'uploads', 'news');

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB raw upload limit
const OUTPUT_WIDTH = 800;           // always resize to this width on output

// Ensure the uploads directory exists when this module loads
await mkdir(UPLOADS_DIR, { recursive: true });

export default async function newsUploadRoute(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const { chunks, error } = await parseUpload(req);

  if (error === 'TOO_LARGE') {
    res.writeHead(413, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Soubor je příliš velký. Maximální velikost je 10 MB.' }));
    return;
  }

  if (error === 'BAD_MIME') {
    res.writeHead(415, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Nepodporovaný formát. Povolené typy: JPEG, PNG, WebP, GIF.' }));
    return;
  }

  if (!chunks || error === 'NO_FILE') {
    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Žádný soubor nebyl nalezen v požadavku.' }));
    return;
  }

  const filename = `${Date.now()}-${randomBytes(3).toString('hex')}.webp`;
  const destPath = path.join(UPLOADS_DIR, filename);

  try {
    const buffer = Buffer.concat(chunks);
    await sharp(buffer)
      .rotate()                                              // auto-rotate from EXIF orientation
      .resize(OUTPUT_WIDTH, null, { withoutEnlargement: true }) // scale to 800px wide; don't upscale small images
      .webp({ quality: 80 })                                 // convert to WebP, strip metadata
      .toFile(destPath);

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ path: `/uploads/news/${filename}` }));
  } catch {
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Zpracování obrázku selhalo.' }));
  }
}

// Parse multipart/form-data and collect the first file's chunks
function parseUpload(req) {
  return new Promise((resolve) => {
    const busboy = Busboy({
      headers: req.headers,
      limits: { files: 1, fileSize: MAX_BYTES },
    });

    let chunks = null;
    let error = null;

    busboy.on('file', (fieldname, stream, info) => {
      if (!ALLOWED_MIME.has(info.mimeType)) {
        error = 'BAD_MIME';
        stream.resume(); // drain so busboy can finish cleanly
        return;
      }

      chunks = [];

      stream.on('data', (chunk) => {
        if (chunks) chunks.push(chunk);
      });

      stream.on('limit', () => {
        error = 'TOO_LARGE';
        chunks = null;
        stream.resume(); // drain remaining bytes
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
