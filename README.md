# Lista de Filmes

Plataforma completa para catalogação de filmes e gerenciamento de elenco, composta por uma API REST com documentação interativa e um frontend simples em Vue 3. O projeto prioriza clareza arquitetural, modelagem de dados sólida e automação de carga inicial.

- Backend: Node.js + Express, persistência em Supabase (Postgres gerenciado) e documentação via Swagger.
- Frontend: Vue 3 (Vite) com interface para operações essenciais (health, seed, CRUD de filmes e atores).
- Integração: Importação automática (seed) de títulos a partir de fonte externa (tv-api.com), de forma idempotente.

## Arquitetura

- API REST em Express, servida em `/api`.
- Documentação OpenAPI/Swagger em `/api/docs` (especificação JSON em `/api/openapi.json`).
- Supabase como camada de dados (tabelas: actors, movies, movie_actors) com RLS e policies de desenvolvimento.
- Frontend Vue servido em desenvolvimento via Vite (proxy para `/api`).

## Principais funcionalidades

- Catálogo de filmes com título, gênero e faixa etária.
- Gestão de atores e relacionamento N:N com filmes.
- Seed automático/acionável para importar filmes da API externa (tv-api.com).
- Documentação interativa da API e validação de entrada no backend.

## Modelo de dados

Entidades:
- Actor(id, nome)
- Movie(id, titulo, faixaEtaria, genero)

Relacionamento:
- Movie N..N Actor por meio da tabela de junção `movie_actors(movie_id, actor_id)`.

Diagrama (simplificado):
```
Actors (id PK) <---- movie_actors ----> Movies (id PK)
          ^ actor_id           movie_id ^
```

## Endpoints da API (resumo)

Base: `/api`

- GET `/health` — status da API
- POST `/seed` — importa filmes da fonte externa (idempotente)

Atores:
- GET `/actors`
- GET `/actors/{id}`
- POST `/actors` { nome }
- PUT `/actors/{id}` { nome }
- DELETE `/actors/{id}`

Filmes:
- GET `/movies`
- GET `/movies/{id}`
- POST `/movies` { titulo, faixaEtaria, genero, atores[] }
- PUT `/movies/{id}` { titulo?, faixaEtaria?, genero?, atores? }
- DELETE `/movies/{id}`

Para schemas e exemplos completos, utilize o Swagger em `/api/docs`.

## Configuração

Variáveis de ambiente (arquivo `.env` na raiz):
- PORT=3001
- SUPABASE_URL=https://<seu-projeto>.supabase.co
- SUPABASE_KEY=<chave_anon_ou_service>
- VITE_API_BASE=/api
- EXTERNAL_API_URL (opcional)
- EXTERNAL_API_KEY e EXTERNAL_API_KEY_HEADER (opcionais)

No Supabase, certifique-se de provisionar as tabelas `actors`, `movies` e `movie_actors` e habilitar políticas apropriadas (RLS) para leitura/escrita durante desenvolvimento.

## Execução

- Instalação: `npm install`
- API (dev): `npm run server:dev` — disponível em `http://localhost:3001/api`
- Swagger: `http://localhost:3001/api/docs`
- Frontend (dev): `npm run vue:dev` (pasta `vue-app`) — acessível em `http://localhost:5174`
- Seed manual: POST `/api/seed` (via Swagger)

## Estrutura do repositório

- `server/` — API Express (rotas, controllers, services, seed e integração Supabase)
- `vue-app/` — Frontend Vue 3 (Vite) com interface para operações essenciais
- `README.md` — visão geral, modelo de dados e resumo dos endpoints

## Referências

- Swagger da API externa (tv-api.com): https://tv-api.com/swagger/index.html
- Swagger da API do projeto: `/api/docs`
