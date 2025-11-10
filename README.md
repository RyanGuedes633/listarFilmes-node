# Lista de Filmes (React + Express)

Aplicação web para gerenciar o cadastro de filmes com atores (relação muitos-para-muitos).

Requisitos implementados:
- CRUD de filmes (título, faixa etária, gênero, atores). 
- Entidade Ator separada; um filme tem vários atores e um ator pode estar em vários filmes.
- Validação de formulários no frontend e validação de entrada no backend via middleware.
- Backend em Express.js com camadas: routes, controller, service, error (middlewares) e storage JSON simples.
- Frontend em React consumindo a API.

## Como executar

1. Instale as dependências:
   - `npm install`

2. Inicie a API (porta 3001):
   - `npm run server`
   - Health check: http://localhost:3001/api/health

3. Em outra janela, inicie o frontend (Vite, porta 5173 por padrão):
   - `npm run dev`

4. Configure a URL da API (opcional):
   - Em desenvolvimento, o frontend usa base relativa `/api` e o Vite faz proxy para `http://localhost:3001` (ver `vite.config.js`).
   - Você pode sobrescrever criando um arquivo `.env` na raiz com: 
     - `VITE_API_BASE=http://localhost:3001/api`

## Estrutura da API
- `server/index.js` – bootstrap do Express e middlewares (CORS, JSON, erros).
- `server/routes/*` – rotas de filmes e atores.
- `server/controllers/*` – controladores delegando para serviços.
- `server/services/*` – lógica de negócios (CRUD, integrações e validações).
- `server/middlewares/*` – validação de entrada e tratamento centralizado de erros.
- `server/storage/db.js` – persistência simples em arquivo JSON.

## Endpoints principais
- `GET /api/actors` – lista atores
- `POST /api/actors { nome }` – cria ator
- `GET /api/movies` – lista filmes (com `atoresDetalhes`)
- `POST /api/movies { titulo, faixaEtaria, genero, atores[] }` – cria filme
- `PUT /api/movies/:id` – atualiza filme
- `DELETE /api/movies/:id` – exclui filme

## Frontend
- `src/components/MovieList.jsx` – lista filmes e permite criar/editar/excluir.
- `src/components/MovieForm.jsx` – formulário com validação e seleção múltipla de atores, incluindo criação rápida de ator.

## Observações
- A persistência usa arquivo JSON (`server/data/db.json`) apenas para facilitar o teste local.
- Validações no backend retornam status 400/409, e o frontend exibe mensagens amigáveis.
