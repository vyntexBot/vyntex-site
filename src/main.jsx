
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Menu, X, ChevronRight, ShieldCheck, Ticket, Zap, Users,
  Settings2, Check, ArrowUpRight, Command, LockKeyhole,
  Sparkles, Crown, Activity, Bot, LayoutDashboard, Gamepad2
} from 'lucide-react';
import './style.css';

const BOT_ID = '1443238280060473507';

const botInvite = `https://discord.com/oauth2/authorize?client_id=${BOT_ID}&permissions=8&scope=bot%20applications.commands`;

function App() {
  const [route, setRoute] = useState(window.location.pathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [faqOpen, setFaqOpen] = useState(0);

  function go(path) {
    const [pathname, hash] = path.split('#');
    const destination = pathname || window.location.pathname;

    window.history.pushState({}, '', path);
    setRoute(destination);
    setMobileOpen(false);

    if (hash) {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  window.onpopstate = () => {
    setRoute(window.location.pathname);
  };

  const page = route.replace(/\/+$/, '') || '/';
  const isPanel = page === '/dashboard' || page === '/panel';
  const isCommands = page === '/commands';
  const isStore = page === '/store' || page === '/loja';
  const isTeam = page === '/team' || page === '/cargos';

  const commandGroups = [
    {
      title: 'Tickets',
      commands: [
        ['/ticket', 'Envia o painel para abrir tickets.'],
        ['/fechar', 'Fecha o ticket atual.'],
        ['/adicionar', 'Adiciona uma pessoa ao ticket.'],
        ['/remover', 'Remove uma pessoa do ticket.']
      ]
    },
    {
      title: 'Moderação',
      commands: [
        ['/ban', 'Bane um membro do servidor.'],
        ['/kick', 'Expulsa um membro do servidor.'],
        ['/timeout', 'Aplica um tempo limite.'],
        ['/limpar', 'Limpa mensagens do canal.']
      ]
    },
    {
      title: 'Servidor',
      commands: [
        ['/config', 'Configura os recursos do Vyntex.'],
        ['/logs', 'Define o canal de registros.'],
        ['/boas-vindas', 'Configura as boas-vindas.'],
        ['/ajuda', 'Mostra os comandos disponíveis.']
      ]
    }
  ];

  const allCommands = commandGroups.flatMap(group =>
    group.commands.map(command => ({
      name: command[0],
      desc: command[1],
      group: group.title
    }))
  );

  const visibleCommands = allCommands.filter(command =>
    `${command.name} ${command.desc} ${command.group}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="app-shell">
      <header className="navbar">
        <button className="brand" onClick={() => go('/')} aria-label="Vyntex início">
          <img src="/vyntex.png" alt="Vyntex" />
          <span>Vyntex</span>
        </button>

        <nav className={`navlinks ${mobileOpen ? 'mobile-open' : ''}`}>
          <button onClick={() => go('/#features')}>Recursos</button>
          <button onClick={() => go('/commands')}>Comandos</button>
          <button onClick={() => go('/store')}>Loja</button>
          <button onClick={() => go('/team')}>Cargos</button>

          <div className="mobile-actions">
            <button className="nav-login" onClick={() => go('/dashboard')}>
              Entrar
            </button>
            <a className="btn btn-light" href={botInvite}>
              Adicionar ao Discord <ArrowUpRight size={15} />
            </a>
          </div>
        </nav>

        <div className="navright">
          <button className="nav-login" onClick={() => go('/dashboard')}>
            Entrar
          </button>
          <button className="nav-login" onClick={() => go('/dashboard')}>
            Abrir painel
          </button>
          <a className="btn btn-light nav-invite" href={botInvite}>
            <Bot size={15} /> Adicionar ao Discord
          </a>
        </div>

        <button
          className="menu-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Abrir menu"
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </header>

      {isPanel ? (
        <main className="subpage panel-page">
          <div className="subpage-icon"><LayoutDashboard size={24} /></div>
          <div className="eyebrow">PAINEL VYNTEX</div>
          <h1>Seu servidor.<br /><span>Do seu jeito.</span></h1>
          <p className="sublead">
            Entre com o Discord para configurar tickets, moderação e os recursos do seu servidor em um só lugar.
          </p>
          <a className="btn btn-primary btn-large" href={botInvite}>
            Adicionar o Vyntex <ArrowUpRight size={17} />
          </a>
          <div className="notice">
            <LockKeyhole size={16} />
            O login do painel será ativado quando o OAuth2 estiver configurado.
          </div>
        </main>
      ) : isCommands ? (
        <main className="subpage commands-page">
          <div className="eyebrow"><Command size={14} /> CENTRAL DE COMANDOS</div>
          <h1>Comandos do <span>Vyntex</span></h1>
          <p className="sublead">
            Tudo para organizar seu servidor e facilitar o trabalho da sua equipe.
          </p>

          <div className="searchbar">
            <Command size={18} />
            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Buscar comando ou recurso..."
            />
            <kbd>⌕</kbd>
          </div>

          <div className="command-grid">
            {visibleCommands.map(command => (
              <article className="command-card" key={command.name}>
                <div>
                  <code>{command.name}</code>
                  <span className="command-group">{command.group}</span>
                </div>
                <p>{command.desc}</p>
              </article>
            ))}
          </div>

          <p className="footnote">
            Lista inicial de exemplo — os comandos finais dependem da implementação do bot.
          </p>
        </main>
      ) : isStore ? (
        <main className="subpage store-page">
          <div className="eyebrow"><Sparkles size={14} /> PLANOS VYNTEX</div>
          <h1>Escolha seu <span>plano.</span></h1>
          <p className="sublead">
            Comece gratuitamente e evolua quando seu servidor precisar de mais.
          </p>

          <div className="pricing-grid">
            <article className="price-card">
              <div className="plan-name">FREE</div>
              <h2>R$ 0<span>/sempre</span></h2>
              <p>O essencial para começar.</p>
              <ul>
                <li><Check /> Sistema de tickets</li>
                <li><Check /> Moderação básica</li>
                <li><Check /> Logs e boas-vindas</li>
                <li><Check /> Comandos essenciais</li>
              </ul>
              <a href={botInvite} className="btn btn-outline">
                Adicionar ao Discord
              </a>
            </article>

            <article className="price-card featured">
              <div className="popular">EM BREVE</div>
              <div className="plan-name"><Crown size={15} /> PREMIUM</div>
              <h2>Em breve</h2>
              <p>Mais ferramentas para sua comunidade.</p>
              <ul>
                <li><Check /> Tudo do plano Free</li>
                <li><Check /> Formulários personalizados</li>
                <li><Check /> Recursos avançados</li>
                <li><Check /> Configurações extras</li>
              </ul>
              <button
                className="btn btn-primary"
                onClick={() => alert('Os planos Premium ainda estão sendo preparados.')}
              >
                Tenho interesse <ArrowUpRight />
              </button>
            </article>
          </div>

          <p className="footnote">
            Os preços e recursos premium serão definidos antes do lançamento.
          </p>
        </main>
      ) : isTeam ? (
        <main className="subpage team-page">
          <div className="eyebrow"><Users size={14} /> NOSSA EQUIPE</div>
          <h1>Quem faz o <span>Vyntex.</span></h1>
          <p className="sublead">
            Um projeto feito para deixar a gestão de comunidades mais simples.
          </p>

          <div className="team-card">
            <img src="/vyntex.png" alt="Vyntex" />
            <div>
              <h3>Equipe Vyntex</h3>
              <p>Desenvolvimento e suporte</p>
            </div>
            <span className="status-dot">Projeto</span>
          </div>

          <p className="footnote">
            Os perfis da equipe poderão ser adicionados aqui depois.
          </p>
        </main>
      ) : (
        <main>
          <section className="hero">
            <div className="hero-glow"></div>
            <div className="hero-grid"></div>

            <div className="hero-copy">
              <div className="status-pill">
                <span className="pulse"></span>
                SEU SERVIDOR, EM OUTRO NÍVEL
              </div>

              <h1>Seu Discord.<br />Suas regras.<br /><span>Vyntex.</span></h1>

              <p>
                Tickets, moderação e automação em um só bot. Menos trabalho manual para sua equipe e mais tempo para sua comunidade.
              </p>

              <div className="hero-actions">
                <a className="btn btn-primary btn-large" href={botInvite}>
                  <Bot size={18} /> Adicionar ao Discord <ArrowUpRight size={17} />
                </a>
                <button
                  className="btn btn-secondary btn-large"
                  onClick={() => go('/dashboard')}
                >
                  <LayoutDashboard size={18} /> Abrir o painel
                </button>
              </div>

              <div className="hero-proof">
                <div className="proof-avatars">
                  <span>V</span><span>✓</span><span>+</span>
                </div>
                <span>
                  <b>Feito para comunidades</b>
                  <small>Prático, organizado e personalizável</small>
                </span>
              </div>
            </div>

            <div className="hero-art">
              <div className="orbit orbit-one"></div>
              <div className="orbit orbit-two"></div>
              <div className="logo-aura"></div>
              <img className="hero-logo" src="/vyntex.png" alt="Logo Vyntex" />

              <div className="float-card card-ticket">
                <span className="float-icon"><Ticket size={18} /></span>
                <span>
                  <b>Tickets organizados</b>
                  <small>Atendimento simplificado</small>
                </span>
                <span className="tiny-check"><Check size={13} /></span>
              </div>

              <div className="float-card card-mod">
                <span className="float-icon"><ShieldCheck size={18} /></span>
                <span>
                  <b>Moderação</b>
                  <small>Seu servidor protegido</small>
                </span>
              </div>

              <div className="float-card card-antiraid">
                <span className="float-icon"><ShieldCheck size={18} /></span>
                <span>
                  <b>Anti-Raid</b>
                  <small>Proteção para sua comunidade</small>
                </span>
              </div>

              <div className="float-card card-roblox">
                <span className="float-icon"><Gamepad2 size={18} /></span>
                <span>
                  <b>Comunidade Roblox</b>
                  <small>Conecte seus jogadores</small>
                </span>
              </div>

              <div className="mini-chip">
                <span className="pulse"></span> SISTEMA ONLINE
              </div>
            </div>

            <div className="hero-bottom">
              <span>UM BOT. VÁRIAS POSSIBILIDADES.</span>
              <span>01 — 04</span>
            </div>
          </section>

          <section className="features section-wrap" id="features">
            <div className="section-heading">
              <div>
                <div className="eyebrow">RECURSOS PRINCIPAIS</div>
                <h2>Seu servidor funcionando<br /><span>sem complicação.</span></h2>
              </div>
              <p>
                Ferramentas para cuidar da comunidade, atender membros e manter tudo organizado.
              </p>
            </div>

            <div className="feature-grid">
              <article className="feature-card feature-large">
                <div className="feature-icon"><Ticket /></div>
                <div className="feature-number">01 / ATENDIMENTO</div>
                <h3>Tickets sem bagunça.</h3>
                <p>
                  Organize solicitações, suporte e atendimento em canais privados para sua equipe.
                </p>
                <div className="ticket-preview">
                  <div className="preview-top">
                    <span className="preview-dot"></span>
                    Central de atendimento
                    <span className="preview-badge">ABERTO</span>
                  </div>
                  <div className="preview-line"></div>
                  <div className="preview-line short"></div>
                  <div className="preview-btn">
                    Abrir ticket <ChevronRight size={13} />
                  </div>
                </div>
              </article>

              <article className="feature-card">
                <div className="feature-icon"><ShieldCheck /></div>
                <div className="feature-number">02 / SEGURANÇA</div>
                <h3>Moderação prática.</h3>
                <p>
                  Comandos para ajudar sua equipe a manter a ordem no servidor.
                </p>
                <div className="feature-decoration shield"><ShieldCheck size={92} /></div>
              </article>

              <article className="feature-card">
                <div className="feature-icon"><Activity /></div>
                <div className="feature-number">03 / CONTROLE</div>
                <h3>Logs e registros.</h3>
                <p>
                  Acompanhe ações importantes e mantenha tudo mais transparente.
                </p>
                <div className="log-lines"><i></i><i></i><i></i></div>
              </article>

              <article className="feature-card">
                <div className="feature-icon"><Zap /></div>
                <div className="feature-number">04 / AUTOMAÇÃO</div>
                <h3>Menos tarefas manuais.</h3>
                <p>
                  Configure ferramentas úteis para o dia a dia da sua comunidade.
                </p>
              </article>
            </div>
          </section>

          <section className="cta-band">
            <div className="cta-symbol"><img src="/vyntex.png" alt="" /></div>
            <div>
              <div className="eyebrow">PRONTO PARA COMEÇAR?</div>
              <h2>Leve o Vyntex para seu servidor.</h2>
              <p>Adicione o bot e prepare sua comunidade para o próximo nível.</p>
            </div>
            <a className="btn btn-light" href={botInvite}>
              Adicionar ao Discord <ArrowUpRight size={16} />
            </a>
          </section>

          <section className="faq section-wrap">
            <div className="eyebrow">DÚVIDAS FREQUENTES</div>
            <h2>Quer saber mais?</h2>
            {[
              ['O que é o Vyntex?', 'Um bot para ajudar com tickets, moderação e organização de servidores Discord.'],
              ['Como adiciono o bot?', 'Use o botão “Adicionar ao Discord”. O link usa o ID configurado para o Vyntex.'],
              ['Como abro o painel?', 'O painel e o login real serão ligados ao OAuth2 numa próxima etapa.']
            ].map(([question, answer], index) => (
              <div
                className={`faq-item ${faqOpen === index ? 'open' : ''}`}
                key={question}
              >
                <button onClick={() => setFaqOpen(faqOpen === index ? -1 : index)}>
                  <span>{question}</span>
                  <span>{faqOpen === index ? '−' : '+'}</span>
                </button>
                {faqOpen === index && <p>{answer}</p>}
              </div>
            ))}
          </section>
        </main>
      )}

      <footer className="footer">
        <button className="brand footer-brand" onClick={() => go('/')}>
          <img src="/vyntex.png" alt="" />
          <span>Vyntex</span>
        </button>
        <span>© 2026 Vyntex. Feito para comunidades Discord.</span>
        <div>
          <button onClick={() => go('/commands')}>Comandos</button>
          <button onClick={() => go('/store')}>Loja</button>
          <button onClick={() => go('/dashboard')}>Painel</button>
        </div>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
