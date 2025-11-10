const API_BASE = import.meta.env.VITE_API_BASE || '/api';

async function http(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const error = new Error(data?.error || 'Erro na requisição');
    error.details = data?.details;
    error.status = res.status;
    throw error;
  }
  return data;
}

// Actors
export const ActorsApi = {
  list: () => http('/actors'),
  create: (payload) => http('/actors', { method: 'POST', body: JSON.stringify(payload) }),
};

// Movies
export const MoviesApi = {
  list: () => http('/movies'),
  get: (id) => http(`/movies/${id}`),
  create: (payload) => http('/movies', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => http(`/movies/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  delete: (id) => http(`/movies/${id}`, { method: 'DELETE' }),
};
