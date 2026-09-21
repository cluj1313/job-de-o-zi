import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { useStore } from '../store/useStore';
import type { TextSize } from '../types';

const SIZE_CLASS: Record<TextSize, string> = {
  sm: 'text-size-sm',
  md: 'text-size-md',
  lg: 'text-size-lg',
};

function applyTextSize(size: TextSize) {
  const root = document.documentElement;
  root.classList.remove('text-size-sm', 'text-size-md', 'text-size-lg');
  root.classList.add(SIZE_CLASS[size] ?? 'text-size-md');
  const scale = size === 'sm' ? '0.9' : size === 'lg' ? '1.15' : '1';
  root.style.setProperty('--text-scale', scale);
}

export function Layout() {
  const { settings } = useStore();
  const textSize: TextSize =
    settings.textSize === 'sm' || settings.textSize === 'lg' ? settings.textSize : 'md';

  useEffect(() => {
    applyTextSize(textSize);
  }, [textSize]);

  return (
    <div className="min-h-full max-w-lg mx-auto bg-cream relative pb-20">
      <Outlet />
      <BottomNav />
    </div>
  );
}
