import { useNavigate } from 'react-router-dom';
import { Briefcase, Search, Bot } from 'lucide-react';
import { ShareButton } from '../components/ShareButton';
import { coverJobs } from '../utils/assets';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-cream relative">
      <div className="relative w-full aspect-[16/9] min-h-[220px] max-h-[420px] bg-tan">
        <img
          src={coverJobs}
          alt="Job de o zi"
          className="w-full h-full object-cover object-center"
        />
        <ShareButton />
      </div>

      <div className="flex-1 px-4 pt-4 pb-4 space-y-2.5">
        <h1 className="text-2xl font-bold tracking-tight text-earth text-center">
          Job de o zi
        </h1>
        <p className="text-center text-sm text-earth-muted -mt-1 mb-1">
          Piața de muncă pe zi din România
        </p>
        <button
          type="button"
          onClick={() => navigate('/lista/ofer')}
          className="w-full h-11 rounded-2xl bg-terracotta text-white font-semibold text-base flex items-center justify-center gap-3 shadow-md active:bg-terracotta-dark"
        >
          <Briefcase size={20} />
          Ofer de lucru
        </button>
        <button
          type="button"
          onClick={() => navigate('/lista/caut')}
          className="w-full h-11 rounded-2xl bg-cream text-terracotta border-2 border-terracotta font-semibold text-base flex items-center justify-center gap-3 shadow-sm active:bg-peach/40"
        >
          <Search size={20} />
          Caut de lucru
        </button>
        <p className="text-center text-xs text-earth-muted pt-2">
          Anunțuri pe zi · Contact rapid · Fără comision în MVP
        </p>
      </div>

      {/* Floating chatbot entry */}
      <button
        type="button"
        onClick={() => navigate('/ajutor')}
        className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full bg-terracotta text-white shadow-lg flex items-center justify-center active:bg-terracotta-dark border-4 border-cream"
        aria-label="Ajutor chatbot"
        title="Ajutor"
      >
        <Bot size={24} />
      </button>
    </div>
  );
}
