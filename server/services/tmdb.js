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