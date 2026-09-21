import { useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Settings as Gear,
  Heart,
  MessageCircle,
  Share2,
  Store,
  Bot,
  LayoutGrid,
  ExternalLink,
  ChevronRight,
  X,
  ChevronUp,
  ChevronDown,
  Shield,
  RotateCcw,
  Sparkles,
  Briefcase,
} from 'lucide-react';
import { useStore, resetDemoData } from '../store/useStore';
import { CIUBI_APPS } from '../data/ciubiApps';
import { TextSizeControl } from '../components/TextSizeControl';

type RowProps = {
  to?: string;
  onClick?: () => void;
  icon: ReactNode;
  label: string;
  sub?: string;
  active?: boolean;
  external?: boolean;
};

function MenuRow({ to, onClick, icon, label, sub, active, external }: RowProps) {
  const className = [
    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors',
    active ? 'bg-peach/70 text-terracotta' : 'text-earth hover:bg-peach/30',
  ].join(' ');

  const body = (
    <>
      <span
        className={[
          'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
          active ? 'bg-terracotta/15 text-terracotta' : 'bg-tan/40 text-earth-muted',
        ].join(' ')}
      >
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className={`block text-sm ${active ? 'font-semibold' : 'font-medium'}`}>
          {label}
        </span>
        {sub && <span className="block text-[11px] text-earth-muted mt-0.5">{sub}</span>}
      </span>
      {external && <ExternalLink size={16} className="text-earth-muted shrink-0" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className}>
        {body}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={`w-full text-left ${className}`}>
      {body}
    </button>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-3 pt-4 pb-1.5 text-[11px] font-semibold tracking-wider uppercase text-earth-muted">
      {children}
    </p>
  );
}

async function shareApp() {
  const url = window.location.origin + window.location.pathname + '#/';
  const data = {
    title: 'Job de o zi',
    text: 'Găsește sau oferă un job pe zi în România',
    url,
  };
  try {
    if (navigator.share) {
      await navigator.share(data);
      return;
    }
  } catch {
    /* cancelled */
  }
  try {
    await navigator.clipboard.writeText(url);
    alert('Link copiat în clipboard');
  } catch {
    prompt('Copiază linkul:', url);
  }
}

export function Settings() {
  const { settings, currentUser } = useStore();
  const navigate = useNavigate();
  const [appsOpen, setAppsOpen] = useState(true);

  const hub =
    settings.hubLinks && settings.hubLinks.length > 0
      ? settings.hubLinks.map((h) => {
          const seed = CIUBI_APPS.find(
            (a) => a.id === h.id || a.title.toLowerCase() === h.title.toLowerCase(),
          );
          return {
            id: h.id,
            title: h.title,
            url: h.url,
            description: h.description || seed?.description || '',
            thumb: h.photo || seed?.thumb || '',
            color: seed?.color || '#c46a3a',
          };
        })
      : CIUBI_APPS;

  return (
    <div className="pb-8 min-h-[calc(100vh-4rem)] bg-cream">
      <header className="flex items-center gap-2 px-3 py-3 border-b border-tan/70 sticky top-0 bg-cream/95 backdrop-blur z-10">
        <div className="w-10 h-10 rounded-xl bg-terracotta flex items-center justify-center text-white shadow-sm">
          <Briefcase size={20} />
        </div>
        <h1 className="flex-1 text-center text-sm font-bold tracking-wide text-earth uppercase">
          Job de o zi
        </h1>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-9 h-9 rounded-full flex items-center justify-center text-terracotta hover:bg-peach/50"
          aria-label="Închide"
        >
          <X size={20} />
        </button>
      </header>

      <SectionLabel>Contul tău</SectionLabel>
      <div className="px-2 space-y-0.5">
        <MenuRow to="/cont" icon={<User size={18} />} label="Cont" />
        <MenuRow
          to={currentUser ? `/profil/${currentUser.id}` : '/auth'}
          icon={<Gear size={18} />}
          label="Setări profil"
          sub={currentUser ? 'Avatar, descriere, anunțuri' : 'Autentifică-te mai întâi'}
        />
        <MenuRow to="/favorite" icon={<Heart size={18} />} label="Favorite" />
        <MenuRow to="/mesaje" icon={<MessageCircle size={18} />} label="Mesaje" />
      </div>

      <div className="mx-4 my-3 border-t border-tan/60" />

      <SectionLabel>Aplicația</SectionLabel>
      <div className="px-2 space-y-0.5">
        <TextSizeControl />
        <MenuRow
          onClick={() => void shareApp()}
          icon={<Share2 size={18} />}
          label="Trimite aplicația"
          sub="Share sau copiază linkul"
        />
        <MenuRow
          to="/prezentare"
          icon={<Store size={18} />}
          label="Pagina aplicației"
          sub="Prezentare proprietar"
        />
        <MenuRow
          to="/ajutor"
          icon={<Bot size={18} />}
          label="Ajutor / Chatbot"
          sub="Ofer, Caut, înregistrare, siguranță"
        />
        <MenuRow
          to="/modele"
          icon={<Sparkles size={18} />}
          label="Modele"
          sub="Ecrane demo — vezi cum arată"
        />
        {currentUser?.isAdmin && (
          <MenuRow to="/admin" icon={<Shield size={18} />} label="Panou Admin" />
        )}
      </div>

      <div className="mx-4 my-3 border-t border-tan/60" />

      <SectionLabel>Alte aplicații de-ale mele</SectionLabel>
      <div className="px-2">
        <button
          type="button"
          onClick={() => setAppsOpen((o) => !o)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-earth hover:bg-peach/30"
        >
          <span className="w-9 h-9 rounded-xl bg-tan/40 flex items-center justify-center text-earth-muted">
            <LayoutGrid size={18} />
          </span>
          <span className="flex-1 text-left text-sm font-medium">Alte aplicații de-ale mele</span>
          {appsOpen ? (
            <ChevronUp size={18} className="text-earth-muted" />
          ) : (
            <ChevronDown size={18} className="text-earth-muted" />
          )}
        </button>

        {appsOpen && (
          <div className="mt-1 mb-2 space-y-2 px-1">
            {hub.map((app) => (
              <a
                key={app.id}
                href={app.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-tan/50 shadow-sm active:bg-peach/20"
              >
                <div
                  className="w-12 h-12 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: app.color }}
                >
                  {app.thumb ? (
                    <img
                      src={app.thumb}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    app.title.charAt(0)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-earth truncate">{app.title}</p>
                  <p className="text-[11px] text-earth-muted truncate">
                    {app.description || app.url}
                  </p>
                </div>
                <ChevronRight size={18} className="text-earth-muted shrink-0" />
              </a>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          if (confirm('Resetezi datele demo locale?')) {
            resetDemoData();
            window.location.reload();
          }
        }}
        className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 text-xs text-earth-muted"
      >
        <RotateCcw size={12} />
        Resetează date demo (localStorage)
      </button>
    </div>
  );
}
