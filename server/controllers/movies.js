import { buscarFilmes } from '../services/tmdb.js';
import * as service from '../services/movies.js';

export const listTmdb = async (_req, res, next) => {
  try {
    const filmes = await buscarFilmes();
    res.json(filmes);
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
