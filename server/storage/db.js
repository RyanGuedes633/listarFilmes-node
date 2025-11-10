import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const dataDir = join(process.cwd(), 'server', 'data');
const dbPath = join(dataDir, 'db.json');

function ensure() {
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  if (!existsSync(dbPath)) {
    const initial = { actors: [], movies: [], nextIds: { actor: 1, movie: 1 } };
    writeFileSync(dbPath, JSON.stringify(initial, null, 2));
  }
}

export function loadDB() {
  ensure();
  const raw = readFileSync(dbPath, 'utf-8');
  return JSON.parse(raw);
}

export function saveDB(db) {
  writeFileSync(dbPath, JSON.stringify(db, null, 2));
}
