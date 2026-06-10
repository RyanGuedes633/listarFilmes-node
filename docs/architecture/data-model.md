# Modelo de Dados

## Visão Geral

O banco de dados usa **Supabase** (PostgreSQL gerenciado) com três tabelas principais e um relacionamento N:N.

## Tabelas

### 1. `actors`

Armazena informações sobre atores.

| Campo | Tipo | Constraints |
|-------|------|------------|
| `id` | UUID/BIGSERIAL | PRIMARY KEY, auto-increment |
| `nome` | VARCHAR(255) | NOT NULL |
| `created_at` | TIMESTAMP | DEFAULT now() |
| `updated_at` | TIMESTAMP | DEFAULT now() |

**Exemplo:**
```json
{
  "id": 1,
  "nome": "Leonardo DiCaprio",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

### 2. `movies`

Armazena informações sobre filmes.

| Campo | Tipo | Constraints |
|-------|------|------------|
| `id` | UUID/BIGSERIAL | PRIMARY KEY, auto-increment |
| `titulo` | VARCHAR(255) | NOT NULL |
| `genero` | VARCHAR(100) | NOT NULL |
| `faixaEtaria` | VARCHAR(10) | NOT NULL (G, PG, PG-13, R, etc) |
| `created_at` | TIMESTAMP | DEFAULT now() |
| `updated_at` | TIMESTAMP | DEFAULT now() |

**Exemplo:**
```json
{
  "id": 1,
  "titulo": "Inception",
  "genero": "Sci-Fi",
  "faixaEtaria": "PG-13",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

### 3. `movie_actors` (Junção)

Relaciona filmes com atores (N:N - um filme pode ter vários atores, um ator pode estar em vários filmes).

| Campo | Tipo | Constraints |
|-------|------|------------|
| `id` | UUID/BIGSERIAL | PRIMARY KEY |
| `movie_id` | UUID/BIGSERIAL | FOREIGN KEY → movies(id), ON DELETE CASCADE |
| `actor_id` | UUID/BIGSERIAL | FOREIGN KEY → actors(id), ON DELETE CASCADE |
| `created_at` | TIMESTAMP | DEFAULT now() |

**Exemplo:**
```json
{
  "id": 1,
  "movie_id": 1,
  "actor_id": 1,
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

## Diagrama de Relacionamento

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│     actors      │         │  movie_actors    │         │     movies      │
├─────────────────┤         ├──────────────────┤         ├─────────────────┤
│ id (PK)         │◄────────│ actor_id (FK)    │         │ id (PK)         │
│ nome            │         │ movie_id (FK)    ├────────►│ titulo          │
│ created_at      │         │ created_at       │         │ genero          │
│ updated_at      │         └──────────────────┘         │ faixaEtaria     │
└─────────────────┘                                       │ created_at      │
                                                          │ updated_at      │
                                                          └─────────────────┘
        1                              N              N                1
      Actor ◄────────── movie_actors ──────────────► Movie
```

---

## Queries Úteis

### Listar filmes com atores
```sql
SELECT 
  m.id, m.titulo, m.genero, m.faixaEtaria,
  json_agg(json_build_object('id', a.id, 'nome', a.nome)) as actors
FROM movies m
LEFT JOIN movie_actors ma ON m.id = ma.movie_id
LEFT JOIN actors a ON ma.actor_id = a.id
GROUP BY m.id;
```

### Listar atores de um filme específico
```sql
SELECT a.id, a.nome
FROM actors a
INNER JOIN movie_actors ma ON a.id = ma.actor_id
WHERE ma.movie_id = 1;
```

### Contar filmes por ator
```sql
SELECT a.nome, COUNT(ma.movie_id) as movies_count
FROM actors a
LEFT JOIN movie_actors ma ON a.id = ma.actor_id
GROUP BY a.id, a.nome
ORDER BY movies_count DESC;
```

---

## Integridade Referencial

- **ON DELETE CASCADE** em `movie_actors`: 
  - Se um filme/ator é deletado, suas associações também são
  - Mantém dados consistentes

---

**Próximo:** [Deployment](../deployment.md)
