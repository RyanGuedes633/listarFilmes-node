import { supabase } from '../storage/supabase.js';
import { HttpError } from '../middlewares/error.js';

async function validateActorIds(atores) {
  if (!atores || atores.length === 0) return;
  const { data, error } = await supabase.from('actors').select('id').in('id', atores);
  if (error) throw new HttpError(500, 'Erro ao validar atores', error);
  const foundIds = new Set((data || []).map((a) => a.id));
  const missing = atores.filter((id) => !foundIds.has(id));
  if (missing.length) throw new HttpError(400, 'Alguns atores não existem', { missing });
}

export async function listMovies() {
  const { data: movies, error: mErr } = await supabase.from('movies').select('*').order('id', { ascending: true });
  if (mErr) throw new HttpError(500, 'Erro ao listar filmes', mErr);
  const { data: rels, error: rErr } = await supabase.from('movie_actors').select('*');
  if (rErr) throw new HttpError(500, 'Erro ao carregar relações', rErr);
  const { data: actors, error: aErr } = await supabase.from('actors').select('*');
  if (aErr) throw new HttpError(500, 'Erro ao carregar atores', aErr);
  const actorsById = new Map((actors || []).map((a) => [a.id, a]));
  const relByMovie = new Map();
  (rels || []).forEach((r) => {
    if (!relByMovie.has(r.movie_id)) relByMovie.set(r.movie_id, []);
    relByMovie.get(r.movie_id).push(r.actor_id);
  });
  return (movies || []).map((m) => ({
    id: m.id,
    titulo: m.titulo,
    faixaEtaria: m.faixaEtaria,
    genero: m.genero,
    atores: (relByMovie.get(m.id) || []),
    atoresDetalhes: (relByMovie.get(m.id) || []).map((id) => actorsById.get(id)).filter(Boolean),
  }));
}

export async function getMovieById(id) {
  const { data: movie, error } = await supabase.from('movies').select('*').eq('id', id).maybeSingle();
  if (error) throw new HttpError(500, 'Erro ao buscar filme', error);
  if (!movie) throw new HttpError(404, 'Filme não encontrado');
  const { data: rels, error: rErr } = await supabase.from('movie_actors').select('actor_id').eq('movie_id', id);
  if (rErr) throw new HttpError(500, 'Erro ao carregar relações', rErr);
  const actorIds = (rels || []).map((r) => r.actor_id);
  let atoresDetalhes = [];
  if (actorIds.length) {
    const { data: actors, error: aErr } = await supabase.from('actors').select('*').in('id', actorIds);
    if (aErr) throw new HttpError(500, 'Erro ao carregar atores', aErr);
    atoresDetalhes = actors || [];
  }
  return { id: movie.id, titulo: movie.titulo, faixaEtaria: movie.faixaEtaria, genero: movie.genero, atores: actorIds, atoresDetalhes };
}

export async function createMovie({ titulo, faixaEtaria, genero, atores }) {
  await validateActorIds(atores || []);
  const { data, error } = await supabase.from('movies').insert([{ titulo, faixaEtaria, genero }]).select('*').single();
  if (error) throw new HttpError(500, 'Erro ao criar filme', error);
  const movieId = data.id;
  if (atores && atores.length) {
    const rows = atores.map((actor_id) => ({ movie_id: movieId, actor_id }));
    const { error: rErr } = await supabase.from('movie_actors').insert(rows);
    if (rErr) throw new HttpError(500, 'Erro ao relacionar atores', rErr);
  }
  return await getMovieById(movieId);
}

export async function updateMovie(id, { titulo, faixaEtaria, genero, atores }) {
  if (atores) await validateActorIds(atores);
  const payload = {};
  if (titulo !== undefined) payload.titulo = titulo;
  if (faixaEtaria !== undefined) payload.faixaEtaria = faixaEtaria;
  if (genero !== undefined) payload.genero = genero;
  if (Object.keys(payload).length) {
    const { error: uErr } = await supabase.from('movies').update(payload).eq('id', id);
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
  return await getMovieById(id);
}

export async function deleteMovie(id) {
  const { error: relErr } = await supabase.from('movie_actors').delete().eq('movie_id', id);
  if (relErr) throw new HttpError(500, 'Erro ao remover relações', relErr);
  const { data, error } = await supabase.from('movies').delete().eq('id', id).select('*').maybeSingle();
  if (error) throw new HttpError(500, 'Erro ao remover filme', error);
  if (!data) throw new HttpError(404, 'Filme não encontrado');
  return data;
}

// Garante que uma série exista pelo título (case-insensitive). Se não existir, cria.
export async function ensureMovieByTitulo(titulo, genero, faixaEtaria) {
  if (!titulo) throw new HttpError(400, 'Título é obrigatório');
  const { data: exists, error: eErr } = await supabase
    .from('movies')
    .select('*')
    .ilike('titulo', titulo)
    .maybeSingle();
  if (eErr && eErr.code !== 'PGRST116') throw new HttpError(500, 'Erro ao verificar série existente', eErr);
  if (exists) {
    // Opcionalmente poderíamos atualizar genero/faixaEtaria se vierem diferentes
    return await getMovieById(exists.id);
  }
  const { data: created, error: cErr } = await supabase
    .from('movies')
    .insert([{ titulo, genero, faixaEtaria }])
    .select('*')
    .single();
  if (cErr) throw new HttpError(500, 'Erro ao criar série favorita', cErr);
  return await getMovieById(created.id);
}
