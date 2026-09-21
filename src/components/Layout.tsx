import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <div className="min-h-full max-w-lg mx-auto bg-cream relative pb-20">
      <Outlet />
      <BottomNav />
    </div>
  );
}
