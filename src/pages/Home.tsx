import { useNavigate } from 'react-router-dom';
import { Briefcase, Search } from 'lucide-react';
import { ShareButton } from '../components/ShareButton';
import { coverJobs } from '../utils/assets';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="relative h-[48vh] min-h-[260px] max-h-[420px]">
        <img
          src={coverJobs}
          alt="Job de o zi"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <ShareButton />
        <div className="absolute bottom-6 left-0 right-0 px-5 text-white">
          <h1 className="text-3xl font-bold tracking-tight drop-shadow">Job de o zi</h1>
          <p className="mt-1 text-sm text-white/90">
            Piața de muncă pe zi din România
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 pt-5 pb-4 space-y-3">
        <button
          type="button"
          onClick={() => navigate('/lista/ofer')}
          className="w-full h-14 rounded-2xl bg-maroon text-white font-semibold text-lg flex items-center justify-center gap-3 shadow-md active:bg-maroon-dark"
        >
          <Briefcase size={22} />
          Ofer de lucru
        </button>
        <button
          type="button"
          onClick={() => navigate('/lista/caut')}
          className="w-full h-14 rounded-2xl bg-white text-maroon border-2 border-maroon font-semibold text-lg flex items-center justify-center gap-3 shadow-sm active:bg-maroon/5"
        >
          <Search size={22} />
          Caut de lucru
        </button>
        <p className="text-center text-xs text-gray-500 pt-2">
          Anunțuri pe zi · Contact rapid · Fără comision în MVP
        </p>
      </div>
    </div>
  );
}
