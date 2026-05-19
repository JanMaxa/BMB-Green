export default async function authRoute(req, res) {
  if (req.method === 'POST' && req.url === '/api/auth/login') {
    const body = await readRequestBody(req);
    const credentials = JSON.parse(body || '{}');
    const isValid = credentials.username === 'admin' && credentials.password === 'admin';

    res.writeHead(isValid ? 200 : 401, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(isValid ? { ok: true, user: { name: 'Admin' } } : { error: 'Invalid credentials' }));
    return;
  }

  if (req.method === 'POST' && req.url === '/api/auth/logout') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (req.method === 'GET' && req.url === '/api/auth/me') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ authenticated: false }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ error: 'Not found' }));
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}
