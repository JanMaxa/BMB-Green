import { isAdmin } from './auth.js';
import { json, readJson } from './http.js';
import { deleteUpload } from './uploads.js';

// Each section is one file in data/, e.g. data/news.json.
export const SECTIONS = ['balicky', 'contacts', 'documents', 'faq', 'internet', 'locations', 'news', 'televize', 'volani'];

export async function getContent(storage, section) {
  return (await storage.getJson(section)) ?? {};
}

export async function contentRoute(request, section, { storage }) {
  if (request.method === 'GET') return json(await getContent(storage, section));
  if (request.method !== 'PUT') return json({ error: 'Method not allowed' }, 405);
  if (!isAdmin(request)) return json({ error: 'Nepřihlášeno.' }, 401);

  const data = await readJson(request);
  if (!data || typeof data !== 'object') return json({ error: 'Neplatná data.' }, 400);

  const previous = await getContent(storage, section);
  await storage.setJson(section, data);
  await deleteRemovedUploads(storage, previous, data);
  return json({ ok: true });
}

// An uploaded file is deleted once the section that used it is saved without it.
async function deleteRemovedUploads(storage, previous, next) {
  const kept = new Set(uploadPaths(next));
  for (const path of uploadPaths(previous)) {
    if (!kept.has(path)) await deleteUpload(storage, path);
  }
}

function uploadPaths(value) {
  if (typeof value === 'string') return value.trim().startsWith('/uploads/') ? [value.trim()] : [];
  if (value && typeof value === 'object') return Object.values(value).flatMap(uploadPaths);
  return [];
}
