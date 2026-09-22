import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  DEMO_ADMIN_PHONE,
  DEMO_ADMIN_PASSWORD,
  DEMO_ADMIN_PHONE_DISPLAY,
} from '../data/seedUsersData';
import type { Role } from '../types';

export function Auth() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, currentUser } = useStore();
  const [mode, setMode] = useState<'login' | 'register'>(
    params.get('mode') === 'register' ? 'register' : 'login',
  );
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [role, setRole] = useState<Role>(
    (params.get('role') as Role) || 'seeker',
  );
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) navigate('/cont', { replace: true });
  }, [currentUser, navigate]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (mode === 'login') {
      const normalized = phone.replace(/[.\s-]/g, '');
      const err = login(normalized, password);
      if (err) setError(err);
      else navigate('/cont');
    } else {
      if (!name.trim() || !phone.trim() || !password.trim() || !city.trim()) {
        setError('Completează toate câmpurile.');
        return;
      }
      const err = register({
        name,
        phone: phone.replace(/[.\s-]/g, ''),
        password,
        city,
        role,
      });
      if (err) setError(err);
      else navigate('/cont');
    }
  }

  return (
    <div className="px-4 pt-8 pb-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold text-center text-terracotta mb-1">
        Job de o zi
      </h1>
      <p className="text-center text-sm text-gray-500 mb-6">
        {mode === 'login' ? 'Autentificare' : 'Înregistrare cont nou'}
      </p>

      <div className="flex rounded-xl bg-gray-100 p-1 mb-5">
        <button
          type="button"
          className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
            mode === 'login' ? 'bg-white shadow text-terracotta' : 'text-gray-500'
          }`}
          onClick={() => setMode('login')}
        >
          Login
        </button>
        <button
          type="button"
          className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
            mode === 'register' ? 'bg-white shadow text-terracotta' : 'text-gray-500'
          }`}
          onClick={() => setMode('register')}
        >
          Înregistrare
        </button>
      </div>

      <form onSubmit={submit} className="space-y-3">
        {mode === 'register' && (
          <>
            <Field label="Nume" value={name} onChange={setName} placeholder="Nume complet" />
            <Field
              label="Telefon"
              value={phone}
              onChange={setPhone}
              placeholder="07xxxxxxxx"
              type="tel"
            />
            <Field
              label="Parolă"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              type="password"
            />
            <Field label="Oraș" value={city} onChange={setCity} placeholder="ex: Cluj-Napoca" />
            <div>
              <label className="text-xs font-medium text-gray-500">Rol</label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <RoleBtn active={role === 'offerer'} onClick={() => setRole('offerer')}>
                  Ofer de lucru
                </RoleBtn>
                <RoleBtn active={role === 'seeker'} onClick={() => setRole('seeker')}>
                  Caut de lucru
                </RoleBtn>
              </div>
            </div>
          </>
        )}
        {mode === 'login' && (
          <>
            <Field
              label="Telefon"
              value={phone}
              onChange={setPhone}
              placeholder="07xxxxxxxx"
              type="tel"
            />
            <Field
              label="Parolă"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              type="password"
            />
          </>
        )}

        {error && (
          <p className="text-sm text-terracotta-dark bg-peach/40 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          type="submit"
          className="w-full h-12 rounded-xl bg-terracotta text-white font-semibold mt-2 active:bg-terracotta-dark"
        >
          {mode === 'login' ? 'Intră în cont' : 'Continuă'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-gray-400">
        Demo admin: {DEMO_ADMIN_PHONE_DISPLAY} / {DEMO_ADMIN_PASSWORD}
        <br />
        ({DEMO_ADMIN_PHONE})
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full h-11 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30"
      />
    </div>
  );
}

function RoleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 rounded-lg text-sm font-medium border ${
        active
          ? 'bg-terracotta text-white border-terracotta'
          : 'bg-white text-gray-600 border-gray-200'
      }`}
    >
      {children}
    </button>
  );
}
