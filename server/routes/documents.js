import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { UPLOADS_DIR } from './documentsUpload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '..', 'data', 'documents.json');

function isLocalUpload(filePath) {
  return typeof filePath === 'string' && filePath.startsWith('/uploads/documents/');
}

// Delete any uploaded PDF files removed between old and new items
async function deleteOrphanedFiles(oldItems, newItems) {
  const newPaths = new Set((newItems ?? []).map((i) => i.path).filter(Boolean));
  const orphans = (oldItems ?? [])
    .map((i) => i.path)
    .filter((p) => isLocalUpload(p) && !newPaths.has(p));

  for (const filePath of orphans) {
    const filename = path.basename(filePath);
    try {
      await unlink(path.join(UPLOADS_DIR, filename));
    } catch {
      // Already gone — ignore
    }
  }
}

export default async function documentsRoute(req, res) {
  if (req.method === 'GET') {
    const json = await readFile(DATA_FILE, 'utf8');
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(json);
    return;
  }

  if (req.method === 'PUT') {
    const body = await readRequestBody(req);
    const newData = JSON.parse(body);

    let oldData = { items: [] };
    try {
      oldData = JSON.parse(await readFile(DATA_FILE, 'utf8'));
    } catch {
      // First write — nothing to diff
    }

    await deleteOrphanedFiles(oldData.items, newData.items);
    await writeFile(DATA_FILE, JSON.stringify(newData, null, 2) + '\n', 'utf8');
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  res.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ error: 'Method not allowed' }));
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
