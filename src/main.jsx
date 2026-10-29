import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Menu, X, ChevronRight, ShieldCheck, Ticket, Zap, Users, MessageSquare,
  Settings2, Check, ArrowUpRight, Command, LockKeyhole, Sparkles, Crown,
  Activity, Headphones, Bot, LayoutDashboard, Gamepad2, Server, ExternalLink, RefreshCw, LogOut, UserRound,
  ArrowLeft, BellRing, ClipboardList, ShieldAlert, UsersRound, MessageCircle, Instagram, Lightbulb, Hash, SlidersHorizontal, Clock3
} from 'lucide-react';
import './style.css';

const botClientId = import.meta.env.VITE_DISCORD_CLIENT_ID || '1443238280060473507';
const botInvite = `https://discord.com/oauth2/authorize?client_id=${botClientId}&permissions=8&scope=bot%20applications.commands`;
const AUTH_API = import.meta.env.VITE_AUTH_API_URL || 'https://vyntex-auth-backend.onrender.com';
function discordAvatar(user) {
  if (!user?.id || !user?.avatar) return null;
  const ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=128`;
}
function guildIcon(guild) { return guild.icon || null; }

function SettingsEditor({ type, config, channels, loading, saving, error, notice, onSave }) {
  const [form, setForm] = useState(config || {});
  useEffect(() => setForm(config || {}), [config, type]);
  const update = (key, value) => setForm(current => ({ ...current, [key]: value }));
  if (loading || !config) return <div className="guild-empty settings-loading"><RefreshCw className="spin"/> Carregando configurações...</div>;
  const label = type === 'welcome' ? 'Welcome' : 'Booster';
  return <form className="settings-form-preview live-settings-form" onSubmit={event => { event.preventDefault(); onSave(form); }}>
    {error && <div className="dashboard-alert settings-form-alert"><ShieldAlert size={17}/>{error}</div>}
    {notice && <div className="settings-success"><Check size={16}/>{notice}</div>}
    <label htmlFor={`${type}-channel`}>Canal de {type === 'welcome' ? 'boas-vindas' : 'notificações de Booster'}</label>
    <select id={`${type}-channel`} className="settings-select" value={form.channelId || ''} onChange={event => update('channelId', event.target.value || null)}>
      <option value="">Selecione um canal</option>
      {channels.map(channel => <option value={channel.id} key={channel.id}># {channel.name}</option>)}
    </select>
    <label htmlFor={`${type}-content`}>Mensagem normal</label>
    <textarea id={`${type}-content`} className="settings-control settings-textarea" value={form.content || ''} maxLength={2000} onChange={event => update('content', event.target.value)} />
    <div className="settings-check-row"><label><input type="checkbox" checked={Boolean(form.enabled)} onChange={event => update('enabled', event.target.checked)}/> Ativar sistema de {label}</label><small>O bot aplica esta alteração sem reiniciar.</small></div>
    <div className="settings-check-row"><label><input type="checkbox" checked={Boolean(form.useEmbed)} onChange={event => update('useEmbed', event.target.checked)}/> Enviar também um embed</label></div>
    {form.useEmbed && <>
      <label htmlFor={`${type}-title`}>Título do embed</label>
      <input id={`${type}-title`} className="settings-control" value={form.title || ''} maxLength={256} onChange={event => update('title', event.target.value)} />
      <label htmlFor={`${type}-description`}>Descrição do embed</label>
      <textarea id={`${type}-description`} className="settings-control settings-textarea" value={form.description || ''} maxLength={4096} onChange={event => update('description', event.target.value)} />
      <div className="settings-inline-fields"><div><label htmlFor={`${type}-color`}>Cor</label><input id={`${type}-color`} className="settings-control" value={form.color || ''} placeholder="#5865F2" onChange={event => update('color', event.target.value)} /></div><div><label htmlFor={`${type}-image`}>Imagem/Banner</label><input id={`${type}-image`} className="settings-control" value={form.imageUrl || ''} placeholder="https://..." onChange={event => update('imageUrl', event.target.value || null)} /></div></div>
      <label htmlFor={`${type}-footer`}>Rodapé (opcional)</label>
      <input id={`${type}-footer`} className="settings-control" value={form.footer || ''} maxLength={2048} onChange={event => update('footer', event.target.value || null)} />
    </>}
    <div className="settings-variable-help">Variáveis aceitas: <code>{'{user}'}</code> <code>{'{username}'}</code> <code>{'{server}'}</code>{type === 'welcome' && <> <code>{'{memberCount}'}</code></>}</div>
    <button className="btn btn-primary settings-save-button" type="submit" disabled={saving}>{saving ? 'Salvando...' : `Salvar ${label}`}</button>
  </form>;
}
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
  const [selectedGuild, setSelectedGuild] = useState(null);
  const [activeSetting, setActiveSetting] = useState('welcome');
  const [settingsData, setSettingsData] = useState({ welcome: null, booster: null, channels: [] });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [settingsNotice, setSettingsNotice] = useState('');

  function go(path) {
    window.history.pushState({}, '', path);
    setRoute(path);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  window.onpopstate = () => setRoute(window.location.pathname);
  const dashboardRouteActive = /^\/dashboard(?:\/[^/]+)?\/?$/.test(route) || route.replace(/\/+$/, '') === '/panel';

  useEffect(() => {
    // No dashboard, a consulta combinada abaixo já carrega o perfil e os servidores.
    if (/^\/dashboard(?:\/[^/]+)?\/?$/.test(window.location.pathname) || window.location.pathname === '/panel') return;
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
    if (!dashboardRouteActive) return;
    let cancelled = false;
    const cacheKey = 'vyntex-dashboard-cache-v1';
    // Mostra os últimos dados desta sessão imediatamente enquanto atualiza a lista em segundo plano.
    try {
      const cached = JSON.parse(sessionStorage.getItem(cacheKey) || 'null');
      if (cached?.profile && Array.isArray(cached.guilds)) {
        setProfile(cached.profile);
        setGuilds(cached.guilds);
        setDashboardLoading(false);
      } else setDashboardLoading(true);
    } catch { setDashboardLoading(true); }
    // Perfil e servidores são pedidos em paralelo; sem duplicar a chamada de perfil no dashboard.
    Promise.all([
      fetch(`${AUTH_API}/api/me`, { credentials: 'include' }),
      fetch(`${AUTH_API}/api/guilds`, { credentials: 'include' }),
    ])
      .then(async ([meResponse, guildResponse]) => {
        const [me, guildData] = await Promise.all([meResponse.json(), guildResponse.json()]);
        if (!meResponse.ok) throw new Error(me.error || 'Faça login com o Discord para continuar.');
        if (!guildResponse.ok) throw new Error(guildData.error || 'Não foi possível carregar os servidores.');
        if (!cancelled) {
          const nextGuilds = guildData.guilds || [];
          setProfile(me); setGuilds(nextGuilds); setDashboardError('');
          try { sessionStorage.setItem(cacheKey, JSON.stringify({ profile: me, guilds: nextGuilds, savedAt: Date.now() })); } catch { /* cache opcional */ }
        }
      })
      .catch(err => { if (!cancelled) {
        if (/Faça login com o Discord|Sem sessão|Unauthorized|401/i.test(err.message)) {
          setProfile(null); setGuilds([]);
          try { sessionStorage.removeItem(cacheKey); } catch { /* cache opcional */ }
        }
        if (!/Faça login com o Discord/i.test(err.message)) setDashboardError(err.message || 'Erro ao atualizar o painel.');
      } })
      .finally(() => { if (!cancelled) setDashboardLoading(false); });
    return () => { cancelled = true; };
  }, [dashboardRouteActive, sessionToken]);

  useEffect(() => {
    const currentPage = route.replace(/\/+$/, '') || '/';
    const match = currentPage.match(/^\/dashboard\/([^/]+)$/);
    if (!match || !guilds.length) {
      if (!match) setSelectedGuild(null);
      return;
    }
    const guild = guilds.find(item => item.id === match[1]);
    if (guild && guild.botInstalled) setSelectedGuild(guild);
    else if (guild) {
      window.history.replaceState({}, '', '/dashboard');
      setRoute('/dashboard');
      setSelectedGuild(null);
      setDashboardError('O Vyntex não está instalado neste servidor. Adicione o bot para configurá-lo.');
    } else {
      setDashboardError('Esse servidor não está disponível na sua lista ou você não tem permissão para gerenciá-lo.');
    }
  }, [route, guilds]);

  useEffect(() => {
    if (!selectedGuild?.id) return;
    let cancelled = false;
    setSettingsLoading(true); setSettingsError(''); setSettingsNotice('');
    const base = `${AUTH_API}/api/guilds/${selectedGuild.id}`;
    Promise.all([
      fetch(`${base}/welcome`, { credentials: 'include' }),
      fetch(`${base}/booster`, { credentials: 'include' }),
      fetch(`${base}/channels`, { credentials: 'include' }),
    ]).then(async responses => {
      const payloads = await Promise.all(responses.map(response => response.json()));
      const failed = responses.findIndex(response => !response.ok);
      if (failed >= 0) throw new Error(payloads[failed].error || 'Não foi possível carregar as configurações.');
      if (!cancelled) setSettingsData({ welcome: payloads[0], booster: payloads[1], channels: payloads[2].channels || [] });
    }).catch(error => { if (!cancelled) setSettingsError(error.message || 'Não foi possível carregar as configurações.'); })
      .finally(() => { if (!cancelled) setSettingsLoading(false); });
    return () => { cancelled = true; };
  }, [selectedGuild?.id]);

  function loginDiscord() { window.location.href = `${AUTH_API}/auth/discord`; }
  function openDashboard() {
    setMobileOpen(false);
    loginDiscord();
  }
  async function logoutDiscord() {
    try { await fetch(`${AUTH_API}/auth/logout`, { method: 'POST', credentials: 'include' }); } catch { /* estado local será limpo mesmo se a rede falhar */ }
    setSessionToken(n => n + 1); setProfile(null); setGuilds([]); setDashboardError('');
  }
  async function saveSetting(type, values) {
    if (!selectedGuild?.id) return;
    setSettingsSaving(true); setSettingsError(''); setSettingsNotice('');
    try {
      const response = await fetch(`${AUTH_API}/api/guilds/${selectedGuild.id}/${type}`, {
        method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Não foi possível salvar a configuração.');
      setSettingsData(current => ({ ...current, [type]: payload }));
      setSettingsNotice(`${type === 'welcome' ? 'Welcome' : 'Booster'} salvo com sucesso.`);
    } catch (error) { setSettingsError(error.message || 'Não foi possível salvar a configuração.'); }
    finally { setSettingsSaving(false); }
  }
  function inviteBotToGuild(guildId) { window.location.href = `https://discord.com/oauth2/authorize?client_id=${botClientId}&permissions=8&scope=bot%20applications.commands&guild_id=${guildId}&disable_guild_select=true`; }

  const page = route.replace(/\/+$/, '') || '/';
  const isPanel = page === '/dashboard' || page === '/panel' || /^\/dashboard\/[^/]+$/.test(page);
  const isCommands = page === '/commands';
  const isStore = page === '/store' || page === '/loja';
  const isTeam = page === '/team' || page === '/cargos';
  const settingSections = [
    { id: 'welcome', label: 'Boas-vindas', desc: 'Mensagem e canal de entrada', icon: BellRing, status: 'Preparando' },
    { id: 'booster', label: 'Booster', desc: 'Agradecimento por Boost', icon: Crown, status: 'Preparando' },
    { id: 'logs', label: 'Logs', desc: 'Registros do servidor', icon: ClipboardList, status: 'Preparando' },
    { id: 'moderation', label: 'Moderação', desc: 'Regras e punições', icon: ShieldAlert, status: 'Preparando' },
    { id: 'tickets', label: 'Tickets', desc: 'Atendimento da comunidade', icon: MessageSquare, status: 'Preparando' },
    { id: 'autorole', label: 'Cargos automáticos', desc: 'Cargos ao entrar', icon: UsersRound, status: 'Preparando' },
    { id: 'antiraid', label: 'Anti-raid e anti-spam', desc: 'Proteção contra ataques', icon: ShieldCheck, status: 'Preparando' },
    { id: 'suggestions', label: 'Sugestões', desc: 'Painel de ideias e votação', icon: Lightbulb, status: 'Preparando' },
    { id: 'instagram', label: 'Instagram', desc: 'Avisos de novas publicações', icon: Instagram, status: 'Preparando' },
  ];
  const currentSetting = settingSections.find(item => item.id === activeSetting) || settingSections[0];
  const CurrentSettingIcon = currentSetting.icon;

  const commandGroups = [
    { title: 'Tickets', icon: Ticket, commands: [['/ticket', 'Envia o painel para abrir tickets.'], ['/fechar', 'Fecha o ticket atual.'], ['/adicionar', 'Adiciona uma pessoa ao ticket.'], ['/remover', 'Remove uma pessoa do ticket.']] },
    { title: 'Moderação', icon: ShieldCheck, commands: [['/ban', 'Bane um membro do servidor.'], ['/kick', 'Expulsa um membro do servidor.'], ['/timeout', 'Aplica um tempo limite.'], ['/limpar', 'Limpa mensagens do canal.']] },
    { title: 'Servidor', icon: Settings2, commands: [['/config', 'Configura os recursos do Vyntex.'], ['/logs', 'Define o canal de registros.'], ['/boas-vindas', 'Configura as boas-vindas.'], ['/ajuda', 'Mostra os comandos disponíveis.']] },
  ];
  const allCommands = commandGroups.flatMap(g => g.commands.map(c => ({ ...{ name:c[0], desc:c[1], group:g.title } })));
  const visibleCommands = allCommands.filter(c => `${c.name} ${c.desc} ${c.group}`.toLowerCase().includes(search.toLowerCase()));

  const serverConfigMode = isPanel && Boolean(selectedGuild) && /^\/dashboard\/[^/]+$/.test(page);

  return <div className={`app-shell ${serverConfigMode ? 'dashboard-config-shell' : ''}`}>
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
        {selectedGuild ? <section className="server-settings-view">
          <aside className="config-app-sidebar">
            <button className="config-brand" onClick={() => go('/dashboard')}><img src="/vyntex.png" alt=""/> <span>VYNTEX</span></button>
            <button className="config-guild-switch" onClick={() => { setSelectedGuild(null); go('/dashboard'); }}>
              {guildIcon(selectedGuild) ? <img src={selectedGuild.icon} alt=""/> : <span className="config-guild-fallback"><Server size={19}/></span>}
              <span><strong>{selectedGuild.name}</strong><small>Configurações do servidor</small></span><ChevronRight size={15}/>
            </button>
            <div className="config-menu-label">CONFIGURAÇÕES</div>
            {settingSections.map(item => { const Icon = item.icon; return <button key={item.id} className={`config-side-link ${activeSetting === item.id ? 'active' : ''}`} onClick={() => setActiveSetting(item.id)}><Icon size={17}/><span>{item.label}</span></button>; })}
            <div className="config-sidebar-bottom"><button onClick={() => { setSelectedGuild(null); go('/dashboard'); }}><ArrowLeft size={16}/> Todos os servidores</button><div className="config-sidebar-user">{discordAvatar(profile) ? <img src={discordAvatar(profile)} alt=""/> : <UserRound size={18}/>}<span>{profile.global_name || profile.username}</span><button onClick={logoutDiscord} title="Sair"><LogOut size={15}/></button></div></div>
          </aside>
           <div className={`config-workspace ${(activeSetting === 'welcome' || activeSetting === 'booster') ? 'live-config-workspace' : ''}`}>
           {(activeSetting === 'welcome' || activeSetting === 'booster') && <div className="live-settings-panel"><div className="settings-live-heading"><strong>{activeSetting === 'welcome' ? 'Configuração de Welcome' : 'Configuração de Booster'}</strong><span>Sincronizado com o VyntexBot</span></div><SettingsEditor type={activeSetting} config={settingsData[activeSetting]} channels={settingsData.channels} loading={settingsLoading} saving={settingsSaving} error={settingsError} notice={settingsNotice} onSave={values => saveSetting(activeSetting, values)} /></div>}
          <div className="settings-topline"><button className="btn btn-outline settings-back" onClick={() => { setSelectedGuild(null); go('/dashboard'); }}><ArrowLeft size={15}/> Voltar aos servidores</button><span className="settings-preview-label"><Clock3 size={13}/> Prévia da configuração</span></div>
          <div className="selected-server-banner">
            {guildIcon(selectedGuild) ? <img className="selected-server-icon" src={selectedGuild.icon} alt=""/> : <div className="selected-server-icon selected-server-fallback"><Server size={24}/></div>}
            <div className="selected-server-copy"><div className="eyebrow">CONFIGURAÇÕES DO SERVIDOR</div><h2>{selectedGuild.name}</h2><p>Organize os recursos do Vyntex em um só lugar.</p></div>
            <span className="server-connected"><Check size={13}/> Vyntex conectado</span>
          </div>
          <div className="settings-layout">
            <aside className="settings-sidebar"><div className="settings-sidebar-title"><SlidersHorizontal size={15}/> CATEGORIAS</div>{settingSections.map(item => { const Icon = item.icon; return <button key={item.id} className={`settings-nav-item ${activeSetting === item.id ? 'selected' : ''}`} onClick={() => setActiveSetting(item.id)}><Icon size={17}/><span>{item.label}<small>{item.desc}</small></span><ChevronRight size={14}/></button>; })}</aside>
            <div className="settings-main-panel">
              <div className="settings-panel-heading"><div className="settings-feature-icon"><CurrentSettingIcon size={22}/></div><div><div className="eyebrow">CONFIGURAÇÃO</div><h3>{currentSetting.label}</h3><p>{currentSetting.desc}</p></div><span className="coming-badge">EM BREVE</span></div>
              <div className="settings-preview-note"><Sparkles size={18}/><div><strong>Estamos preparando este sistema</strong><p>Esta é a estrutura visual inicial. Os controles serão conectados ao bot e ao banco de dados na próxima etapa.</p></div></div>
              {activeSetting === 'welcome' && <div className="settings-form-preview"><label>Canal de boas-vindas</label><div className="fake-select"><span><Hash size={15}/> selecione-um-canal</span><ChevronRight size={15}/></div><label>Mensagem de entrada</label><div className="fake-textarea">Olá, {`{usuário}`}! Seja bem-vindo(a) ao servidor {`{servidor}`}.</div><div className="settings-row"><span><strong>Enviar mensagem ao entrar</strong><small>Ativar o aviso de novos membros</small></span><span className="fake-toggle"/></div></div>}
              {activeSetting === 'logs' && <div className="settings-form-preview"><label>Canal de registros</label><div className="fake-select"><span><Hash size={15}/> selecione-um-canal-de-logs</span><ChevronRight size={15}/></div><div className="settings-row"><span><strong>Registrar ações de moderação</strong><small>Banimentos, expulsões e timeouts</small></span><span className="fake-toggle"/></div><div className="settings-row"><span><strong>Registrar entrada e saída</strong><small>Eventos de membros</small></span><span className="fake-toggle"/></div></div>}
              {activeSetting === 'moderation' && <div className="settings-form-preview"><div className="settings-row"><span><strong>Filtro anti-spam</strong><small>Detectar mensagens repetidas</small></span><span className="fake-toggle"/></div><div className="settings-row"><span><strong>Links suspeitos</strong><small>Preparar regras de bloqueio</small></span><span className="fake-toggle"/></div><div className="settings-row"><span><strong>Menções em excesso</strong><small>Limitar mensagens com muitas menções</small></span><span className="fake-toggle"/></div></div>}
              {activeSetting === 'tickets' && <div className="settings-form-preview"><label>Canal do painel de tickets</label><div className="fake-select"><span><Hash size={15}/> selecione-um-canal</span><ChevronRight size={15}/></div><label>Cargo da equipe de atendimento</label><div className="fake-select"><span><UsersRound size={15}/> selecione-um-cargo</span><ChevronRight size={15}/></div><div className="settings-row"><span><strong>Mensagem de abertura</strong><small>Personalize o texto do painel</small></span><span className="fake-toggle"/></div></div>}
              {activeSetting === 'autorole' && <div className="settings-form-preview"><label>Cargo automático</label><div className="fake-select"><span><UsersRound size={15}/> selecione-um-cargo</span><ChevronRight size={15}/></div><div className="settings-row"><span><strong>Aplicar a novos membros</strong><small>Entregar o cargo assim que entrarem</small></span><span className="fake-toggle"/></div></div>}
              {activeSetting === 'antiraid' && <div className="settings-form-preview">{[['Proteção contra entradas em massa','Detectar muitas entradas em pouco tempo'],['Anti-spam','Sinalizar mensagens repetidas'],['Proteção contra menções','Detectar excesso de menções']].map(([title,desc])=><div className="settings-row" key={title}><span><strong>{title}</strong><small>{desc}</small></span><span className="fake-toggle"/></div>)}</div>}
              {activeSetting === 'suggestions' && <div className="settings-form-preview"><label>Canal de sugestões</label><div className="fake-select"><span><Hash size={15}/> sugestoes</span><ChevronRight size={15}/></div><label>Texto do painel</label><div className="fake-textarea">Tem uma ideia para melhorar o servidor? Envie sua sugestão aqui!</div><div className="settings-row"><span><strong>Permitir votação</strong><small>Reações para apoiar ou reprovar ideias</small></span><span className="fake-toggle"/></div></div>}
              {activeSetting === 'instagram' && <div className="settings-form-preview"><label>Nome de usuário do Instagram</label><div className="fake-input">@seu_perfil</div><label>Canal para avisos</label><div className="fake-select"><span><Hash size={15}/> novidades</span><ChevronRight size={15}/></div><div className="settings-row"><span><strong>Avisar sobre novas publicações</strong><small>Enviar anúncio no canal escolhido</small></span><span className="fake-toggle"/></div></div>}
              <div className="settings-footer-note"><LockKeyhole size={14}/> As opções ainda não salvam alterações nesta versão.</div>
            </div>
          </div>
          </div>
        </section> : <><div className="guild-toolbar"><span><Server size={17}/> Servidores que você pode gerenciar <b>{guilds.length}</b></span><button className="btn btn-outline btn-refresh" onClick={() => { setSessionToken(n => n + 1); }}><RefreshCw size={14}/> Atualizar</button></div>
        {dashboardError && <div className="dashboard-alert"><ShieldCheck size={17}/>{dashboardError}</div>}
        {dashboardLoading ? <div className="guild-empty"><RefreshCw className="spin"/> Carregando seus servidores...</div> : guilds.length ? <div className="guild-grid">{guilds.map(guild => <article className="guild-card" key={guild.id} style={{"--guild-index": guilds.indexOf(guild)}}>
          <div className="guild-card-top">{guildIcon(guild) ? <img className="guild-icon" src={guild.icon} alt=""/> : <div className="guild-icon guild-icon-fallback"><Server size={24}/></div>}<div className="guild-title"><h3>{guild.name}</h3><small>{guild.owner ? 'Você é o dono' : 'Você pode gerenciar'}</small></div></div>
          <div className="guild-card-bottom">{guild.botInstalled ? <button className="btn btn-primary guild-action" onClick={() => { setSelectedGuild(guild); setActiveSetting('welcome'); go(`/dashboard/${guild.id}`); }}><Settings2 size={16}/> Configurar servidor</button> : <button className="btn btn-outline guild-action" onClick={() => inviteBotToGuild(guild.id)}><Bot size={16}/> Adicionar ao servidor <ExternalLink size={14}/></button>}</div>
          {guild.botInstalled && <span className="guild-installed"><Check size={13}/> Vyntex conectado</span>}
        </article>)}</div> : <div className="guild-empty"><Server size={28}/><strong>Nenhum servidor encontrado</strong><span>Verifique se sua conta tem permissão de gerenciar algum servidor no Discord.</span></div>}
        <p className="footnote">Só aparecem servidores nos quais sua conta tem permissão de gerenciamento.</p></> }
      </section>}
    </main> :
    isCommands ? <main className="subpage commands-page page-motion">
      <div className="eyebrow"><Command size={14}/> CENTRAL DE COMANDOS</div>
      <h1>Comandos do <span>Vyntex</span></h1>
      <p className="sublead">Tudo para organizar seu servidor e facilitar o trabalho da sua equipe.</p>
      <div className="searchbar"><Command size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar comando ou recurso..."/><kbd>⌕</kbd></div>
      <div className="command-grid">{visibleCommands.map(c=><article className="command-card" key={c.name} style={{"--card-index": visibleCommands.indexOf(c)}}><div><code>{c.name}</code><span className="command-group">{c.group}</span></div><p>{c.desc}</p></article>)}</div>
      <p className="footnote">Lista inicial de exemplo — os comandos finais dependem da implementação do bot.</p>
    </main> :
    isStore ? <main className="subpage store-page page-motion">
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
      <section className="hero home-motion">
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

      <section className="faq section-wrap"><div className="eyebrow"><Sparkles size={14}/> GUIA RÁPIDO</div><h2>Comece com o <span>Vyntex.</span></h2><p className="faq-intro">Tire suas dúvidas e deixe seu servidor pronto para receber a comunidade.</p>{[
        ['O que é o Vyntex?','O Vyntex é um bot para Discord pensado para facilitar a rotina da sua comunidade. A proposta reúne atendimento por tickets, ferramentas de moderação, registros e recursos de organização em um só lugar. Os recursos marcados como em preparação serão liberados conforme cada sistema for implementado.'],
        ['Como adiciono o bot ao meu servidor?','Clique em “Adicionar ao Discord”, escolha a comunidade na tela oficial do Discord e confira as permissões solicitadas. Você precisa ser dono do servidor ou ter permissão para gerenciá-lo. Depois, confirme a autorização e volte ao site da Vyntex.'],
        ['Como abro o painel de controle?','Clique em “Abrir painel” ou em “Dashboard” no menu. Você será encaminhado ao Discord para autorizar o acesso à sua conta. Após a autorização, o painel mostra os servidores que sua conta pode gerenciar.'],
        ['Por que meu servidor não aparece na lista?','Confira se entrou na conta Discord correta e se você é o proprietário do servidor ou tem permissão para gerenciá-lo. Use o botão “Atualizar” no painel. Se o Vyntex ainda não estiver instalado, o cartão oferecerá a opção de adicioná-lo.'],
        ['Como configuro um servidor?','No Dashboard, localize o servidor em que o Vyntex já está instalado e clique em “Configurar servidor”. Você entrará na área específica daquele servidor. Nesta versão, as telas de configuração ainda são uma prévia e não salvam alterações.'],
        ['Preciso autorizar o Discord toda vez?','Enquanto sua sessão de login continuar válida, o site tenta reconhecer sua conexão automaticamente. Se a sessão expirar, você sair da conta ou limpar os dados do navegador, será necessário autorizar novamente pelo Discord.'],
        ['O Vyntex é gratuito?','O plano Free está apresentado como opção inicial. Recursos e condições de planos pagos ainda serão definidos antes de qualquer lançamento do Premium.'],
        ['Onde consigo ajuda se algo não funcionar?','Tente atualizar a página, confira se o Vyntex está instalado e verifique se sua conta tem as permissões necessárias. Se o problema continuar, envie à equipe uma captura de tela do erro sem compartilhar senhas, códigos de autorização ou tokens.']
      ].map(([q,a],i)=><div className={`faq-item ${faqOpen===i?'open':''}`} key={q}><button onClick={()=>setFaqOpen(faqOpen===i?-1:i)}><span>{q}</span><span>{faqOpen===i?'−':'+'}</span></button>{faqOpen===i&&<p>{a}</p>}</div>)}</section>
    </main>}

    <footer className="footer"><button className="brand footer-brand" onClick={()=>go('/')}><img src="/vyntex.png" alt=""/><span>Vyntex</span></button><span>© 2026 Vyntex. Feito para comunidades Discord.</span><div><button onClick={()=>go('/commands')}>Comandos</button><button onClick={()=>go('/store')}>Loja</button><button onClick={openDashboard}>Painel</button></div></footer>
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
