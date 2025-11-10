import express from 'express';
import cors from 'cors';
import moviesRouter from './routes/movies.js';
import actorsRouter from './routes/actors.js';
import { notFound, errorHandler } from './middlewares/error.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/movies', moviesRouter);
app.use('/api/actors', actorsRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
