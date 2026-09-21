import { NavLink, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Heart, Search, Settings } from 'lucide-react';

/** Order: Search | Favorite | Acasă | Mesaje | Setări */
const items: {
  to: string;
  label: string;
  icon: typeof Home;
  end?: boolean;
  /** Active when pathname starts with this (e.g. all job lists) */
  matchPrefix?: string;
}[] = [
  { to: '/lista/ofer', label: 'Search', icon: Search, matchPrefix: '/lista' },
  { to: '/favorite', label: 'Favorite', icon: Heart },
  { to: '/', label: 'Acasă', icon: Home, end: true },
  { to: '/mesaje', label: 'Mesaje', icon: MessageCircle },
  { to: '/setari', label: 'Setări', icon: Settings },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-cream/95 backdrop-blur border-t border-tan safe-bottom max-w-lg mx-auto">
      <div className="flex h-16">
        {items.map(({ to, label, icon: Icon, end, matchPrefix }) => (
          <NavLink
            key={to + label}
            to={to}
            end={end}
            className={() => {
              const path = location.pathname;
              const isActive = matchPrefix
                ? path.startsWith(matchPrefix) || path === '/oferte'
                : end
                  ? path === to
                  : path === to || path.startsWith(to + '/');
              return [
                'flex-1 relative flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors',
                isActive ? 'text-terracotta' : 'text-earth-muted',
              ].join(' ');
            }}
          >
            {() => {
              const path = location.pathname;
              const isActive = matchPrefix
                ? path.startsWith(matchPrefix) || path === '/oferte'
                : end
                  ? path === to
                  : path === to || path.startsWith(to + '/');
              return (
                <>
                  <Icon
                    size={22}
                    className={isActive ? 'text-terracotta' : ''}
                    strokeWidth={isActive ? 2.5 : 2}
                    fill={isActive && label === 'Favorite' ? 'currentColor' : 'none'}
                  />
                  <span className={isActive ? 'text-terracotta font-semibold' : ''}>
                    {label}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-ochre" />
                  )}
                </>
              );
            }}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
