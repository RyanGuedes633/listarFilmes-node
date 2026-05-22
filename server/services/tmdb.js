// Busca séries populares (TV)
export const buscarFilmes = async () => {
   const apiKey = process.env.TMDB_API_KEY;

   if (!apiKey) {
      throw new Error('Chave da API do TMDB não encontrada. Verifique as variáveis de ambiente.');
   }

   const url = new URL('https://api.themoviedb.org/3/tv/popular');
   url.searchParams.append('api_key', apiKey);
   url.searchParams.append('language', 'pt-BR');

   const response = await fetch(url);

   if (!response.ok) {
      throw new Error(`Erro ao buscar séries: ${response.status} ${response.statusText}`);
   }

    const data = await response.json();
    return data.results; 
};

// Cache simples em memória para gêneros de TV
let tvGenresCache = null;
let tvGenresCacheAt = 0;
const TV_GENRES_TTL_MS = 1000 * 60 * 60; // 1h

export const buscarGenerosTv = async () => {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error('Chave da API do TMDB não encontrada. Verifique as variáveis de ambiente.');
  }
  const now = Date.now();
  if (tvGenresCache && now - tvGenresCacheAt < TV_GENRES_TTL_MS) return tvGenresCache;
  const url = new URL('https://api.themoviedb.org/3/genre/tv/list');
  url.searchParams.append('api_key', apiKey);
  url.searchParams.append('language', 'pt-BR');
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erro ao buscar gêneros de TV: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  const map = new Map();
  (data?.genres || []).forEach((g) => { if (g && typeof g.id === 'number') map.set(g.id, g.name); });
  tvGenresCache = map;
  tvGenresCacheAt = now;
  return map;
};

// Busca classificação indicativa (content ratings) da série e mapeia para idade numérica
export const buscarClassificacaoTv = async (tvId) => {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error('Chave da API do TMDB não encontrada. Verifique as variáveis de ambiente.');
  }
  if (!tvId) return null;
  const url = new URL(`https://api.themoviedb.org/3/tv/${encodeURIComponent(tvId)}/content_ratings`);
  url.searchParams.append('api_key', apiKey);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erro ao buscar classificação: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  const results = Array.isArray(data?.results) ? data.results : [];
  // Prioriza Brasil, depois US, depois qualquer um com número
  const br = results.find((r) => r?.iso_3166_1 === 'BR');
  const us = results.find((r) => r?.iso_3166_1 === 'US');
  const any = results.find((r) => r?.rating);
  const pick = br || us || any || null;
  const ratingStr = String(pick?.rating || '').toUpperCase();
  if (!ratingStr) return null;
  // Extrai primeiro número presente (ex: "16", "TV-14" -> 14)
  const m = ratingStr.match(/\d+/);
  if (m) return Math.max(0, Math.min(18, Number(m[0])));
  // Mapas comuns quando não há dígitos
  const map = { 'L': 0, 'G': 0, 'TV-Y': 0, 'TV-Y7': 7, 'PG': 10, 'TV-PG': 10, 'PG-13': 13, 'R': 16, 'TV-14': 14, 'TV-MA': 18 };
  return map[ratingStr] ?? null;
};

export const buscarElenco = async (movieId) => {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error('Chave da API do TMDB não encontrada. Verifique as variáveis de ambiente.');
  }
  if (!movieId) {
    return [];
  }
  const url = new URL(`https://api.themoviedb.org/3/tv/${encodeURIComponent(movieId)}/credits`);
  url.searchParams.append('api_key', apiKey);
  url.searchParams.append('language', 'pt-BR');

  const response = await fetch(url);
  if (!response.ok) {
    // Deixe o chamador decidir como tratar a falha
    throw new Error(`Erro ao buscar elenco: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  const list = Array.isArray(data?.cast) ? data.cast : [];
  // Retorna somente os nomes dos atores (top billed já vem ordenado por order)
  return list.map((p) => p?.name).filter((n) => typeof n === 'string' && n.trim()).slice(0, 10);
};