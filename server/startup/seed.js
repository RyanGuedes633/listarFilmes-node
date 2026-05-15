import { supabase } from '../storage/supabase.js';

async function fetchExternalMovies() {
  const DEFAULT_ENDPOINTS = [
    process.env.EXTERNAL_API_URL, // highest priority if provided
    'https://tv-api.com/api/movies',
    'https://tv-api.com/api/v1/movies',
    'https://tv-api.com/api/movies/popular',
    'https://tv-api.com/api/titles/movies',
  ].filter(Boolean);

  // Optional API key support
  const key = process.env.EXTERNAL_API_KEY;
  const keyHeader = process.env.EXTERNAL_API_KEY_HEADER || 'X-API-KEY';

  for (const url of DEFAULT_ENDPOINTS) {
    try {
      const headers = {};
      if (key) {
        if (keyHeader.toLowerCase() === 'authorization' && !/^bearer\s/i.test(key)) {
          headers['Authorization'] = `Bearer ${key}`;
        } else {
          headers[keyHeader] = key;
        }
      }
      const res = await fetch(url, { headers });
      if (!res.ok) continue;
      const data = await res.json();
      if (Array.isArray(data)) return data;
      // Some APIs wrap data
      if (data && Array.isArray(data.results)) return data.results;
      if (data && Array.isArray(data.items)) return data.items;
    } catch (e) {
      // try next endpoint
      continue;
    }
  }
  return [];
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

  // Check if there are any movies already using count
  const { count, error: cErr } = await supabase
    .from('movies')
    .select('id', { count: 'exact', head: true });
  if (cErr) {
    console.warn('[Seed] Could not check movies count:', cErr.message);
    return { inserted, skipped, errors, note: 'Falha ao consultar quantidade de filmes. Verifique SUPABASE_URL/KEY e RLS/policies.' };
  }
  if (typeof count === 'number' && count > 0) {
    console.log('[Seed] Movies already present, skipping external import');
    return { inserted, skipped, errors, note: 'Já havia filmes. Nada a fazer.' };
  }

  const external = await fetchExternalMovies();
  if (!external.length) {
    console.log('[Seed] No external movies fetched');
    return { inserted, skipped, errors, note: 'Nenhum filme retornado da API externa.' };
  }

  // Map and insert a subset (avoid huge insert)
  const sample = external.slice(0, 20);

  for (const item of sample) {
    const titulo = item?.title || item?.name || 'Sem título';
    const genero = Array.isArray(item?.genres) && item.genres.length ? item.genres[0] : (item?.genre || 'Ação');
    const faixaEtaria = typeof item?.rating === 'number' ? Math.max(0, Math.min(18, Math.round(item.rating))) : 12;

    // Check duplicate by case-insensitive title
    const { data: exists, error: eErr } = await supabase.from('movies').select('id').ilike('titulo', titulo).maybeSingle();
    if (eErr && eErr.code !== 'PGRST116') {
      console.warn('[Seed] Skip movie due to error searching', titulo, eErr.message);
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
        console.warn('[Seed] Failed to create movie', titulo, mErr.message);
        errors.push({ titulo, stage: 'insert', message: mErr.message, code: mErr.code });
        continue;
      }
      inserted++;
      movieId = created.id;
    }

    // Try to seed some actors if available
    const cast = Array.isArray(item?.cast) ? item.cast : (Array.isArray(item?.actors) ? item.actors : []);
    const actorNames = cast.slice(0, 5).map((n) => String(n).trim()).filter(Boolean);
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
  console.log('[Seed] External movies seeding completed ->', summary);
  return summary;
}
