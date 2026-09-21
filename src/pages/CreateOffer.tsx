import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';
import { coverJobs } from '../utils/assets';

export function CreateOffer() {
  const { currentUser, addJob } = useStore();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rate, setRate] = useState('');
  const [city, setCity] = useState(currentUser?.city || '');
  const [photo, setPhoto] = useState(coverJobs);
  const [error, setError] = useState('');

  if (!currentUser) {
    return (
      <div className="p-6 text-center">
        <p className="mb-3">Trebuie să fii autentificat.</p>
        <Link to="/auth" className="text-terracotta font-medium">
          Login
        </Link>
      </div>
    );
  }

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !rate || !city.trim()) {
      setError('Completează titlu, tarif și oraș');
      return;
    }
    const job = addJob({
      userId: currentUser!.id,
      type: 'offer',
      title: title.trim(),
      description: description.trim(),
      rate: Number(rate),
      city: city.trim(),
      photo,
    });
    navigate(`/profil/${currentUser!.id}?job=${job.id}`);
  }

  return (
    <div className="px-4 pt-4 pb-6">
      <Link
        to="/cont"
        className="inline-flex items-center gap-1.5 text-sm text-terracotta font-medium mb-3"
      >
        <ArrowLeft size={16} />
        Înapoi
      </Link>
      <h1 className="text-xl font-bold mb-4">Creează ofertă</h1>

      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-500">Poză</label>
          <div className="mt-1 relative h-36 rounded-xl overflow-hidden bg-gray-200">
            <img src={photo} alt="" className="w-full h-full object-cover" />
            <label className="absolute bottom-2 right-2 bg-white/90 text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer shadow">
              Schimbă
              <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
            </label>
          </div>
        </div>
        <Field label="Titlu" value={title} onChange={setTitle} placeholder="ex: Zilier construcții" />
        <div>
          <label className="text-xs font-medium text-gray-500">Descriere</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-sm"
            placeholder="Detalii despre job..."
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Lei / oră"
            value={rate}
            onChange={setRate}
            placeholder="100"
            type="number"
          />
          <Field label="Oraș" value={city} onChange={setCity} placeholder="Cluj-Napoca" />
        </div>
        {error && <p className="text-sm text-terracotta-dark">{error}</p>}
        <button
          type="submit"
          className="w-full h-12 rounded-xl bg-terracotta text-white font-semibold"
        >
          Publică anunțul
        </button>
      </form>
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
        className="mt-1 w-full h-11 rounded-xl border border-gray-200 px-3 text-sm"
      />
    </div>
  );
}
