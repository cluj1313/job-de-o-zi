import { NavLink } from 'react-router-dom';
import { Home, MessageCircle, Heart, User, Settings } from 'lucide-react';

const items = [
  { to: '/', label: 'Acasă', icon: Home, end: true },
  { to: '/mesaje', label: 'Mesaje', icon: MessageCircle },
  { to: '/favorite', label: 'Favorite', icon: Heart, center: true },
  { to: '/cont', label: 'Cont', icon: User },
  { to: '/setari', label: 'Setări', icon: Settings },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-cream/95 backdrop-blur border-t border-tan safe-bottom max-w-lg mx-auto">
      <div className="flex h-16">
        {items.map(({ to, label, icon: Icon, end, center }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                'flex-1 relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors',
                center ? '-mt-3' : '',
                isActive
                  ? center
                    ? ''
                    : 'text-terracotta'
                  : 'text-earth-muted',
              ].join(' ')
            }
          >
            {({ isActive }) =>
              center ? (
                <div
                  className={[
                    'w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-cream',
                    isActive ? 'bg-terracotta text-white' : 'bg-tan text-earth-muted',
                  ].join(' ')}
                >
                  <Icon size={22} className={isActive ? 'fill-white' : ''} />
                  <span className="text-[9px] mt-0.5 font-semibold">{label}</span>
                </div>
              ) : (
                <>
                  <Icon
                    size={20}
                    className={isActive ? 'text-terracotta' : ''}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className={isActive ? 'text-terracotta font-semibold' : ''}>
                    {label}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-ochre" />
                  )}
                </>
              )
            }
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
