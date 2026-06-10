# Frontend - Visão Geral

O frontend é uma aplicação **Vue 3** com **Vite** e **Tailwind CSS**, responsiva e moderna.

## Estrutura do Projeto

```
vue-app/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ActorCard.vue
│   │   ├── MovieCard.vue
│   │   └── SearchBar.vue
│   ├── layouts/
│   │   └── NavBar.vue       # Navegação
│   ├── pages/               # Páginas (views)
│   │   ├── HomePage.vue
│   │   ├── CreateMoviePage.vue
│   │   ├── CreateActorPage.vue
│   │   ├── SeriesPage.vue
│   │   └── SeriesDetailPage.vue
│   ├── routes/
│   │   └── router.js        # Definição de rotas
│   ├── App.vue              # Componente raiz
│   ├── main.js              # Ponto de entrada
│   └── style.css            # Estilos globais
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Tecnologias

- **Vue 3** - Framework reativo
- **Vite** - Build tool ultra-rápido
- **Tailwind CSS** - Utility-first CSS
- **Vue Router** - Roteamento

## Iniciar o Frontend

```bash
cd vue-app
npm install
npm run dev
```

Acesse em: `http://localhost:5173`

## Páginas Principais

### 🏠 Home Page
- Exibe lista de filmes
- Busca de filmes
- Links para criar novo

### 🎬 Criar Filme
- Formulário para adicionar novo filme
- Validação básica
- Associação com atores

### 🎭 Criar Ator
- Formulário para cadastrar ator
- Campos obrigatórios validados

### 📺 Série/Detalhes
- Exibe informações detalhadas de filme
- Lista atores associados

## Componentes Principais

### MovieCard.vue
Exibe informações de um filme em card.

**Props:**
- `movie` (Object) - Dados do filme

### ActorCard.vue
Exibe informações de um ator em card.

**Props:**
- `actor` (Object) - Dados do ator

### SearchBar.vue
Barra de busca para filtrar filmes.

**Emits:**
- `search` - Emite termo de busca

### NavBar.vue
Navegação principal da aplicação.

## Build para Produção

```bash
npm run build
npm run preview
```

Gera arquivos otimizados em `dist/`

---

**Próximo:** Explore o [Modelo de Dados](../architecture/data-model.md)
