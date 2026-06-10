# Deployment

Guia para colocar a aplicação em produção.

## Opções de Deployment

### 1. Backend (Node.js)

#### Heroku
```bash
# Login
heroku login

# Criar app
heroku create seu-app-name

# Deploy
git push heroku main
```

#### Railway
```bash
# Deploy via dashboard
# railway.app
```

#### Render
```bash
# 1. Conectar repositório Git
# 2. Configurar variáveis de ambiente
# 3. Deploy automático em cada push
```

#### AWS EC2
```bash
# 1. Criar instância EC2
# 2. SSH na instância
# 3. Clonar repositório
# 4. npm install && npm start
# 5. Usar PM2 para manter processo rodando
```

---

### 2. Frontend (Vue.js)

#### Vercel
```bash
npm install -g vercel

vercel login
cd vue-app
vercel deploy --prod
```

#### Netlify
```bash
npm install -g netlify-cli

cd vue-app
netlify deploy --prod
```

#### GitHub Pages
```bash
# Configure vite.config.js com base: '/seu-repo/'
npm run build
# Fazer push da pasta dist/
```

---

## Configuração de Variáveis de Ambiente

### Backend (.env em produção)

```env
# Banco de dados
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua_chave_api_anon
SUPABASE_SERVICE_KEY=sua_chave_service

# Express
NODE_ENV=production
PORT=3000

# CORS
CORS_ORIGIN=https://seu-frontend.vercel.app
```

### Frontend (.env.production em vue-app)

```env
VITE_API_URL=https://seu-backend.herokuapp.com/api
```

---

## Checklist pré-Deployment

- [ ] Todas as variáveis de ambiente configuradas
- [ ] Build local testado: `npm run build`
- [ ] Testes passando: `npm test`
- [ ] Sem logs de debug ou console.log
- [ ] CORS configurado corretamente
- [ ] SSL/HTTPS ativado
- [ ] Banco de dados backup realizado
- [ ] Limites de rate-limiting configurados
- [ ] Monitoramento/logs ativados

---

## Monitoramento em Produção

### Logs
- **Heroku**: `heroku logs --tail`
- **Railway/Render**: Dashboard integrado
- **AWS**: CloudWatch

### Métricas
- Uptime
- Tempo de resposta
- Taxa de erro
- Uso de CPU/memória

**Ferramentas:**
- Sentry (error tracking)
- New Relic (performance)
- LogRocket (frontend monitoring)

---

## Backup do Banco de Dados

### Supabase
```bash
# Backup manual via dashboard
# Ou usar pg_dump:
pg_dump -h seu-host -U postgres dbname > backup.sql
```

### Restaurar
```bash
psql -h seu-host -U postgres dbname < backup.sql
```

---

## HTTPS e SSL

- **Heroku/Vercel/Netlify**: SSL automático
- **AWS EC2**: Use Let's Encrypt via Certbot
- **Nginx**: Configure redirecionamento HTTP → HTTPS

---

## Performance em Produção

### Backend
```bash
# Usar PM2 para processos múltiplos
npm install -g pm2
pm2 start server/index.js -i max
```

### Frontend
```bash
# Minificar e comprimir
npm run build

# Servir com compressão gzip
```

---

## Rollback

Se algo der errado:

```bash
# Git - voltar para versão anterior
git revert <commit-id>
git push origin main

# Heroku - reverter último deploy
heroku releases:rollback
```

---

**Suporte:** Para dúvidas, consulte a documentação de cada plataforma.
