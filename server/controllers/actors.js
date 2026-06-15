import * as service from '../services/actors.js';

export const list = async (_req, res, next) => {
  try { res.json(await service.listActors()); } catch (e) { next(e); }
};

export const get = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    res.json(await service.getActorById(id));
  } catch (e) { next(e); }
};

export const create = async (req, res, next) => {
  try {
    const actor = await service.createActor(req.validatedBody);
    res.status(201).json(actor);
  } catch (e) { next(e); }
};

export const update = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const actor = await service.updateActor(id, req.validatedBody);
    res.json(actor);
  } catch (e) { next(e); }
};

export const remove = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const removed = await service.deleteActor(id);
    res.json(removed);
  } catch (e) { next(e); }
};
export const favoriteFromTmdb = async (req, res, next) => {
  try {
    const nome = req.body?.nome || req.body?.name;
    const tmdb_id = req.body?.id ?? req.body?.tmdb_id ?? null;

    if (!nome || typeof nome !== 'string') {
      return res.status(400).json({ message: 'Nome do ator é obrigatório' });
    }

    const actor = await service.createActor({ nome, tmdb_id });
    res.status(201).json(actor);
  } catch (e) { next(e); }
};
