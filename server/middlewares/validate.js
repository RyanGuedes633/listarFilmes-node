import { HttpError } from './error.js';

export function validateBody(schema) {
  return (req, _res, next) => {
    const { value, errors } = runSchema(schema, req.body);
    if (errors.length) {
      return next(new HttpError(400, 'Validation error', errors));
    }
    req.validatedBody = value;
    next();
  };
}

export function validateParams(schema) {
  return (req, _res, next) => {
    const { value, errors } = runSchema(schema, req.params);
    if (errors.length) {
      return next(new HttpError(400, 'Validation error', errors));
    }
    req.validatedParams = value;
    next();
  };
}

function runSchema(schema, input) {
  const errors = [];
  const value = {};
  for (const key in schema) {
    const rule = schema[key];
    const v = input[key];
    if (rule.required && (v === undefined || v === null || (rule.type === 'string' && String(v).trim() === ''))) {
      errors.push({ field: key, message: 'is required' });
      continue;
    }
    if (v === undefined || v === null) {
      continue;
    }
    if (rule.type === 'string') {
      if (typeof v !== 'string') errors.push({ field: key, message: 'must be a string' });
      else value[key] = v.trim();
    }
    if (rule.type === 'number') {
      const num = Number(v);
      if (!Number.isFinite(num)) errors.push({ field: key, message: 'must be a number' });
      else if (rule.min !== undefined && num < rule.min) errors.push({ field: key, message: `must be >= ${rule.min}` });
      else value[key] = num;
    }
    if (rule.type === 'array') {
      if (!Array.isArray(v)) errors.push({ field: key, message: 'must be an array' });
      else {
        if (rule.items === 'number') {
          const arr = v.map(Number);
          if (arr.some((n) => !Number.isFinite(n))) errors.push({ field: key, message: 'must contain numbers' });
          else value[key] = arr;
        } else if (rule.items === 'string') {
          const arr = v.map((s) => String(s));
          value[key] = arr;
        } else {
          value[key] = v;
        }
      }
    }
  }
  return { value: { ...input, ...value }, errors };
}
