export function notFound(req, res, next) {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
}

export function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || undefined;
  res.status(status).json({ error: message, details });
}

export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}
