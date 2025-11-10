import * as service from '../services/movies.js';

export const list = (_req, res, next) => {
  try { res.json(service.listMovies()); } catch (e) { next(e); }
};

export const get = (req, res, next) => {
  try { res.json(service.getMovieById(Number(req.params.id))); } catch (e) { next(e); }
};

export const create = (req, res, next) => {
  try { res.status(201).json(service.createMovie(req.validatedBody)); } catch (e) { next(e); }
};

export const update = (req, res, next) => {
  try { res.json(service.updateMovie(Number(req.params.id), req.validatedBody)); } catch (e) { next(e); }
};

export const remove = (req, res, next) => {
  try { res.json(service.deleteMovie(Number(req.params.id))); } catch (e) { next(e); }
};
