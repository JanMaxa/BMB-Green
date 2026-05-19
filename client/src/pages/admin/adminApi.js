const API_BASE_URL = import.meta.env.VITE_USE_LOCAL_API === 'true' ? 'http://localhost:8090' : '';

export async function loadAdminData(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) throw new Error('Load failed');
  return response.json();
}

export async function saveAdminData(endpoint, data) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Save failed');
  return response.json();
}

export async function loginAdmin(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
