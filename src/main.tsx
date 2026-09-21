import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Apply persisted text size before first paint (Settings store key)
try {
  const raw = localStorage.getItem('jdoz_settings')
  if (raw) {
    const s = JSON.parse(raw) as { textSize?: string }
    const size = s.textSize === 'sm' || s.textSize === 'lg' ? s.textSize : 'md'
    const root = document.documentElement
    root.classList.add(`text-size-${size}`)
    root.style.setProperty(
      '--text-scale',
      size === 'sm' ? '0.9' : size === 'lg' ? '1.15' : '1',
    )
  }
} catch {
  /* ignore */
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
