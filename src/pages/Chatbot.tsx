import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bot, Send, User } from 'lucide-react';

type Msg = { id: number; from: 'bot' | 'user'; text: string };

const QUICK = [
  'Cum ofer de lucru?',
  'Cum caut de lucru?',
  'Cum mă înregistrez?',
  'Cum funcționează ratingul?',
  'Sfaturi de siguranță',
];

const FAQ: { keys: string[]; reply: string }[] = [
  {
    keys: ['ofer', 'public', 'angajez', 'angajator', 'ofert'],
    reply:
      'Ca să oferi de lucru:\n1. Apasă „Ofer de lucru” pe Acasă\n2. Autentifică-te (sau creează cont ca Ofertant)\n3. Din Cont → „Creează ofertă”\n4. Completează titlu, lei/oră, oraș, fotografie\n\nAnunțul apare imediat în listă. Candidații te contactează prin Call, WhatsApp sau Mesaj.',
  },
  {
    keys: ['caut', 'aplic', 'zilier', 'muncă', 'lucru', 'găsesc'],
    reply:
      'Ca să cauți de lucru:\n1. Apasă „Caut de lucru” pe Acasă\n2. Filtrează după oraș, lei/oră sau rating\n3. Deschide un anunț / profil\n4. Contactează prin Call, WhatsApp sau Mesaj\n\nPoți și tu publica un anunț „Caut” din Cont, ca să te găsească angajatorii.',
  },
  {
    keys: ['înregistr', 'inregistr', 'cont', 'login', 'parolă', 'parola', 'telefon', 'auth'],
    reply:
      'Înregistrare rapidă:\n1. Cont → Login / Înregistrare\n2. Nume, telefon, parolă, oraș\n3. Alege rol: Ofertant sau Cautători\n\nDemo: 0722111001 / demo123\nAdmin: 0700000000 / admin123\n\nDatele rămân pe dispozitiv (localStorage) — MVP fără server.',
  },
  {
    keys: ['rating', 'stele', 'recenz', 'evalu'],
    reply:
      'Ratingul pornește de la 0.\nDupă o colaborare, poți lăsa stele (1–5) + text pe profilul celuilalt.\nOfertanții pot răspunde la recenzii.\nMedia se actualizează automat. Filtrele din listă pot cere rating minim (ex. 4+).',
  },
  {
    keys: ['sigur', 'safe', 'fraud', 'atenț', 'atent', 'risc', 'protej'],
    reply:
      'Sfaturi de siguranță:\n• Verifică ratingul și recenziile înainte\n• Preferă întâlniri în locuri publice / șantiere cunoscute\n• Nu plăti avansuri mari necunoscuților\n• Păstrează dovezi (mesaje, WhatsApp)\n• Semnalează abuzuri adminului (0700000000)\n\nPlatforma e MVP — folosește judecata ta.',
  },
  {
    keys: ['favorit', 'inim'],
    reply:
      'Apasă inima de pe un card ca să salvezi anunțul. Le găsești în tab-ul Favorite (centru, jos).',
  },
  {
    keys: ['mesaj', 'whatsapp', 'call', 'telefon', 'contact'],
    reply:
      'Pe profil: Call (apel), WhatsApp (chat extern) și Mesaj (inbox în app).\nMesajele din app apar la tab-ul Mesaje. Adminul poate trimite anunțuri tuturor (broadcast).',
  },
  {
    keys: ['salut', 'bună', 'buna', 'hello', 'hi', 'help', 'ajutor'],
    reply:
      'Salut! Sunt asistentul Job de o zi.\nÎntreabă-mă despre: Ofer / Caut, înregistrare, rating sau siguranță.\nSau apasă un buton rapid de mai jos.',
  },
];

function matchReply(text: string): string {
  const t = text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
  for (const row of FAQ) {
    if (row.keys.some((k) => t.includes(k.normalize('NFD').replace(/\p{M}/gu, '')))) {
      return row.reply;
    }
  }
  return 'Nu am un răspuns exact pentru asta. Încearcă: „Cum ofer de lucru?”, „Cum mă înregistrez?”, „Sfaturi de siguranță” sau „Cum funcționează ratingul?”.';
}

export function Chatbot() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: 0,
      from: 'bot',
      text: 'Bună! Sunt ajutorul Job de o zi. Cu ce te pot ajuta?',
    },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(1);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Msg = { id: idRef.current++, from: 'user', text: trimmed };
    const botMsg: Msg = { id: idRef.current++, from: 'bot', text: matchReply(trimmed) };
    setMsgs((m) => [...m, userMsg, botMsg]);
    setInput('');
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)]">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-tan/80 bg-cream sticky top-0 z-10">
        <Link
          to="/setari"
          className="w-9 h-9 rounded-full bg-peach/50 flex items-center justify-center text-terracotta"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="w-9 h-9 rounded-full bg-terracotta/15 flex items-center justify-center text-terracotta">
          <Bot size={18} />
        </div>
        <div>
          <h1 className="text-sm font-bold text-earth">Ajutor · Chatbot</h1>
          <p className="text-[10px] text-earth-muted">Răspunsuri rapide · fără AI plătit</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {msgs.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2 ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.from === 'bot' && (
              <div className="w-7 h-7 rounded-full bg-terracotta/15 flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={14} className="text-terracotta" />
              </div>
            )}
            <div
              className={[
                'max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap leading-relaxed shadow-sm',
                m.from === 'user'
                  ? 'bg-terracotta text-white rounded-br-md'
                  : 'bg-white border border-tan/60 text-earth rounded-bl-md',
              ].join(' ')}
            >
              {m.text}
            </div>
            {m.from === 'user' && (
              <div className="w-7 h-7 rounded-full bg-earth/10 flex items-center justify-center shrink-0 mt-0.5">
                <User size={14} className="text-earth-muted" />
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="px-3 pb-2 flex gap-2 overflow-x-auto">
        {QUICK.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => send(q)}
            className="shrink-0 px-3 py-1.5 rounded-full bg-peach/60 text-earth text-xs font-medium border border-tan/50 active:bg-peach"
          >
            {q}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 px-3 py-3 border-t border-tan/80 bg-cream"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrie o întrebare..."
          className="flex-1 h-11 rounded-xl border border-tan bg-white px-3 text-sm outline-none focus:border-terracotta"
        />
        <button
          type="submit"
          className="w-11 h-11 rounded-xl bg-terracotta text-white flex items-center justify-center shadow-sm active:bg-terracotta-dark"
          aria-label="Trimite"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
