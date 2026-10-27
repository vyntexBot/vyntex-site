import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Menu, X, ChevronRight, ShieldCheck, Ticket, Zap, Users, MessageSquare,
  Settings2, Check, ArrowUpRight, Command, LockKeyhole, Sparkles, Crown,
  Activity, Headphones, Bot, LayoutDashboard, Gamepad2, Server, Plus, ExternalLink,
  SlidersHorizontal, CircleCheck, UsersRound
} from 'lucide-react';
import './style.css';

const botInvite = 'https://discord.com/oauth2/authorize?client_id=1443238280060473507&permissions=8&scope=bot%20applications.commands';
const sections = [
  { id: 'commands', label: 'Comandos', path: '/commands' },
  { id: 'store', label: 'Loja', path: '/store' },
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
];

function App() {
  const [route, setRoute] = useState(window.location.pathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [faqOpen, setFaqOpen] = useState(0);

  function go(path) {
    window.history.pushState({}, '', path);
    setRoute(path);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  window.onpopstate = () => setRoute(window.location.pathname);

  const page = route.replace(/\/+$/, '') || '/';
  const isPanel = page === '/dashboard' || page === '/panel';
  const isCommands = page === '/commands';
  const isStore = page === '/store' || page === '/loja';
  const isTeam = page === '/team' || page === '/cargos';

  const commandGroups = [
    { title: 'Tickets', icon: Ticket, commands: [['/ticket', 'Envia o painel para abrir tickets.'], ['/fechar', 'Fecha o ticket atual.'], ['/adicionar', 'Adiciona uma pessoa ao ticket.'], ['/remover', 'Remove uma pessoa do ticket.']] },
    { title: 'Moderação', icon: ShieldCheck, commands: [['/ban', 'Bane um membro do servidor.'], ['/kick', 'Expulsa um membro do servidor.'], ['/timeout', 'Aplica um tempo limite.'], ['/limpar', 'Limpa mensagens do canal.']] },
    { title: 'Servidor', icon: Settings2, commands: [['/config', 'Configura os recursos do Vyntex.'], ['/logs', 'Define o canal de registros.'], ['/boas-vindas', 'Configura as boas-vindas.'], ['/ajuda', 'Mostra os comandos disponíveis.']] },
  ];
  const allCommands = commandGroups.flatMap(g => g.commands.map(c => ({ ...{ name:c[0], desc:c[1], group:g.title } })));
  const visibleCommands = allCommands.filter(c => `${c.name} ${c.desc} ${c.group}`.toLowerCase().includes(search.toLowerCase()));

  return <div className="app-shell">
    <header className="navbar">
      <button className="brand" onClick={() => go('/')} aria-label="Vyntex início">
        <img src="/vyntex.png" alt="Vyntex" /><span>Vyntex</span>
      </button>
      <nav className={`navlinks ${mobileOpen ? 'mobile-open' : ''}`}>
        <button onClick={() => go('/commands')}>Comandos</button>
        <button onClick={() => go('/store')}>Loja</button>
        <button onClick={() => go('/dashboard')}>Dashboard</button>
        <div className="mobile-actions">
          <button className="nav-login" onClick={() => go('/dashboard')}>Entrar</button>
          <a className="btn btn-light" href={botInvite}>Adicionar ao Discord <ArrowUpRight size={15}/></a>
        </div>
      </nav>
      <div className="navright">
        <button className="nav-login" onClick={() => go('/dashboard')}>Abrir painel</button>
        <a className="btn btn-light nav-invite" href={botInvite}><Bot size={15}/> Adicionar ao Discord</a>
      </div>
      <button className="menu-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Abrir menu">{mobileOpen ? <X/> : <Menu/>}</button>
    </header>

    {isPanel ? <main className="subpage dashboard-page">
      <div className="dashboard-heading">
        <div><div className="eyebrow"><LayoutDashboard size={14}/> DASHBOARD VYNTEX</div><h1>Seus <span>servidores.</span></h1><p className="sublead">Escolha uma comunidade para configurar o Vyntex ou adicione o bot a um novo servidor.</p></div>
        <a className="btn btn-primary dashboard-add" href={botInvite}><Plus size={17}/> Adicionar bot</a>
      </div>
      <div className="dashboard-demo-note"><LockKeyhole size={16}/><span><b>Prévia do painel:</b> os cards abaixo são exemplos visuais. Para listar servidores reais, mostrar o avatar do usuário e identificar onde o bot já está instalado, ainda é necessário concluir o OAuth2 do Discord e conectar uma API/backend.</span></div>
      <div className="server-section-title"><div><h2>Selecione um servidor</h2><p>Servidores que você administra ou onde tem permissão para gerenciar.</p></div><span className="server-count">3 exemplos</span></div>
      <div className="server-grid">
        <article className="server-card"><div className="server-card-top"><div className="server-avatar server-avatar-blue"><UsersRound size={26}/></div><span className="server-status installed"><CircleCheck size={13}/> Bot instalado</span></div><h3>Minha Comunidade</h3><p>Servidor de exemplo para prévia do painel.</p><div className="server-card-bottom"><span className="server-members"><Users size={14}/> Servidor de demonstração</span><button className="btn btn-primary server-action" onClick={()=>alert('A configuração real será habilitada quando o Discord OAuth2 e a API do bot estiverem conectados.')}><SlidersHorizontal size={15}/> Configurar servidor</button></div></article>
        <article className="server-card"><div className="server-card-top"><div className="server-avatar server-avatar-purple"><Gamepad2 size={26}/></div><span className="server-status installed"><CircleCheck size={13}/> Bot instalado</span></div><h3>Comunidade Roblox</h3><p>Servidor de exemplo para prévia do painel.</p><div className="server-card-bottom"><span className="server-members"><Users size={14}/> Servidor de demonstração</span><button className="btn btn-primary server-action" onClick={()=>alert('A configuração real será habilitada quando o Discord OAuth2 e a API do bot estiverem conectados.')}><SlidersHorizontal size={15}/> Configurar servidor</button></div></article>
        <article className="server-card"><div className="server-card-top"><div className="server-avatar server-avatar-cyan"><Server size={26}/></div><span className="server-status not-installed"><Plus size={13}/> Bot não instalado</span></div><h3>Meu servidor novo</h3><p>Servidor de exemplo para prévia do painel.</p><div className="server-card-bottom"><span className="server-members"><Users size={14}/> Servidor de demonstração</span><a className="btn btn-outline server-action" href={botInvite}><Plus size={15}/> Adicionar ao servidor</a></div></article>
      </div>
      <div className="dashboard-help"><div className="help-icon"><ShieldCheck size={20}/></div><div><b>Não encontrou seu servidor?</b><p>Na versão conectada, só aparecerão servidores nos quais sua conta tenha permissão para gerenciar.</p></div></div>
    </main> :
    isCommands ? <main className="subpage commands-page">
      <div className="eyebrow"><Command size={14}/> CENTRAL DE COMANDOS</div>
      <h1>Comandos do <span>Vyntex</span></h1>
      <p className="sublead">Tudo para organizar seu servidor e facilitar o trabalho da sua equipe.</p>
      <div className="searchbar"><Command size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar comando ou recurso..."/><kbd>⌕</kbd></div>
      <div className="command-grid">{visibleCommands.map(c=><article className="command-card" key={c.name}><div><code>{c.name}</code><span className="command-group">{c.group}</span></div><p>{c.desc}</p></article>)}</div>
      <p className="footnote">Lista inicial de exemplo — os comandos finais dependem da implementação do bot.</p>
    </main> :
    isStore ? <main className="subpage store-page">
      <div className="eyebrow"><Sparkles size={14}/> PLANOS VYNTEX</div>
      <h1>Escolha seu <span>plano.</span></h1>
      <p className="sublead">Comece gratuitamente e evolua quando seu servidor precisar de mais.</p>
      <div className="pricing-grid">
        <article className="price-card"><div className="plan-name">FREE</div><h2>R$ 0<span>/sempre</span></h2><p>O essencial para começar.</p><ul><li><Check/> Sistema de tickets</li><li><Check/> Moderação básica</li><li><Check/> Logs e boas-vindas</li><li><Check/> Comandos essenciais</li></ul><a href={botInvite} className="btn btn-outline">Adicionar ao Discord</a></article>
        <article className="price-card featured"><div className="popular">EM BREVE</div><div className="plan-name"><Crown size={15}/> PREMIUM</div><h2>Em breve</h2><p>Mais ferramentas para sua comunidade.</p><ul><li><Check/> Tudo do plano Free</li><li><Check/> Formulários personalizados</li><li><Check/> Recursos avançados</li><li><Check/> Configurações extras</li></ul><button className="btn btn-primary" onClick={()=>alert('Os planos Premium ainda estão sendo preparados.')}>Tenho interesse <ArrowUpRight/></button></article>
      </div>
      <p className="footnote">Os preços e recursos premium serão definidos antes do lançamento.</p>
    </main> :
    <main>
      <section className="hero">
        <div className="hero-glow"></div><div className="hero-grid"></div>
        <div className="hero-copy">
          <div className="status-pill"><span className="pulse"></span> SEU SERVIDOR, EM OUTRO NÍVEL</div>
          <h1>Seu Discord.<br/>Suas regras.<br/><span>Vyntex.</span></h1>
          <p>Tickets, moderação e automação em um só bot. Menos trabalho manual para sua equipe e mais tempo para sua comunidade.</p>
          <div className="hero-actions">
            <a className="btn btn-primary btn-large" href={botInvite}><Bot size={18}/> Adicionar ao Discord <ArrowUpRight size={17}/></a>
            <button className="btn btn-secondary btn-large" onClick={() => go('/dashboard')}><LayoutDashboard size={18}/> Abrir o painel</button>
          </div>
          <div className="hero-proof"><div className="proof-avatars"><span>V</span><span>✓</span><span>+</span></div><span><b>Feito para comunidades</b><small>Prático, organizado e personalizável</small></span></div>
        </div>
        <div className="hero-art">
          <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
          <div className="logo-aura"></div><img className="hero-logo" src="/vyntex.png" alt="Logo Vyntex"/>
          <div className="float-card card-ticket"><span className="float-icon"><Ticket size={18}/></span><span><b>Tickets organizados</b><small>Atendimento simplificado</small></span><span className="tiny-check"><Check size={13}/></span></div>
          <div className="float-card card-mod"><span className="float-icon"><ShieldCheck size={18}/></span><span><b>Moderação</b><small>Seu servidor protegido</small></span></div>
          <div className="float-card card-antiraid"><span className="float-icon"><ShieldCheck size={18}/></span><span><b>Anti-Raid</b><small>Proteção para sua comunidade</small></span></div>
          <div className="float-card card-roblox"><span className="float-icon"><Gamepad2 size={18}/></span><span><b>Comunidade Roblox</b><small>Conecte seus jogadores</small></span></div>
          <div className="mini-chip"><span className="pulse"></span> SISTEMA ONLINE</div>
        </div>
        <div className="hero-bottom"><span>UM BOT. VÁRIAS POSSIBILIDADES.</span><span>01 — 04</span></div>
      </section>

      <section className="features section-wrap" id="features">
        <div className="section-heading"><div><div className="eyebrow">RECURSOS PRINCIPAIS</div><h2>Seu servidor funcionando<br/><span>sem complicação.</span></h2></div><p>Ferramentas para cuidar da comunidade, atender membros e manter tudo organizado.</p></div>
        <div className="feature-grid">
          <article className="feature-card feature-large"><div className="feature-icon"><Ticket/></div><div className="feature-number">01 / ATENDIMENTO</div><h3>Tickets sem bagunça.</h3><p>Organize solicitações, suporte e atendimento em canais privados para sua equipe.</p><div className="ticket-preview"><div className="preview-top"><span className="preview-dot"></span> Central de atendimento <span className="preview-badge">ABERTO</span></div><div className="preview-line"></div><div className="preview-line short"></div><div className="preview-btn">Abrir ticket <ChevronRight size={13}/></div></div></article>
          <article className="feature-card"><div className="feature-icon"><ShieldCheck/></div><div className="feature-number">02 / SEGURANÇA</div><h3>Moderação prática.</h3><p>Comandos para ajudar sua equipe a manter a ordem no servidor.</p><div className="feature-decoration shield"><ShieldCheck size={92}/></div></article>
          <article className="feature-card"><div className="feature-icon"><Activity/></div><div className="feature-number">03 / CONTROLE</div><h3>Logs e registros.</h3><p>Acompanhe ações importantes e mantenha tudo mais transparente.</p><div className="log-lines"><i></i><i></i><i></i></div></article>
          <article className="feature-card"><div className="feature-icon"><Zap/></div><div className="feature-number">04 / AUTOMAÇÃO</div><h3>Menos tarefas manuais.</h3><p>Configure ferramentas úteis para o dia a dia da sua comunidade.</p></article>
        </div>
      </section>

      <section className="cta-band"><div className="cta-symbol"><img src="/vyntex.png" alt=""/></div><div><div className="eyebrow">PRONTO PARA COMEÇAR?</div><h2>Leve o Vyntex para seu servidor.</h2><p>Adicione o bot e prepare sua comunidade para o próximo nível.</p></div><a className="btn btn-light" href={botInvite}>Adicionar ao Discord <ArrowUpRight size={16}/></a></section>

      <section className="faq section-wrap"><div className="eyebrow">DÚVIDAS FREQUENTES</div><h2>Quer saber mais?</h2>{[['O que é o Vyntex?','Um bot para ajudar com tickets, moderação e organização de servidores Discord.'],['Como adiciono o bot?','Use o botão “Adicionar ao Discord”. O link definitivo será configurado com o ID oficial do bot.'],['Como abro o painel?','Clique em “Abrir o painel”. O login e as configurações reais serão ligados ao OAuth2 e à aplicação do Vyntex numa próxima etapa.']].map(([q,a],i)=><div className={`faq-item ${faqOpen===i?'open':''}`} key={q}><button onClick={()=>setFaqOpen(faqOpen===i?-1:i)}><span>{q}</span><span>{faqOpen===i?'−':'+'}</span></button>{faqOpen===i&&<p>{a}</p>}</div>)}</section>
    </main>}

    <footer className="footer"><button className="brand footer-brand" onClick={()=>go('/')}><img src="/vyntex.png" alt=""/><span>Vyntex</span></button><span>© 2026 Vyntex. Feito para comunidades Discord.</span><div><button onClick={()=>go('/commands')}>Comandos</button><button onClick={()=>go('/store')}>Loja</button><button onClick={()=>go('/dashboard')}>Painel</button></div></footer>
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);