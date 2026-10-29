# Vyntex — site inicial

Site inicial em React + Vite, preparado para deploy na Vercel.

## Rodar no computador

1. Instale o Node.js LTS.
2. Extraia o ZIP e abra a pasta `vyntex-site` no terminal.
3. Execute:

```bash
npm install
npm run dev
```

4. Abra o endereço local mostrado no terminal.

## Publicar na Vercel

1. Envie esta pasta para um repositório GitHub.
2. Importe o repositório na Vercel.
3. Framework: Vite (detecção automática); Build Command `npm run build`; Output Directory `dist`.
4. Publique. A Vercel fornecerá um endereço `.vercel.app`.

## Antes de lançar

**Importante:** publique também a versão atualizada do backend no Render. O frontend novo depende das rotas de sessão por cookie (`credentials: include`) e não é compatível com o backend antigo que devolve `#token=`.

- Confirme no Render que `FRONTEND_URL` é exatamente o domínio público atual do site (por exemplo, `https://vyntexbot.vercel.app`, sem `/dashboard` no final).
- Confirme que `DISCORD_REDIRECT_URI` é exatamente `https://vyntex-auth-backend.onrender.com/auth/callback` e que esse mesmo endereço está cadastrado no portal de desenvolvedores do Discord.
- O login usa um cookie de sessão `HttpOnly` definido pelo backend; não salve tokens manualmente no navegador. A sessão expira e pode ser necessário entrar novamente.
- `vercel.json` faz as rotas internas, como `/dashboard`, abrirem corretamente na Vercel.
- A página de comandos contém exemplos iniciais; ajuste para corresponder aos comandos reais.
- O favicon utiliza `public/vyntex.png`.


## Painel de configuração por servidor

Quando o usuário seleciona **Configurar servidor**, a interface abre em `/dashboard/ID_DO_SERVIDOR`. A tela usa uma navegação própria de painel, com menu lateral de categorias e seletor para voltar à lista de servidores. O fallback de rotas do Vercel já encaminha URLs para `index.html`.

A interface de Welcome e Booster é conectada ao backend por cookie de sessão e permite carregar canais, editar campos e salvar configurações por servidor. O backend continua sendo responsável por sessão, permissões e validação; as demais categorias permanecem como prévias.

### Painel de Welcome

O editor de Welcome usa canais reais retornados pelo backend, pesquisa de canais, templates, variáveis, mensagem normal ou embed, pré-visualização em tempo real, restauração de alterações, salvamento e envio de teste sem persistir o rascunho. O teste usa `POST /api/guilds/:guildId/welcome/test` e mantém a validação de sessão, permissões e canal no backend. Booster continua disponível pela mesma API.

### Variáveis do frontend

Copie `.env.example` para `.env` apenas se precisar trocar os valores padrão:

- `VITE_AUTH_API_URL`: URL pública do backend de autenticação.
- `VITE_DISCORD_CLIENT_ID`: Application ID público usado apenas para montar o convite do bot.

Não coloque tokens, client secrets ou credenciais MongoDB no frontend.
## Estado atual da integração

Welcome e Booster estão conectados às rotas autenticadas do backend e salvam no MongoDB compartilhado. Logs, Moderação, Tickets e demais categorias continuam como prévias visuais.
