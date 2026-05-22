export const buscarFilmes = async () => {
   const apiKey = process.env.TMDB_API_KEY;

   if (!apiKey) {
      throw new Error('Chave da API do TMDB não encontrada. Verifique as variáveis de ambiente.');
   }

   const url = new URL('https://api.themoviedb.org/3/movie/popular');
   url.searchParams.append('api_key', apiKey);
   url.searchParams.append('language', 'pt-BR');

   const response = await fetch(url);

   if (!response.ok) {
      throw new Error(`Erro ao buscar filmes: ${response.status} ${response.statusText}`);
   }

    const data = await response.json();
    return data.results; 
};

export const buscarElenco = async (movieId) => {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error('Chave da API do TMDB não encontrada. Verifique as variáveis de ambiente.');
  }
  if (!movieId) {
    return [];
  }
  const url = new URL(`https://api.themoviedb.org/3/movie/${encodeURIComponent(movieId)}/credits`);
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