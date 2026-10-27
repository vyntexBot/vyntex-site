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

- Confirme no Render que `FRONTEND_URL` é exatamente o domínio público atual do site (por exemplo, `https://vyntexbot.vercel.app`, sem `/dashboard` no final).
- Confirme que `DISCORD_REDIRECT_URI` é exatamente `https://vyntex-auth-backend.onrender.com/auth/callback` e que esse mesmo endereço está cadastrado no portal de desenvolvedores do Discord.
- O login fica salvo no navegador com `localStorage`; por segurança, a sessão expira e poderá ser necessário autorizar novamente.
- `vercel.json` faz as rotas internas, como `/dashboard`, abrirem corretamente na Vercel.
- A página de comandos contém exemplos iniciais; ajuste para corresponder aos comandos reais.
- O favicon utiliza `public/vyntex.png`.
