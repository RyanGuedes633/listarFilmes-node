# Endpoint de Atores

Todos os endpoints de atores estão em `/api/actors`

## Listar Atores

```http
GET /api/actors
```

Retorna todos os atores cadastrados.

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "nome": "Leonardo DiCaprio",
    "movies": [
      {
        "id": 1,
        "titulo": "Inception"
      }
    ]
  }
]
```

---

## Buscar Ator por ID

```http
GET /api/actors/{id}
```

**Parâmetros:**
- `id` (path, required) - ID do ator

**Resposta (200 OK):**
```json
{
  "id": 1,
  "nome": "Leonardo DiCaprio",
  "movies": [...]
}
```

---

## Criar Ator

```http
POST /api/actors
Content-Type: application/json

{
  "nome": "Tom Hanks"
}
```

**Resposta (201 Created):**
```json
{
  "id": 5,
  "nome": "Tom Hanks"
}
```

---

## Atualizar Ator

```http
PUT /api/actors/{id}
Content-Type: application/json

{
  "nome": "Thomas Jeffrey Hanks"
}
```

**Resposta (200 OK):**
```json
{
  "id": 5,
  "nome": "Thomas Jeffrey Hanks"
}
```

---

## Deletar Ator

```http
DELETE /api/actors/{id}
```

Remove o ator e suas associações com filmes.

**Resposta (204 No Content)** ou **200 OK**:
```json
{
  "message": "Ator deletado com sucesso"
}
```

---

## Listar Filmes de um Ator

```http
GET /api/actors/{id}/movies
```

Retorna todos os filmes nos quais o ator atuou.

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "titulo": "Inception",
    "genero": "Sci-Fi",
    "faixaEtaria": "PG-13"
  }
]
```

---

**Relacionado:** [Filmes](movies.md)
