import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import moviesRouter from './routes/movies.js';
import actorsRouter from './routes/actors.js';
import authRouter from './routes/auth.js';
import { notFound, errorHandler } from './middlewares/error.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Swagger setup
const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Lista Séries API',
    version: '1.0.0',
    description: 'API para gerenciar séries e atores com Supabase',
  },
  servers: [{ url: '/api' }],
  components: {
    schemas: {
      Actor: {
        type: 'object',
        properties: { id: { type: 'integer' }, nome: { type: 'string' } },
      },
      Movie: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          titulo: { type: 'string' },
          faixaEtaria: { type: 'integer' },
          genero: { type: 'string' },
          atores: { type: 'array', items: { type: 'integer' } },
          atoresDetalhes: { type: 'array', items: { $ref: '#/components/schemas/Actor' } },
        },
      },
      Error: {
        type: 'object',
        properties: { error: { type: 'string' }, details: { type: 'object' } },
      },
    },
  },
  paths: {
    '/health': {
      get: { summary: 'Status da API', responses: { '200': { description: 'ok' } } },
    },
    '/seed': {
      post: { summary: 'Executar seed de séries (idempotente)', responses: { '200': { description: 'Resumo do seed', content: { 'application/json': { schema: { type: 'object', properties: { inserted: { type: 'integer' }, skipped: { type: 'integer' }, errors: { type: 'array', items: { type: 'object' } }, note: { type: 'string' } } } } } } } },
    },
    '/movies': {
      get: {
        summary: 'Listar séries',
        responses: { '200': { description: 'Lista de séries', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Movie' } } } } } },
      },
      post: {
        summary: 'Criar série',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Movie' } } } },
        responses: { '201': { description: 'Criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Movie' } } } }, '400': { description: 'Erro de validação', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } } },
      },
    },
    '/movies/{id}': {
      get: { summary: 'Obter série por ID', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'Série', content: { 'application/json': { schema: { $ref: '#/components/schemas/Movie' } } } }, '404': { description: 'Não encontrado' } } },
      put: { summary: 'Atualizar série', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Movie' } } } }, responses: { '200': { description: 'Atualizado' } } },
      delete: { summary: 'Remover série', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'Removido' }, '404': { description: 'Não encontrado' } } },
    },
    '/actors': {
      get: { summary: 'Listar atores', responses: { '200': { description: 'Lista de atores', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Actor' } } } } } } },
      post: { summary: 'Criar ator', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Actor' } } } }, responses: { '201': { description: 'Criado' } } },
    },
    '/actors/{id}': {
      get: { summary: 'Obter ator', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'Ator' }, '404': { description: 'Não encontrado' } } },
      put: { summary: 'Atualizar ator', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Actor' } } } }, responses: { '200': { description: 'Atualizado' } } },
      delete: { summary: 'Remover ator', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'Removido' }, '404': { description: 'Não encontrado' } } },
    },
  },
};

const openapiSpecification = swaggerJSDoc({ definition: swaggerDefinition, apis: [] });
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.get('/api/openapi.json', (_req, res) => res.json(openapiSpecification));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Manual seed endpoint
app.post('/api/seed', async (_req, res) => {
  try {
    const summary = await seedMoviesIfEmpty();
    res.json(summary || { note: 'Seed executado' });
  } catch (e) {
    res.status(500).json({ error: 'Falha ao executar seed', details: e?.message });
  }
});

app.use('/api/movies', moviesRouter);
app.use('/api/actors', actorsRouter);
app.use('/api/auth', authRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`API listening on http://localhost:${PORT}`);
  try {
    await seedMoviesIfEmpty();
  } catch (e) {
    console.warn('[Seed] Startup seeding failed:', e?.message);
  }
});

export default app;