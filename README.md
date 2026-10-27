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

- No arquivo `src/main.jsx`, substitua `COLOQUE_O_ID_DO_BOT` pelo ID real da aplicação Discord.
- O botão de convite só funcionará depois de configurar o ID e as permissões corretas.
- O botão “Abrir painel” é uma página inicial visual. Login OAuth2, configurações salvas e dados reais precisam de backend e configuração segura.
- A página de comandos contém exemplos iniciais; ajuste para corresponder aos comandos reais.
- O favicon utiliza `public/vyntex.png`.

## Dashboard de servidores (prévia visual)
A rota `/dashboard` agora mostra cards de servidores de exemplo, com estados de bot instalado/não instalado e ações visuais de configurar/adicionar. A listagem é apenas demonstrativa: para dados reais do Discord, é necessário implementar OAuth2 (`identify` e `guilds`), callback seguro no backend, consulta de servidores acessíveis e verificação dos servidores onde o bot está instalado. Não coloque o client secret do Discord no frontend.
