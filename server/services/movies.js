import { supabase } from '../storage/supabase.js';
import { HttpError } from '../middlewares/error.js';

async function validateActorIds(atores, userId) {
  if (!atores || atores.length === 0) return;
  const { data, error } = await supabase.from('actors').select('id').in('id', atores).eq('user_id', userId);
  if (error) throw new HttpError(500, 'Erro ao validar atores', error);
  const foundIds = new Set((data || []).map((a) => a.id));
  const missing = atores.filter((id) => !foundIds.has(id));
  if (missing.length) throw new HttpError(400, 'Alguns atores não existem ou não pertencem ao seu usuário', { missing });
}

export async function listMovies(userId) {
  const { data: movies, error: mErr } = await supabase.from('movies').select('*').eq('user_id', userId).order('id', { ascending: true });
  if (mErr) throw new HttpError(500, 'Erro ao listar filmes', mErr);
  if (!movies || movies.length === 0) return [];
  const movieIds = movies.map((m) => m.id);
  const { data: rels, error: rErr } = await supabase.from('movie_actors').select('*').in('movie_id', movieIds);
  if (rErr) throw new HttpError(500, 'Erro ao carregar relações', rErr);
  const { data: actors, error: aErr } = await supabase.from('actors').select('*').eq('user_id', userId);
  if (aErr) throw new HttpError(500, 'Erro ao carregar atores', aErr);
  const actorsById = new Map((actors || []).map((a) => [a.id, a]));
  const relByMovie = new Map();
  (rels || []).forEach((r) => {
    if (!relByMovie.has(r.movie_id)) relByMovie.set(r.movie_id, []);
    relByMovie.get(r.movie_id).push(r.actor_id);
  });
  return (movies || []).map((m) => ({
    id: m.id,
    tmdbId: m.tmdb_id,
    titulo: m.titulo,
    faixaEtaria: m.faixaEtaria,
    genero: m.genero,
    atores: (relByMovie.get(m.id) || []),
    atoresDetalhes: (relByMovie.get(m.id) || []).map((id) => actorsById.get(id)).filter(Boolean),
  }));
}

export async function getMovieById(id, userId) {
  const { data: movie, error } = await supabase.from('movies').select('*').eq('id', id).eq('user_id', userId).maybeSingle();
  if (error) throw new HttpError(500, 'Erro ao buscar filme', error);
  if (!movie) throw new HttpError(404, 'Filme não encontrado ou não pertence ao seu usuário');
  const { data: rels, error: rErr } = await supabase.from('movie_actors').select('actor_id').eq('movie_id', id);
  if (rErr) throw new HttpError(500, 'Erro ao carregar relações', rErr);
  const actorIds = (rels || []).map((r) => r.actor_id);
  let atoresDetalhes = [];
  if (actorIds.length) {
    const { data: actors, error: aErr } = await supabase.from('actors').select('*').in('id', actorIds).eq('user_id', userId);
    if (aErr) throw new HttpError(500, 'Erro ao carregar atores', aErr);
    atoresDetalhes = actors || [];
  }
  return { id: movie.id, tmdbId: movie.tmdb_id, titulo: movie.titulo, faixaEtaria: movie.faixaEtaria, genero: movie.genero, atores: actorIds, atoresDetalhes };
}

export async function createMovie({ titulo, faixaEtaria, genero, atores }, userId) {
  await validateActorIds(atores || [], userId);
  const { data, error } = await supabase.from('movies').insert([{ titulo, faixaEtaria, genero, user_id: userId }]).select('*').single();
  if (error) throw new HttpError(500, 'Erro ao criar filme', error);
  const movieId = data.id;
  if (atores && atores.length) {
    const rows = atores.map((actor_id) => ({ movie_id: movieId, actor_id }));
    const { error: rErr } = await supabase.from('movie_actors').insert(rows);
    if (rErr) throw new HttpError(500, 'Erro ao relacionar atores', rErr);
  }
  return await getMovieById(movieId, userId);
}

export async function updateMovie(id, { titulo, faixaEtaria, genero, atores }, userId) {
  // Garantir propriedade do filme
  const { data: movie, error: checkErr } = await supabase.from('movies').select('id').eq('id', id).eq('user_id', userId).maybeSingle();
  if (checkErr) throw new HttpError(500, 'Erro ao verificar permissão do filme', checkErr);
  if (!movie) throw new HttpError(404, 'Filme não encontrado ou não pertence ao seu usuário');

  if (atores) await validateActorIds(atores, userId);
  const payload = {};
  if (titulo !== undefined) payload.titulo = titulo;
  if (faixaEtaria !== undefined) payload.faixaEtaria = faixaEtaria;
  if (genero !== undefined) payload.genero = genero;
  if (Object.keys(payload).length) {
    const { error: uErr } = await supabase.from('movies').update(payload).eq('id', id).eq('user_id', userId);
    if (uErr) throw new HttpError(500, 'Erro ao atualizar filme', uErr);
  }
  if (atores !== undefined) {
    // replace relations
    const { error: delErr } = await supabase.from('movie_actors').delete().eq('movie_id', id);
    if (delErr) throw new HttpError(500, 'Erro ao atualizar relações', delErr);
    if (atores.length) {
      const rows = atores.map((actor_id) => ({ movie_id: id, actor_id }));
      const { error: insErr } = await supabase.from('movie_actors').insert(rows);
      if (insErr) throw new HttpError(500, 'Erro ao criar relações', insErr);
    }
  }
  return await getMovieById(id, userId);
}

export async function deleteMovie(id, userId) {
  // Garantir propriedade do filme
  const { data: movie, error: checkErr } = await supabase.from('movies').select('id').eq('id', id).eq('user_id', userId).maybeSingle();
  if (checkErr) throw new HttpError(500, 'Erro ao verificar permissão do filme', checkErr);
  if (!movie) throw new HttpError(404, 'Filme não encontrado ou não pertence ao seu usuário');

  const { error: relErr } = await supabase.from('movie_actors').delete().eq('movie_id', id);
  if (relErr) throw new HttpError(500, 'Erro ao remover relações', relErr);
  const { data, error } = await supabase.from('movies').delete().eq('id', id).eq('user_id', userId).select('*').maybeSingle();
  if (error) throw new HttpError(500, 'Erro ao remover filme', error);
  if (!data) throw new HttpError(404, 'Filme não encontrado');
  return data;
}

// Garante que uma série exista pelo título (case-insensitive). Se não existir, cria.
export async function ensureMovieByTitulo(titulo, genero, faixaEtaria, tmdbId, userId) {
  if (!titulo) throw new HttpError(400, 'Título é obrigatório');
  const { data: exists, error: eErr } = await supabase
    .from('movies')
    .select('*')
    .ilike('titulo', titulo)
    .eq('user_id', userId)
    .maybeSingle();
  if (eErr && eErr.code !== 'PGRST116') throw new HttpError(500, 'Erro ao verificar série existente', eErr);
  if (exists) {
    return await getMovieById(exists.id, userId);
  }
  const { data: created, error: cErr } = await supabase
    .from('movies')
    .insert([{ titulo, genero, faixaEtaria, tmdb_id: tmdbId, user_id: userId }])
    .select('*')
    .single();
  if (cErr) throw new HttpError(500, 'Erro ao criar série favorita', cErr);
  return await getMovieById(created.id, userId);
}
