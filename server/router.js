import { loginRoute } from './auth.js';
import { SECTIONS, contentRoute } from './content.js';
import { contactFormRoute } from './email.js';
import { json } from './http.js';
import { serveUpload, uploadRoute } from './uploads.js';

// Every request to /api/* and /uploads/* lands here.
// `env.storage` is where content and uploads live; `env.ip` is the visitor's address.
export async function handle(request, env) {
  const path = new URL(request.url).pathname.replace(/\/+$/, '');

  try {
    if (path.startsWith('/uploads/')) return await serveUpload(path, env.storage);
    if (path === '/api/auth/login') return await loginRoute(request, env);
    if (path === '/api/sendEmail') return await contactFormRoute(request, env);
    if (path === '/api/news/upload') return await uploadRoute(request, 'news', env);
    if (path === '/api/documents/upload') return await uploadRoute(request, 'documents', env);

    const section = path.slice('/api/'.length);
    if (path.startsWith('/api/') && SECTIONS.includes(section)) return await contentRoute(request, section, env);

    return json({ error: 'Not found' }, 404);
  } catch (error) {
    console.error(error);
    return json({ error: 'Server error' }, 500);
  }
}
