import { randomBytes } from 'node:crypto';
import { isAdmin } from './auth.js';
import { json, readJson } from './http.js';

const KINDS = {
  news: {
    field: 'image',
    maxMegabytes: 5,
    extensions: { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif' },
    typeError: 'Nepodporovaný formát. Povolené typy: JPEG, PNG, WebP, GIF.',
  },
  documents: {
    field: 'file',
    maxMegabytes: 20,
    extensions: { 'application/pdf': 'pdf' },
    typeError: 'Povoleny jsou pouze soubory PDF.',
  },
};

const CONTENT_TYPES = { webp: 'image/webp', jpg: 'image/jpeg', png: 'image/png', gif: 'image/gif', pdf: 'application/pdf' };
const UPLOAD_PATH = /^\/uploads\/(news|documents)\/[\w-]+\.(webp|jpg|png|gif|pdf)$/;

export async function uploadRoute(request, kind, { storage }) {
  if (!isAdmin(request)) return json({ error: 'Nepřihlášeno.' }, 401);

  if (request.method === 'DELETE') {
    const body = await readJson(request);
    if (!(await deleteUpload(storage, body?.path))) return json({ error: 'Neplatná cesta k souboru.' }, 400);
    return json({ ok: true });
  }

  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const { field, maxMegabytes, extensions, typeError } = KINDS[kind];
  let file = null;
  try {
    file = (await request.formData()).get(field);
  } catch {
    file = null;
  }

  if (!file || typeof file === 'string') return json({ error: 'Žádný soubor nebyl nalezen v požadavku.' }, 400);
  const extension = extensions[file.type];
  if (!extension) return json({ error: typeError }, 415);
  if (file.size > maxMegabytes * 1024 * 1024) return json({ error: `Soubor je příliš velký. Maximální velikost je ${maxMegabytes} MB.` }, 413);

  const filePath = `/uploads/${kind}/${Date.now()}-${randomBytes(3).toString('hex')}.${extension}`;
  await storage.setFile(filePath.slice(1), new Uint8Array(await file.arrayBuffer()));
  return json({ path: filePath });
}

export async function serveUpload(path, storage) {
  const match = UPLOAD_PATH.exec(path);
  const data = match && (await storage.getFile(path.slice(1)));
  if (!data) return new Response('Not found', { status: 404 });

  return new Response(data, {
    headers: {
      'Content-Type': CONTENT_TYPES[match[2]],
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export async function deleteUpload(storage, path) {
  if (typeof path !== 'string' || !UPLOAD_PATH.test(path)) return false;
  await storage.deleteFile(path.slice(1));
  return true;
}
