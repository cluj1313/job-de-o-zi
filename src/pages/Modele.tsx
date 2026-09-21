import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  MapPin,
  Briefcase,
  Star,
  Sparkles,
} from 'lucide-react';
import { StarRating } from '../components/StarRating';
import { coverJobs, coverWatch, resolveAsset } from '../utils/assets';

/** Polished static demos for judging UI beauty — not tied to live store edits. */

const OFFER = {
  name: 'Radu Oltean',
  city: 'Cluj-Napoca',
  role: 'Oferă de lucru',
  rating: 4.9,
  ratingCount: 47,
  title: 'Zugrav & renovări — echipă pe zi',
  rate: 110,
  about:
    '15 ani experiență în finisaje. Lucrăm curat, respectăm termenele. Materialele pot fi asigurate de noi sau de client. Zone: Cluj, Florești, Apahida.',
  phone: '0722 555 010',
  cover: coverJobs,
  avatarLetter: 'R',
  tags: ['Zugrăveli', 'Gresie', 'Renovări'],
  reviews: [
    { author: 'Andrei P.', rating: 5, text: 'Lucru impecabil, predare la timp.' },
    { author: 'Maria I.', rating: 5, text: 'Echipă serioasă, recomand cu încredere.' },
  ],
};

const SEEKER = {
  name: 'Elena Radu',
  city: 'Iași',
  role: 'Caută de lucru',
  rating: 4.9,
  ratingCount: 31,
  title: 'Babysitter & ajutor casnic',
  rate: 50,
  about:
    'Experiență 5 ani cu copii 2–10 ani. Referințe la cerere. Disponibilă săptămânal și weekend. Copou / Centru.',
  phone: '0722 111 004',
  cover: coverWatch,
  avatarLetter: 'E',
  tags: ['Babysitting', 'Curățenie', 'Gătit'],
  reviews: [
    { author: 'Familia Pop', rating: 5, text: 'Elena a fost excelentă cu copiii!' },
    { author: 'Ioana M.', rating: 5, text: 'Punctuală, blândă, foarte de încredere.' },
  ],
};

function DemoProfile({
  data,
  accent,
}: {
  data: typeof OFFER;
  accent: 'offer' | 'seek';
}) {
  const isOffer = accent === 'offer';
  return (
    <div className="rounded-3xl overflow-hidden border border-tan/60 bg-white shadow-md">
      <div className="relative h-40 bg-tan">
        <img
          src={resolveAsset(data.cover)}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-earth/50 to-transparent" />
        <span
          className={[
            'absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full',
            isOffer ? 'bg-terracotta text-white' : 'bg-ochre text-white',
          ].join(' ')}
        >
          {isOffer ? 'Demo ofertant' : 'Demo căutător'}
        </span>
      </div>

      <div className="px-4 -mt-10 relative pb-4">
        <div className="w-20 h-20 rounded-full border-4 border-white bg-peach shadow-md overflow-hidden flex items-center justify-center">
          <span className="text-2xl font-bold text-terracotta">{data.avatarLetter}</span>
        </div>

        <h3 className="mt-2 text-lg font-bold text-earth">{data.name}</h3>
        <p className="text-xs text-earth-muted flex items-center gap-1">
          <MapPin size={12} />
          {data.city} · {data.role}
        </p>
        <div className="mt-1">
          <StarRating value={data.rating} count={data.ratingCount} size={13} />
        </div>

        <div className="mt-3 p-3 rounded-2xl bg-terracotta/5 border border-terracotta/15">
          <p className="font-semibold text-sm text-earth flex items-center gap-1.5">
            <Briefcase size={14} className="text-terracotta" />
            {data.title}
          </p>
          <p className="text-terracotta font-bold text-base mt-1">{data.rate} lei/oră</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {data.tags.map((t) => (
              <span
                key={t}
                className="text-[10px] px-2 py-0.5 rounded-full bg-peach/70 text-earth-muted font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <p className="mt-3 text-sm text-earth-muted leading-relaxed">{data.about}</p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            type="button"
            className="h-11 rounded-xl bg-terracotta text-white flex items-center justify-center gap-1 text-xs font-semibold shadow-sm"
          >
            <Phone size={14} />
            Call
          </button>
          <button
            type="button"
            className="h-11 rounded-xl bg-[#25D366] text-white flex items-center justify-center gap-1 text-xs font-semibold shadow-sm"
          >
            <MessageCircle size={14} />
            WhatsApp
          </button>
          <button
            type="button"
            className="h-11 rounded-xl bg-white border-2 border-terracotta text-terracotta flex items-center justify-center gap-1 text-xs font-semibold"
          >
            Mesaj
          </button>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold text-earth-muted uppercase tracking-wide flex items-center gap-1">
            <Star size={12} className="text-gold" />
            Recenzii
          </p>
          {data.reviews.map((r) => (
            <div key={r.author} className="p-2.5 rounded-xl bg-cream border border-tan/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">{r.author}</span>
                <StarRating value={r.rating} showValue={false} size={11} />
              </div>
              <p className="text-xs text-earth-muted mt-0.5">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Modele() {
  return (
    <div className="px-4 pt-4 pb-8">
      <Link
        to="/setari"
        className="inline-flex items-center gap-1.5 text-sm text-terracotta font-medium mb-3"
      >
        <ArrowLeft size={16} />
        Înapoi la Setări
      </Link>

      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={20} className="text-ochre" />
        <h1 className="text-xl font-bold text-earth">Modele</h1>
      </div>
      <p className="text-sm text-earth-muted mb-5">
        Ecrane demo polishate — ca să vezi cum arată un profil ofertant și unul căutător.
        Poți deschide și profilurile live din seed.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-earth-muted mb-3">
            Profil ofertant · Radu Oltean
          </h2>
          <DemoProfile data={OFFER} accent="offer" />
          <Link
            to="/profil/u-radu?job=j-radu"
            className="mt-3 block text-center text-sm text-terracotta font-semibold"
          >
            Deschide profil live →
          </Link>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-earth-muted mb-3">
            Profil căutător · Elena Radu
          </h2>
          <DemoProfile data={SEEKER} accent="seek" />
          <Link
            to="/profil/u4?job=j6"
            className="mt-3 block text-center text-sm text-terracotta font-semibold"
          >
            Deschide profil live →
          </Link>
        </section>
      </div>
    </div>
  );
}
