import http from 'node:http';
import balickyRoute from './routes/balicky.js';
import internetRoute from './routes/internet.js';
import televizeRoute from './routes/televize.js';
import locationsRoute from './routes/locations.js';
import newsRoute from './routes/news.js';
import authRoute from './routes/auth.js';
import sendEmailRoute from './routes/sendEmail.js';

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

    if (req.url === '/api/locations') {
      await locationsRoute(req, res);
      return;
    }

    if (req.url === '/api/news') {
      await newsRoute(req, res);
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
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
}
