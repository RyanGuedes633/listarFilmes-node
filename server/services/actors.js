import { loadDB, saveDB } from '../storage/db.js';
import { HttpError } from '../middlewares/error.js';

export function listActors() {
  const db = loadDB();
  return db.actors;
}

export function getActorById(id) {
  const db = loadDB();
  const actor = db.actors.find((a) => a.id === id);
  if (!actor) throw new HttpError(404, 'Ator não encontrado');
  return actor;
}

export function createActor({ nome }) {
  const db = loadDB();
  const exists = db.actors.find((a) => a.nome.toLowerCase() === nome.toLowerCase());
  if (exists) throw new HttpError(409, 'Ator já existe');
  const id = db.nextIds.actor++;
  const actor = { id, nome };
  db.actors.push(actor);
  saveDB(db);
  return actor;
}

export function updateActor(id, { nome }) {
  const db = loadDB();
  const idx = db.actors.findIndex((a) => a.id === id);
  if (idx === -1) throw new HttpError(404, 'Ator não encontrado');
  // Check uniqueness
  const exists = db.actors.find((a) => a.nome.toLowerCase() === nome.toLowerCase() && a.id !== id);
  if (exists) throw new HttpError(409, 'Outro ator com esse nome já existe');
  db.actors[idx].nome = nome;
  saveDB(db);
  return db.actors[idx];
}

export function deleteActor(id) {
  const db = loadDB();
  const idx = db.actors.findIndex((a) => a.id === id);
  if (idx === -1) throw new HttpError(404, 'Ator não encontrado');
  // Also remove relation from movies
  db.movies = db.movies.map((m) => ({ ...m, atores: m.atores.filter((aid) => aid !== id) }));
  const [removed] = db.actors.splice(idx, 1);
  saveDB(db);
  return removed;
}
