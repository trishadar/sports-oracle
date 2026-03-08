const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

// Call this with the Clerk getToken function from useAuth()
async function authFetch(url, options = {}, getToken) {
  const token = getToken ? await getToken() : null;
  console.log('Token:', token ? 'exists' : 'MISSING');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(url, { ...options, headers });

  if (res.status === 403) {
    const data = await res.json();
    if (data.error === 'limit_reached') {
      throw new LimitReachedError(data.message, data.used, data.limit, data.plan);
    }
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export class LimitReachedError extends Error {
  constructor(message, used, limit, plan) {
    super(message);
    this.name = 'LimitReachedError';
    this.used = used;
    this.limit = limit;
    this.plan = plan;
  }
}

export async function generateSignal(payload, getToken) {
  return authFetch(`${API_BASE}/predictions/signal`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }, getToken);
}

export async function getDailySlate(sport, getToken) {
  return authFetch(`${API_BASE}/predictions/slate/${sport}`, {}, getToken);
}

export async function analyzeParlay(legs, getToken) {
  return authFetch(`${API_BASE}/predictions/parlay`, {
    method: 'POST',
    body: JSON.stringify({ legs }),
  }, getToken);
}

export async function getUsage(getToken) {
  return authFetch(`${API_BASE}/predictions/usage`, {}, getToken);
}

export async function getLiveGames(sport) {
  const res = await fetch(`${API_BASE}/sports/live/${sport}`);
  if (!res.ok) throw new Error('Failed to get games');
  return res.json();
}

export async function getSportsNews(sport) {
  const res = await fetch(`${API_BASE}/sports/news/${sport}`);
  if (!res.ok) throw new Error('Failed to get news');
  return res.json();
}

export async function getInjuryReport(team) {
  const res = await fetch(`${API_BASE}/sports/injuries/${encodeURIComponent(team)}`);
  if (!res.ok) throw new Error('Failed to get injuries');
  return res.json();
}

export async function getSavedSignals() {
  const res = await fetch(`${API_BASE}/signals`);
  if (!res.ok) throw new Error('Failed to get signals');
  return res.json();
}

export async function saveSignal(signal) {
  const res = await fetch(`${API_BASE}/signals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(signal),
  });
  if (!res.ok) throw new Error('Failed to save signal');
  return res.json();
}
