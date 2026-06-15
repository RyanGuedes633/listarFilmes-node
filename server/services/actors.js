import { supabase } from '../storage/supabase.js';
import { HttpError } from '../middlewares/error.js';

export async function listActors() {
  const { data, error } = await supabase.from('actors').select('*').order('id', { ascending: true });
  if (error) throw new HttpError(500, 'Erro ao listar atores', error);
  return data || [];
}

export async function getActorById(id) {
  const { data, error } = await supabase.from('actors').select('*').eq('id', id).maybeSingle();
  if (error) throw new HttpError(500, 'Erro ao buscar ator', error);
  if (!data) throw new HttpError(404, 'Ator não encontrado');
  return data;
}

export async function createActor({ nome, tmdb_id }) {
  // Evita duplicado pelo id da TMDB, que é mais confiável que o nome
  if (tmdb_id != null) {
    const { data: exists, error: e1 } = await supabase
        .from('actors')
        .select('id')
        .eq('tmdb_id', tmdb_id)
        .maybeSingle();
    if (e1 && e1.code !== 'PGRST116') throw new HttpError(500, 'Erro ao verificar ator', e1);
    if (exists) throw new HttpError(409, 'Ator já existe');
  } else {
    const { data: exists, error: e1 } = await supabase.from('actors').select('id').ilike('nome', nome).maybeSingle();
    if (e1 && e1.code !== 'PGRST116') throw new HttpError(500, 'Erro ao verificar ator', e1);
    if (exists) throw new HttpError(409, 'Ator já existe');
  }

  const { data, error } = await supabase.from('actors').insert([{ nome, tmdb_id }]).select('*').single();
  if (error) throw new HttpError(500, 'Erro ao criar ator', error);
  return data;
}

export async function updateActor(id, { nome }) {
  // Ensure not duplicate name
  const { data: dup, error: e1 } = await supabase.from('actors').select('id').ilike('nome', nome);
  if (e1) throw new HttpError(500, 'Erro ao verificar duplicidade', e1);
  if ((dup || []).some((a) => a.id !== id)) throw new HttpError(409, 'Outro ator com esse nome já existe');
  const { data, error } = await supabase.from('actors').update({ nome }).eq('id', id).select('*').maybeSingle();
  if (error) throw new HttpError(500, 'Erro ao atualizar ator', error);
  if (!data) throw new HttpError(404, 'Ator não encontrado');
  return data;
}

export async function deleteActor(id) {
  const { error: relErr } = await supabase.from('movie_actors').delete().eq('actor_id', id);
  if (relErr) throw new HttpError(500, 'Erro ao remover relações', relErr);
  const { data, error } = await supabase.from('actors').delete().eq('id', id).select('*').maybeSingle();
  if (error) throw new HttpError(500, 'Erro ao remover ator', error);
  if (!data) throw new HttpError(404, 'Ator não encontrado');
  return data;
}
