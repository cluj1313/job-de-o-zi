import { useEffect, useState } from 'react';

const TZ = 'Europe/Bucharest';

function formatNow(d: Date) {
  const time = new Intl.DateTimeFormat('ro-RO', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(d);
  const date = new Intl.DateTimeFormat('ro-RO', {
    timeZone: TZ,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(d);
  return { time, date };
}

/** Live digital clock for home cover — phone-readable, high contrast. */
export function CoverClock() {
  const [now, setNow] = useState(() => formatNow(new Date()));

  useEffect(() => {
    const tick = () => setNow(formatNow(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="absolute bottom-3 left-3 z-10 max-w-[min(72%,280px)] pointer-events-none select-none"
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`Ora: ${now.time}`}
    >
      <div className="rounded-2xl bg-cream/92 backdrop-blur-sm border border-gold/40 shadow-lg px-3.5 py-2.5 ring-1 ring-earth/10">
        <p
          className="font-mono font-bold tabular-nums tracking-wider text-earth leading-none"
          style={{
            fontSize: 'clamp(1.75rem, 8.5vw, 2.75rem)',
            textShadow: '0 1px 0 rgba(250,246,240,0.9)',
          }}
        >
          {now.time}
        </p>
        <p className="mt-1 text-xs sm:text-sm font-semibold capitalize text-earth-muted leading-tight">
          {now.date}
        </p>
      </div>
    </div>
  );
}
