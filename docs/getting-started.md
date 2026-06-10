# Guia de Início Rápido

## Pré-requisitos

- **Node.js** 16+ e npm/yarn
- **Git**
- Conta **Supabase** (gratuita em supabase.com)

## Instalação

### 1. Clonar o repositório

```bash
git clone <repository-url>
cd listarFilmes-node
```

### 2. Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```env
# Backend
SUPABASE_URL=sua_url_supabase
SUPABASE_KEY=sua_chave_supabase

# Frontend (opcional)
VITE_API_URL=http://localhost:3000/api
```

### 3. Setup do Backend

```bash
# Instalar dependências
npm install

# Executar seed (opcional)
npm run seed

# Iniciar servidor
npm start
```

O servidor estará em: `http://localhost:3000`

### 4. Setup do Frontend

```bash
cd vue-app

# Instalar dependências
npm install

# Iniciar dev server
npm run dev
```

O frontend estará em: `http://localhost:5173`

## Verificar Instalação

### API Health
```bash
curl http://localhost:3000/api/health
```

Resposta esperada:
```json
{ "status": "ok" }
```

### Swagger UI
Acesse: `http://localhost:3000/api/docs`

### Frontend
Acesse: `http://localhost:5173`

## Próximos Passos

- Leia a [Documentação da API](api/overview.md)
- Entenda o [Modelo de Dados](architecture/data-model.md)
- Explore os [Endpoints de Filmes](api/movies.md) e [Atores](api/actors.md)
