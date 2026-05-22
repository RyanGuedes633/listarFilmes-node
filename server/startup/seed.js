import { supabase } from '../storage/supabase.js';
import { buscarFilmes, buscarElenco, buscarGenerosTv, buscarClassificacaoTv } from '../services/tmdb.js';

async function fetchExternalMovies() {
  try {
    // Usa o serviço do TMDB (agora para séries)
    const results = await buscarFilmes();
    return Array.isArray(results) ? results : [];
  } catch (e) {
    console.warn('[Seed] Falha ao buscar séries do TMDB:', e?.message || e);
    return [];
  }
}

async function upsertActorByName(nome) {
  if (!nome || typeof nome !== 'string') return null;
  const { data: existing, error: sErr } = await supabase
    .from('actors')
    .select('*')
    .ilike('nome', nome)
    .maybeSingle();
  if (sErr && sErr.code !== 'PGRST116') throw sErr;
  if (existing) return existing.id;
  const { data: created, error: cErr } = await supabase
    .from('actors')
    .insert([{ nome }])
    .select('*')
    .single();
  if (cErr) throw cErr;
  return created.id;
}

export async function seedMoviesIfEmpty() {
  let inserted = 0;
  let skipped = 0;
  const errors = [];

  // Verifica se já existem registros
  const { count, error: cErr } = await supabase
    .from('movies')
    .select('id', { count: 'exact', head: true });
  if (cErr) {
    console.warn('[Seed] Could not check movies count:', cErr.message);
    return { inserted, skipped, errors, note: 'Falha ao consultar quantidade de séries. Verifique SUPABASE_URL/KEY e RLS/policies.' };
  }
  if (typeof count === 'number' && count > 0) {
    console.log('[Seed] Séries já presentes, ignorando import externo');
    return { inserted, skipped, errors, note: 'Já havia séries. Nada a fazer.' };
  }

  const external = await fetchExternalMovies();
  if (!external.length) {
    console.log('[Seed] Nenhuma série externa obtida');
    return { inserted, skipped, errors, note: 'Nenhuma série retornada da API externa.' };
  }

  // Pré-carrega mapa de gêneros de TV (id -> nome pt-BR)
  let genresMap;
  try { genresMap = await buscarGenerosTv(); } catch (e) { console.warn('[Seed] Falha ao buscar gêneros de TV:', e?.message); genresMap = new Map(); }

  // Limita a amostra para evitar inserts massivos
  const sample = external.slice(0, 20);

  for (const item of sample) {
    const titulo = item?.name || item?.title || 'Sem título';

    // Mapeia gênero: usa primeiro id de genre_ids -> nome via mapa (fallback: 'Desconhecido')
    let genero = 'Desconhecido';
    const ids = Array.isArray(item?.genre_ids) ? item.genre_ids : [];
    if (ids.length && genresMap instanceof Map) {
      const firstName = genresMap.get(ids[0]);
      if (firstName) genero = firstName;
    }

    // Classificação indicativa via TMDB content_ratings
    let faixaEtaria = null;
    try { faixaEtaria = await buscarClassificacaoTv(item?.id); } catch (e) { faixaEtaria = null; }
    if (faixaEtaria == null) faixaEtaria = 10; // fallback mais neutro que 12

    // Evita duplicado por título (case-insensitive)
    const { data: exists, error: eErr } = await supabase.from('movies').select('id').ilike('titulo', titulo).maybeSingle();
    if (eErr && eErr.code !== 'PGRST116') {
      console.warn('[Seed] Pular série por erro na busca', titulo, eErr.message);
      errors.push({ titulo, stage: 'search', message: eErr.message });
      continue;
    }
    let movieId;
    if (exists) {
      skipped++;
      movieId = exists.id;
    } else {
      const { data: created, error: mErr } = await supabase.from('movies').insert([{ titulo, genero, faixaEtaria }]).select('*').single();
      if (mErr) {
        console.warn('[Seed] Falha ao criar série', titulo, mErr.message);
        errors.push({ titulo, stage: 'insert', message: mErr.message, code: mErr.code });
        continue;
      }
      inserted++;
      movieId = created.id;
    }

    // Tenta adicionar alguns atores (via TMDB credits)
    let cast = Array.isArray(item?.cast) ? item.cast : (Array.isArray(item?.actors) ? item.actors : []);
    if ((!cast || cast.length === 0) && item?.id) {
      try {
        const names = await buscarElenco(item.id);
        cast = Array.isArray(names) ? names : [];
      } catch (e) {
        console.warn('[Seed] Falha ao buscar elenco no TMDB para', titulo, e?.message);
        cast = [];
      }
    }
    const actorNames = (cast || []).slice(0, 5).map((n) => String(n).trim()).filter(Boolean);
    for (const nome of actorNames) {
      try {
        const actorId = await upsertActorByName(nome);
        if (actorId) {
          const { data: rel, error: rErr } = await supabase
            .from('movie_actors')
            .select('movie_id, actor_id')
            .eq('movie_id', movieId)
            .eq('actor_id', actorId)
            .maybeSingle();
          if (rErr && rErr.code !== 'PGRST116') {
            console.warn('[Seed] relation check failed', rErr.message);
          } else if (!rel) {
            await supabase.from('movie_actors').insert([{ movie_id: movieId, actor_id: actorId }]);
          }
        }
      } catch (e) {
        console.warn('[Seed] actor upsert failed', nome, e?.message);
      }
    }
  }

  const summary = { inserted, skipped, errors, note: errors.length ? 'Alguns itens falharam. Verifique policies do Supabase se inserts foram negados (RLS).' : 'Seed concluído.' };
  console.log('[Seed] Importação de séries concluída ->', summary);
  return summary;
}
