const TOKEN_KEY = 'bmb-admin-token';
const IMAGE_WIDTH = 800;

// The token starts with its expiry time, so an expired one shows the login screen straight away.
export function isSignedIn() {
  const expires = Number((localStorage.getItem(TOKEN_KEY) || '').split('.')[0]);
  return expires > Date.now();
}

export function signOut() {
  localStorage.removeItem(TOKEN_KEY);
}

// Every admin call carries the login token; an expired one sends the admin back to the login screen.
async function adminFetch(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { ...options.headers, Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY) || ''}` },
  });

  if (response.status === 401) {
    signOut();
    window.location.reload();
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Požadavek se nepodařil.');
  return data;
}

function sendJson(method, path, body) {
  return adminFetch(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function loadAdminData(endpoint) {
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error('Load failed');
  return response.json();
}

export function saveAdminData(endpoint, data) {
  return sendJson('PUT', endpoint, data);
}

export async function uploadNewsImage(file) {
  const image = await resizeImage(file);
  checkSize(image, 5);

  const formData = new FormData();
  formData.append('image', image, image.name || 'image');
  const data = await adminFetch('/api/news/upload', { method: 'POST', body: formData });
  return data.path; // e.g. "/uploads/news/1748345123-a3f9e1.webp"
}

export async function uploadDocument(file) {
  checkSize(file, 20);

  const formData = new FormData();
  formData.append('file', file);
  const data = await adminFetch('/api/documents/upload', { method: 'POST', body: formData });
  return data.path; // e.g. "/uploads/documents/1748345123-a3f9e1.pdf"
}

export function deleteUploadedDocument(docPath) {
  return sendJson('DELETE', '/api/documents/upload', { path: docPath });
}

export async function loginAdmin(password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.token) throw new Error(data.error || 'Přihlášení se nepodařilo.');
  localStorage.setItem(TOKEN_KEY, data.token);
}

function checkSize(file, maxMegabytes) {
  if (file.size > maxMegabytes * 1024 * 1024) throw new Error(`Soubor je příliš velký. Maximální velikost je ${maxMegabytes} MB.`);
}

// Photos are shrunk to 800 px wide in the browser before upload; WebP where the browser can encode it.
async function resizeImage(file) {
  if (file.type === 'image/gif') return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, IMAGE_WIDTH / bitmap.width);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.8));
    if (!blob) return file;
    const extension = blob.type === 'image/webp' ? 'webp' : 'png';
    return new File([blob], `image.${extension}`, { type: blob.type });
  } catch {
    return file;
  }
}
