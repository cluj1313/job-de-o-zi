import { Link, useNavigate } from 'react-router-dom';
import { LogOut, PlusCircle, User as UserIcon, Shield } from 'lucide-react';
import { useStore } from '../store/useStore';
import { StarRating } from '../components/StarRating';

export function Account() {
  const { currentUser, logout, jobs } = useStore();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="px-4 pt-16 pb-8 text-center">
        <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center mx-auto mb-4">
          <UserIcon className="text-terracotta" size={28} />
        </div>
        <h1 className="text-xl font-bold mb-2">Contul tău</h1>
        <p className="text-sm text-gray-500 mb-6">
          Autentifică-te pentru a publica anunțuri și a trimite mesaje.
        </p>
        <Link
          to="/auth"
          className="inline-flex h-12 px-8 rounded-xl bg-terracotta text-white font-semibold items-center"
        >
          Login / Înregistrare
        </Link>
      </div>
    );
  }

  const myJobs = jobs.filter((j) => j.userId === currentUser.id);

  return (
    <div className="px-4 pt-6 pb-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-16 h-16 rounded-full bg-terracotta/10 overflow-hidden border-2 border-terracotta/20">
          {currentUser.avatar ? (
            <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl font-bold text-terracotta">
              {currentUser.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold truncate">{currentUser.name}</h1>
          <p className="text-sm text-gray-500">
            {currentUser.phone} · {currentUser.city}
          </p>
          <StarRating value={currentUser.rating} count={currentUser.ratingCount} size={12} />
        </div>
      </div>

      <div className="space-y-2">
        <Link
          to={`/profil/${currentUser.id}`}
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
        >
          <UserIcon size={20} className="text-terracotta" />
          <span className="font-medium text-sm">Vezi / editează profilul</span>
        </Link>

        {currentUser.role === 'offerer' && (
          <Link
            to="/creeaza"
            className="flex items-center gap-3 p-4 bg-terracotta text-white rounded-xl shadow-sm"
          >
            <PlusCircle size={20} />
            <span className="font-medium text-sm">Creează ofertă de lucru</span>
          </Link>
        )}

        {currentUser.isAdmin && (
          <Link
            to="/admin"
            className="flex items-center gap-3 p-4 bg-earth text-white rounded-xl shadow-sm"
          >
            <Shield size={20} />
            <span className="font-medium text-sm">Panou Admin</span>
          </Link>
        )}

        <button
          type="button"
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="w-full flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 text-terracotta-dark"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Deconectare</span>
        </button>
      </div>

      {myJobs.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            Anunțurile mele ({myJobs.length})
          </h2>
          <ul className="space-y-2">
            {myJobs.map((j) => (
              <li
                key={j.id}
                className="p-3 bg-white rounded-xl border border-gray-100 text-sm"
              >
                <p className="font-medium">{j.title}</p>
                <p className="text-gray-500">
                  {j.rate} lei/oră · {j.city}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
