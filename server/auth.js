import { createHmac, timingSafeEqual } from 'node:crypto';
import { isRateLimited, json, readJson } from './http.js';

const TOKEN_DAYS = 30;

// The password is ADMIN_PASSWORD in .env. Login tokens are signed with it,
// so changing it in .env signs every browser out.
export function isAdmin(request) {
  const password = process.env.ADMIN_PASSWORD;
  const header = request.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : '';
  const [expires, signature] = token.split('.');
  if (!password || !expires || !signature || Number(expires) < Date.now()) return false;

  return safeEqual(signature, sign(password, expires));
}

export async function loginRoute(request, { ip }) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  if (isRateLimited(`login:${ip}`, 10, 15 * 60 * 1000)) {
    return json({ error: 'Příliš mnoho pokusů. Zkuste to znovu za 15 minut.' }, 429);
  }

  const password = process.env.ADMIN_PASSWORD;
  const body = (await readJson(request)) || {};
  if (!password || typeof body.password !== 'string' || !safeEqual(body.password, password)) {
    return json({ error: 'Nesprávné heslo.' }, 401);
  }

  const expires = String(Date.now() + TOKEN_DAYS * 24 * 60 * 60 * 1000);
  return json({ token: `${expires}.${sign(password, expires)}` });
}

function sign(key, value) {
  return createHmac('sha256', key).update(value).digest('hex');
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && timingSafeEqual(left, right);
}
