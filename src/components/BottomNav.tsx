import { NavLink, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Heart, User, Settings } from 'lucide-react';

/** Order: Acasă | Mesaje | Favorite | Cont | Setări — all equal size */
const items: {
  to: string;
  label: string;
  icon: typeof Home;
  end?: boolean;
}[] = [
  { to: '/', label: 'Acasă', icon: Home, end: true },
  { to: '/mesaje', label: 'Mesaje', icon: MessageCircle },
  { to: '/favorite', label: 'Favorite', icon: Heart },
  { to: '/cont', label: 'Cont', icon: User },
  { to: '/setari', label: 'Setări', icon: Settings },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-cream/95 backdrop-blur border-t border-tan safe-bottom max-w-lg mx-auto">
      <div className="flex h-[4.25rem] items-stretch">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to + label}
            to={to}
            end={end}
            className={() => {
              const path = location.pathname;
              const isActive = end
                ? path === to
                : path === to || path.startsWith(to + '/');
              return [
                'flex-1 relative flex flex-col items-center justify-center gap-1 text-[12px] font-medium transition-colors min-h-[44px]',
                isActive ? 'text-terracotta' : 'text-earth-muted',
              ].join(' ');
            }}
          >
            {() => {
              const path = location.pathname;
              const isActive = end
                ? path === to
                : path === to || path.startsWith(to + '/');
              return (
                <>
                  <Icon
                    size={24}
                    className={isActive ? 'text-terracotta' : ''}
                    strokeWidth={isActive ? 2.5 : 2}
                    fill={to === '/favorite' && isActive ? 'currentColor' : 'none'}
                  />
                  <span className={isActive ? 'text-terracotta font-semibold' : ''}>
                    {label}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-ochre" />
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
