# Autenticação

## Status Atual

Atualmente, a API **não possui autenticação obrigatória** implementada. Todos os endpoints são públicos.

## Considerações Futuras

Para proteger a API em produção, considere implementar:

### 1. API Keys
- Gerar chaves para clientes autenticados
- Validar via middleware

### 2. JWT (JSON Web Tokens)
- Implementar login/registro
- Tokens com expiração
- Refresh tokens

### 3. OAuth 2.0
- Integração com provedores (Google, GitHub)

### 4. Rate Limiting
- Limitar requisições por IP/usuário
- Prevenir abuso

## Exemplo com JWT (Future Implementation)

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "senha123"
}
```

**Resposta (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "..."
}
```

**Usar em requisições subsequentes:**
```http
GET /api/movies
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

**Nota:** Implementar autenticação quando a API for exposta em produção.
