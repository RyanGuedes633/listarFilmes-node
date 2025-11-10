import * as service from '../services/actors.js';

export const list = (_req, res, next) => {
  try {
    res.json(service.listActors());
  } catch (e) { next(e); }
};

export const get = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    res.json(service.getActorById(id));
  } catch (e) { next(e); }
};

export const create = (req, res, next) => {
  try {
    const actor = service.createActor(req.validatedBody);
    res.status(201).json(actor);
  } catch (e) { next(e); }
};

export const update = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const actor = service.updateActor(id, req.validatedBody);
    res.json(actor);
  } catch (e) { next(e); }
};

export const remove = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const removed = service.deleteActor(id);
    res.json(removed);
  } catch (e) { next(e); }
};
