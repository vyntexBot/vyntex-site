import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Menu, X, ChevronRight, ShieldCheck, Ticket, Zap, Users, MessageSquare,
  Settings2, Check, ArrowUpRight, Command, LockKeyhole, Sparkles, Crown,
  Activity, Headphones, Bot, LayoutDashboard, Gamepad2, Server, ExternalLink, RefreshCw, LogOut, UserRound
} from 'lucide-react';
import './style.css';

const botClientId = '1443238280060473507';
const botInvite = `https://discord.com/oauth2/authorize?client_id=${botClientId}&permissions=8&scope=bot%20applications.commands`;
const AUTH_API = 'https://vyntex-auth-backend.onrender.com';
function discordAvatar(user) {
  if (!user?.id || !user?.avatar) return null;
  const ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=128`;
}
function guildIcon(guild) { return guild.icon || null; }
const sections = [
  { id: 'home', label: 'Início', path: '/' },
  { id: 'commands', label: 'Comandos', path: '/commands' },
  { id: 'store', label: 'Loja', path: '/store' },
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
];

function App() {
  const [route, setRoute] = useState(window.location.pathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [faqOpen, setFaqOpen] = useState(0);
  const [profile, setProfile] = useState(null);
  const [guilds, setGuilds] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState('');
  const [sessionToken, setSessionToken] = useState(0);

  function go(path) {
    window.history.pushState({}, '', path);
    setRoute(path);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  window.onpopstate = () => setRoute(window.location.pathname);

  useEffect(() => {
    let cancelled = false;
    fetch(`${AUTH_API}/api/me`, { credentials: 'include' })
      .then(async r => { if (!r.ok) throw new Error('Sem sessão'); return r.json(); })
      .then(me => { if (!cancelled) setProfile(me); })
      .catch(() => { if (!cancelled) setProfile(null); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const authError = new URLSearchParams(window.location.search).get('auth_error');
    if (authError) {
      setDashboardError('O login foi cancelado ou não foi concluído. Tente conectar novamente.');
      window.history.replaceState({}, '', '/dashboard');
    }
  }, []);

  useEffect(() => {
    if (!(route.replace(/\/+$/, '') === '/dashboard' || route.replace(/\/+$/, '') === '/panel')) return;
    let cancelled = false;
    setDashboardLoading(true);
    fetch(`${AUTH_API}/api/me`, { credentials: 'include' })
      .then(async r => { const d = await r.json(); if (!r.ok) throw new Error(d.error || 'Faça login com o Discord para continuar.'); return d; })
      .then(async me => {
        const r = await fetch(`${AUTH_API}/api/guilds`, { credentials: 'include' });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || 'Não foi possível carregar os servidores.');
        if (!cancelled) { setProfile(me); setGuilds(d.guilds || []); setDashboardError(''); }
      })
      .catch(err => { if (!cancelled) { setProfile(null); setGuilds([]); if (!/Faça login com o Discord/i.test(err.message)) setDashboardError(err.message || 'Erro ao carregar o painel.'); } })
      .finally(() => { if (!cancelled) setDashboardLoading(false); });
    return () => { cancelled = true; };
  }, [route, sessionToken]);

  function loginDiscord() { window.location.href = `${AUTH_API}/auth/discord`; }
  function openDashboard() {
    setMobileOpen(false);
    loginDiscord();
  }
  async function logoutDiscord() {
    try { await fetch(`${AUTH_API}/auth/logout`, { method: 'POST', credentials: 'include' }); } catch { /* estado local será limpo mesmo se a rede falhar */ }
    setSessionToken(n => n + 1); setProfile(null); setGuilds([]); setDashboardError('');
  }
  function inviteBotToGuild(guildId) { window.location.href = `https://discord.com/oauth2/authorize?client_id=${botClientId}&permissions=8&scope=bot%20applications.commands&guild_id=${guildId}&disable_guild_select=true`; }

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
        <button className={page === '/' ? 'nav-active' : ''} onClick={() => go('/')}>Início</button>
        <button className={isCommands ? 'nav-active' : ''} onClick={() => go('/commands')}>Comandos</button>
        <button className={isStore ? 'nav-active' : ''} onClick={() => go('/store')}>Loja</button>
        <button className={isPanel ? 'nav-active' : ''} onClick={openDashboard}>Dashboard</button>
        <div className="mobile-actions">
          {profile ? <div className="mobile-account"><div className="nav-account-info">{discordAvatar(profile) ? <img src={discordAvatar(profile)} alt="Avatar do Discord"/> : <div className="nav-avatar-fallback"><UserRound size={16}/></div>}<span>{profile.global_name || profile.username}</span></div><button className="btn btn-outline" onClick={logoutDiscord}><LogOut size={15}/> Sair da conta</button></div> : <a className="btn btn-light" href={botInvite}>Adicionar ao Discord <ArrowUpRight size={15}/></a>}
        </div>
      </nav>
      <div className="navright">
        {!isPanel && <button className="nav-login nav-open-panel" onClick={openDashboard}>Abrir painel</button>}
        {profile ? <div className="nav-account"><div className="nav-account-info">{discordAvatar(profile) ? <img src={discordAvatar(profile)} alt="Avatar do Discord"/> : <div className="nav-avatar-fallback"><UserRound size={16}/></div>}<span>{profile.global_name || profile.username}</span></div><button className="btn btn-outline nav-logout" onClick={logoutDiscord} title="Sair da conta"><LogOut size={15}/> Sair</button></div> : <a className="btn btn-light nav-invite" href={botInvite}><Bot size={15}/> Adicionar ao Discord</a>}
      </div>
      <button className="menu-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Abrir menu">{mobileOpen ? <X/> : <Menu/>}</button>
    </header>

    {isPanel ? <main className="subpage dashboard-page">
      {!profile ? <section className="panel-page dashboard-login">
        <div className="subpage-icon"><LayoutDashboard size={24}/></div>
        <div className="eyebrow">PAINEL VYNTEX</div>
        <h1>Gerencie seus<br/><span>servidores.</span></h1>
        <p className="sublead">Conecte sua conta Discord para ver seu perfil e os servidores em que você pode administrar o Vyntex.</p>
        <button className="btn btn-primary btn-large" onClick={loginDiscord} disabled={dashboardLoading}><UserRound size={18}/> {dashboardLoading ? 'Conectando...' : 'Conectar com Discord'} <ArrowUpRight size={17}/></button>
        {dashboardError && <div className="dashboard-alert"><ShieldCheck size={17}/>{dashboardError}</div>}
        <div className="notice"><LockKeyhole size={16}/> A autorização é feita diretamente pelo Discord. Nunca informe sua senha aqui.</div>
      </section> : <section className="dashboard-content">
        <header className="dashboard-header">
          <div><div className="eyebrow"><LayoutDashboard size={14}/> DASHBOARD VYNTEX</div><h1>Seus <span>servidores.</span></h1><p>Escolha um servidor para adicionar ou configurar o bot.</p></div>
          <div className="dashboard-user">
            {discordAvatar(profile) ? <img src={discordAvatar(profile)} alt="Avatar do Discord"/> : <div className="avatar-fallback"><UserRound/></div>}
            <div><strong>{profile.global_name || profile.username}</strong><small>@{profile.username}</small></div>
            <button title="Sair da conta Discord" onClick={logoutDiscord}><LogOut size={17}/></button>
          </div>
        </header>
        <div className="guild-toolbar"><span><Server size={17}/> Servidores que você pode gerenciar <b>{guilds.length}</b></span><button className="btn btn-outline btn-refresh" onClick={() => { setSessionToken(n => n + 1); }}><RefreshCw size={14}/> Atualizar</button></div>
        {dashboardError && <div className="dashboard-alert"><ShieldCheck size={17}/>{dashboardError}</div>}
        {dashboardLoading ? <div className="guild-empty"><RefreshCw className="spin"/> Carregando seus servidores...</div> : guilds.length ? <div className="guild-grid">{guilds.map(guild => <article className="guild-card" key={guild.id}>
          <div className="guild-card-top">{guildIcon(guild) ? <img className="guild-icon" src={guild.icon} alt=""/> : <div className="guild-icon guild-icon-fallback"><Server size={24}/></div>}<div className="guild-title"><h3>{guild.name}</h3><small>{guild.owner ? 'Você é o dono' : 'Você pode gerenciar'}</small></div></div>
          <div className="guild-card-bottom">{guild.botInstalled ? <button className="btn btn-primary guild-action" onClick={() => alert(`Servidor selecionado: ${guild.name}. A tela de configurações detalhadas será conectada na próxima etapa.`)}><Settings2 size={16}/> Configurar servidor</button> : <button className="btn btn-outline guild-action" onClick={() => inviteBotToGuild(guild.id)}><Bot size={16}/> Adicionar ao servidor <ExternalLink size={14}/></button>}</div>
          {guild.botInstalled && <span className="guild-installed"><Check size={13}/> Vyntex conectado</span>}
        </article>)}</div> : <div className="guild-empty"><Server size={28}/><strong>Nenhum servidor encontrado</strong><span>Verifique se sua conta tem permissão de gerenciar algum servidor no Discord.</span></div>}
        <p className="footnote">Só aparecem servidores nos quais sua conta tem permissão de gerenciamento.</p>
      </section>}
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
    isTeam ? <main className="subpage team-page">
      <div className="eyebrow"><Users size={14}/> NOSSA EQUIPE</div>
      <h1>Quem faz o <span>Vyntex.</span></h1>
      <p className="sublead">Um projeto feito para deixar a gestão de comunidades mais simples.</p>
      <div className="team-card"><img src="/vyntex.png" alt="Vyntex"/><div><h3>Equipe Vyntex</h3><p>Desenvolvimento e suporte</p></div><span className="status-dot">Projeto</span></div>
      <p className="footnote">Os perfis da equipe poderão ser adicionados aqui depois.</p>
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
            <button className="btn btn-secondary btn-large" onClick={openDashboard}><LayoutDashboard size={18}/> Abrir o painel</button>
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

      <section className="faq section-wrap"><div className="eyebrow">DÚVIDAS FREQUENTES</div><h2>Quer saber mais?</h2>{[['O que é o Vyntex?','Um bot para ajudar com tickets, moderação e organização de servidores Discord.'],['Como adiciono o bot?','Use o botão “Adicionar ao Discord”. O link definitivo será configurado com o ID oficial do bot.'],['Como abro o painel?','Clique em “Abrir o painel” e autorize a conexão com o Discord para acessar seu perfil e seus servidores.']].map(([q,a],i)=><div className={`faq-item ${faqOpen===i?'open':''}`} key={q}><button onClick={()=>setFaqOpen(faqOpen===i?-1:i)}><span>{q}</span><span>{faqOpen===i?'−':'+'}</span></button>{faqOpen===i&&<p>{a}</p>}</div>)}</section>
    </main>}

    <footer className="footer"><button className="brand footer-brand" onClick={()=>go('/')}><img src="/vyntex.png" alt=""/><span>Vyntex</span></button><span>© 2026 Vyntex. Feito para comunidades Discord.</span><div><button onClick={()=>go('/commands')}>Comandos</button><button onClick={()=>go('/store')}>Loja</button><button onClick={openDashboard}>Painel</button></div></footer>
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);