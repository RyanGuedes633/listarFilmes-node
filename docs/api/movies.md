# Endpoint de Filmes

Todos os endpoints de filmes estão em `/api/movies`

## Listar Filmes

```http
GET /api/movies
```

Retorna todos os filmes cadastrados.

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "titulo": "Inception",
    "genero": "Sci-Fi",
    "faixaEtaria": "PG-13",
    "actors": [
      {
        "id": 1,
        "nome": "Leonardo DiCaprio"
      }
    ]
  }
]
```

---

## Buscar Filme por ID

```http
GET /api/movies/{id}
```

**Parâmetros:**
- `id` (path, required) - ID do filme

**Resposta (200 OK):**
```json
{
  "id": 1,
  "titulo": "Inception",
  "genero": "Sci-Fi",
  "faixaEtaria": "PG-13",
  "actors": [...]
}
```

---

## Criar Filme

```http
POST /api/movies
Content-Type: application/json

{
  "titulo": "Novo Filme",
  "genero": "Drama",
  "faixaEtaria": "R"
}
```

**Resposta (201 Created):**
```json
{
  "id": 42,
  "titulo": "Novo Filme",
  "genero": "Drama",
  "faixaEtaria": "R"
}
```

---

## Atualizar Filme

```http
PUT /api/movies/{id}
Content-Type: application/json

{
  "titulo": "Inception Remastered",
  "genero": "Sci-Fi",
  "faixaEtaria": "PG-13"
}
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "titulo": "Inception Remastered",
  "genero": "Sci-Fi",
  "faixaEtaria": "PG-13"
}
```

---

## Deletar Filme

```http
DELETE /api/movies/{id}
```

**Resposta (204 No Content)** ou **200 OK**:
```json
{
  "message": "Filme deletado com sucesso"
}
```

---

## Associar Ator a Filme

```http
POST /api/movies/{id}/actors/{actorId}
```

Adiciona um ator ao filme (relação N:N via `movie_actors`).

**Resposta (200 OK):**
```json
{
  "message": "Ator associado com sucesso"
}
```

---

## Remover Ator de Filme

```http
DELETE /api/movies/{id}/actors/{actorId}
```

Remove a associação entre ator e filme.

**Resposta (200 OK):**
```json
{
  "message": "Ator removido com sucesso"
}
```

---

**Relacionado:** [Atores](actors.md)
