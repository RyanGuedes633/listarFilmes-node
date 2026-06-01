import { buscarFilmes, buscarGenerosTv, buscarClassificacaoTv } from '../services/tmdb.js';
import * as service from '../services/movies.js';

export const listTmdb = async (_req, res, next) => {
  try {
    const filmes = await buscarFilmes();

    const filmesComFaixaEtaria = await Promise.all(filmes.map(async (filme) => {
      let faixaEtaria = null;
      try {
        faixaEtaria = await buscarClassificacaoTv(filme.id);
      } catch {
        faixaEtaria = null;
      }

      return {
        ...filme,
        faixaEtaria
      };
    }));

    res.json(filmesComFaixaEtaria);
  } catch (e) { next(e); }
};

export const favoriteFromTmdb = async (req, res, next) => {
  try {
    const body = req.body || {};
    const titulo = body?.name || body?.title || 'Sem título';
    let genero = 'Desconhecido';
    try {
      const map = await buscarGenerosTv();
      const ids = Array.isArray(body?.genre_ids) ? body.genre_ids : [];
      if (ids.length && map instanceof Map) {
        const g = map.get(ids[0]);
        if (g) genero = g;
      }
    } catch {}
    let faixaEtaria = null;
    try {
      faixaEtaria = await buscarClassificacaoTv(body?.id);
    } catch { faixaEtaria = null; }
    if (faixaEtaria == null) faixaEtaria = 10;
    const movie = await service.ensureMovieByTitulo(titulo, genero, faixaEtaria);
    res.status(201).json(movie);
  } catch (e) { next(e); }
};

export const list = async (_req, res, next) => {
  try { res.json(await service.listMovies()); } catch (e) { next(e); }
};

export const get = async (req, res, next) => {
  try { res.json(await service.getMovieById(Number(req.params.id))); } catch (e) { next(e); }
};

export const create = async (req, res, next) => {
  try { res.status(201).json(await service.createMovie(req.validatedBody)); } catch (e) { next(e); }
};

export const update = async (req, res, next) => {
  try { res.json(await service.updateMovie(Number(req.params.id), req.validatedBody)); } catch (e) { next(e); }
};

export const remove = async (req, res, next) => {
  try { res.json(await service.deleteMovie(Number(req.params.id))); } catch (e) { next(e); }
};
