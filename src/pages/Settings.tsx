import { Link } from 'react-router-dom';
import { ExternalLink, FileText, RotateCcw } from 'lucide-react';
import { useStore, resetDemoData } from '../store/useStore';

export function Settings() {
  const { settings, currentUser } = useStore();

  return (
    <div className="px-4 pt-6 pb-6">
      <h1 className="text-xl font-bold mb-4">Setări</h1>

      <div className="space-y-3">
        <Link
          to="/prezentare"
          className="block p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-sm">Prezentare proprietar</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Despre Job de o zi — editabilă de admin
              </p>
            </div>
          </div>
        </Link>

        {settings.hubLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="block p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta">
                <ExternalLink size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-sm">{link.title}</h2>
                {link.description && (
                  <p className="text-xs text-gray-500 mt-0.5">{link.description}</p>
                )}
                <p className="text-[10px] text-terracotta mt-1 truncate">{link.url}</p>
              </div>
            </div>
          </a>
        ))}

        {currentUser?.isAdmin && (
          <Link
            to="/admin"
            className="block p-4 bg-earth text-white rounded-2xl shadow-sm text-sm font-semibold text-center"
          >
            Deschide panoul Admin
          </Link>
        )}

        <button
          type="button"
          onClick={() => {
            if (confirm('Resetezi datele demo locale?')) {
              resetDemoData();
              window.location.reload();
            }
          }}
          className="w-full flex items-center justify-center gap-2 p-3 text-sm text-gray-500"
        >
          <RotateCcw size={14} />
          Resetează date demo (localStorage)
        </button>
      </div>
    </div>
  );
}
