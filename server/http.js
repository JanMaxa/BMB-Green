export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

// JSON bodies (content, forms, login) are small; anything above 1 MB is treated as invalid.
export async function readJson(request) {
  if (Number(request.headers.get('content-length')) > 1024 * 1024) return null;
  try {
    return await request.json();
  } catch {
    return null;
  }
}

// Kept in memory of one running instance: it stops bursts from one address,
// and starts empty again after a restart.
const hits = new Map();

export function isRateLimited(key, max, windowMs) {
  const now = Date.now();
  if (hits.size > 5000) removeOlderThanAnHour(now);

  const recent = (hits.get(key) || []).filter((time) => now - time < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return true;
  }

  recent.push(now);
  hits.set(key, recent);
  return false;
}

// Every limit's window is shorter than an hour, so these entries no longer count anywhere.
function removeOlderThanAnHour(now) {
  for (const [key, times] of hits) {
    if (times.every((time) => now - time >= 60 * 60 * 1000)) hits.delete(key);
  }
}
