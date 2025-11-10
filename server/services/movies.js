import { loadDB, saveDB } from '../storage/db.js';
import { HttpError } from '../middlewares/error.js';

function validateActorIds(db, atores) {
  const missing = atores.filter((id) => !db.actors.some((a) => a.id === id));
  if (missing.length) throw new HttpError(400, 'Alguns atores não existem', { missing });
}

export function listMovies() {
  const db = loadDB();
  return db.movies.map(expandMovie(db));
}

export function getMovieById(id) {
  const db = loadDB();
  const movie = db.movies.find((m) => m.id === id);
  if (!movie) throw new HttpError(404, 'Filme não encontrado');
  return expandMovie(db)(movie);
}

export function createMovie({ titulo, faixaEtaria, genero, atores }) {
  const db = loadDB();
  validateActorIds(db, atores || []);
  const id = db.nextIds.movie++;
  const movie = { id, titulo, faixaEtaria, genero, atores: atores || [] };
  db.movies.push(movie);
  saveDB(db);
  return expandMovie(db)(movie);
}

export function updateMovie(id, { titulo, faixaEtaria, genero, atores }) {
  const db = loadDB();
  const idx = db.movies.findIndex((m) => m.id === id);
  if (idx === -1) throw new HttpError(404, 'Filme não encontrado');
  if (atores) validateActorIds(db, atores);
  const current = db.movies[idx];
  db.movies[idx] = {
    ...current,
    ...(titulo !== undefined ? { titulo } : {}),
    ...(faixaEtaria !== undefined ? { faixaEtaria } : {}),
    ...(genero !== undefined ? { genero } : {}),
    ...(atores !== undefined ? { atores } : {}),
  };
  saveDB(db);
  return expandMovie(db)(db.movies[idx]);
}

export function deleteMovie(id) {
  const db = loadDB();
  const idx = db.movies.findIndex((m) => m.id === id);
  if (idx === -1) throw new HttpError(404, 'Filme não encontrado');
  const [removed] = db.movies.splice(idx, 1);
  saveDB(db);
  return removed;
}

function expandMovie(db) {
  return (movie) => ({
    ...movie,
    atoresDetalhes: movie.atores.map((id) => db.actors.find((a) => a.id === id)).filter(Boolean),
  });
}
