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
