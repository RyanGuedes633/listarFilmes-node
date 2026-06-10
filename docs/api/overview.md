# API REST - Visão Geral

A API é servida em **`http://localhost:3000/api`** e segue padrões RESTful.

## Documentação Interativa

Acesse **`/api/docs`** para Swagger UI com interface interativa para testar todos os endpoints.

Especificação OpenAPI: **`/api/openapi.json`**

## Base URL

```
http://localhost:3000/api
```

## Endpoints Principais

### Health Check
```http
GET /health
```

Verifica se a API está funcionando.

**Resposta (200 OK):**
```json
{
  "status": "ok"
}
```

---

### Seed de Dados
```http
POST /seed
```

Importa dados iniciais de uma API externa (tv-api.com). **Operação idempotente** - seguro executar múltiplas vezes.

**Resposta (200 OK):**
```json
{
  "message": "Seed completed successfully",
  "moviesAdded": 42,
  "actorsAdded": 128
}
```

---

## Seções da API

- [Filmes](movies.md) - GET, POST, PUT, DELETE de filmes
- [Atores](actors.md) - GET, POST, PUT, DELETE de atores
- [Autenticação](auth.md) - Detalhes de autenticação (se aplicável)

## Status HTTP Esperados

| Código | Significado |
|--------|------------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado |
| 400 | Bad Request - Dados inválidos |
| 404 | Not Found - Recurso não encontrado |
| 500 | Server Error - Erro no servidor |

## Tratamento de Erros

Resposta de erro padrão:
```json
{
  "error": "Descrição do erro",
  "code": "ERROR_CODE"
}
```

---

**Próximo:** Explore [Endpoints de Filmes](movies.md)
