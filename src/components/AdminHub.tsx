import { useState } from 'react';
import { Link2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { HubLink } from '../types';

export function AdminHub({ onToast }: { onToast: (m: string) => void }) {
  const { settings, updateSettings } = useStore();
  const [links, setLinks] = useState<HubLink[]>(settings.hubLinks);
  function saveLinks() {
    updateSettings({ hubLinks: links });
    onToast('Link-uri hub salvate');
  }
  return (
    <section>
      <h2 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
        <Link2 size={14} /> Link-uri hub (Setări)
      </h2>
      <div className="space-y-3">
        {links.map((link, i) => (
          <div key={link.id} className="p-3 bg-white rounded-xl border border-gray-100 space-y-2">
            <input value={link.title} onChange={(e) => { const n=[...links]; n[i]={...link,title:e.target.value}; setLinks(n); }}
              className="w-full h-9 rounded-lg border border-gray-200 px-2 text-sm" placeholder="Titlu" />
            <input value={link.url} onChange={(e) => { const n=[...links]; n[i]={...link,url:e.target.value}; setLinks(n); }}
              className="w-full h-9 rounded-lg border border-gray-200 px-2 text-sm" placeholder="URL" />
            <input value={link.description||''} onChange={(e) => { const n=[...links]; n[i]={...link,description:e.target.value}; setLinks(n); }}
              className="w-full h-9 rounded-lg border border-gray-200 px-2 text-sm" placeholder="Descriere" />
            <input value={link.photo||''} onChange={(e) => { const n=[...links]; n[i]={...link,photo:e.target.value}; setLinks(n); }}
              className="w-full h-9 rounded-lg border border-gray-200 px-2 text-sm" placeholder="Photo / thumb URL" />
          </div>
        ))}
        <button type="button" onClick={() => setLinks([...links,{id:'h'+Date.now(),title:'Link nou',url:'https://',description:''}])}
          className="text-sm text-terracotta font-medium">+ Adaugă link</button>
        <button type="button" onClick={saveLinks}
          className="block w-full h-10 rounded-xl bg-terracotta text-white text-sm font-semibold">Salvează link-uri</button>
      </div>
    </section>
  );
}
