import { NavLink, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Heart, User, Settings } from 'lucide-react';

/** Order: Acasă | Mesaje | Favorite (center) | Cont | Setări */
const items: {
  to: string;
  label: string;
  icon: typeof Home;
  end?: boolean;
  center?: boolean;
}[] = [
  { to: '/', label: 'Acasă', icon: Home, end: true },
  { to: '/mesaje', label: 'Mesaje', icon: MessageCircle },
  { to: '/favorite', label: 'Favorite', icon: Heart, center: true },
  { to: '/cont', label: 'Cont', icon: User },
  { to: '/setari', label: 'Setări', icon: Settings },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-cream/95 backdrop-blur border-t border-tan safe-bottom max-w-lg mx-auto">
      <div className="flex h-16 items-end">
        {items.map(({ to, label, icon: Icon, end, center }) => (
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
                'flex-1 relative flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors',
                center ? '-mt-3' : '',
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
                  {center ? (
                    <span
                      className={[
                        'flex items-center justify-center w-12 h-12 rounded-full shadow-md border-2 mb-0.5',
                        isActive
                          ? 'bg-terracotta text-white border-terracotta'
                          : 'bg-white text-terracotta border-terracotta/40',
                      ].join(' ')}
                    >
                      <Icon
                        size={24}
                        strokeWidth={isActive ? 2.5 : 2}
                        fill={isActive ? 'currentColor' : 'none'}
                      />
                    </span>
                  ) : (
                    <Icon
                      size={22}
                      className={isActive ? 'text-terracotta' : ''}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  )}
                  <span className={isActive ? 'text-terracotta font-semibold' : ''}>
                    {label}
                  </span>
                  {isActive && !center && (
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
