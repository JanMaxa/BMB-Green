import { readFile, writeFile } from 'node:fs/promises';

export function createJsonFileRoute(filePath) {
  return async function handleJsonFileRoute(req, res) {
    if (req.method === 'GET') {
      const json = await readFile(filePath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(json);
      return;
    }

    if (req.method === 'PUT') {
      const body = await readRequestBody(req);
      const parsed = JSON.parse(body);
      await writeFile(filePath, JSON.stringify(parsed, null, 2) + '\n', 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    res.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
  };
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
