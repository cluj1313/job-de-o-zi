import { Share2 } from 'lucide-react';
import { useState } from 'react';

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
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
      /* user cancelled */
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      prompt('Copiază linkul:', url);
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center text-terracotta"
      aria-label="Distribuie"
    >
      {copied ? (
        <span className="text-[10px] font-bold text-green-700">OK</span>
      ) : (
        <Share2 size={18} />
      )}
    </button>
  );
}
