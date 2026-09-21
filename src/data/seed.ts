import type { User, Job, Review, Message, AppSettings } from '../types';

export const DEMO_ADMIN_PHONE = '0700000000';
export const DEMO_ADMIN_PASSWORD = 'admin123';

export const seedUsers: User[] = [
  {
    id: 'admin',
    name: 'Admin Demo',
    phone: DEMO_ADMIN_PHONE,
    password: DEMO_ADMIN_PASSWORD,
    city: 'Cluj-Napoca',
    role: 'offerer',
    rating: 5,
    ratingCount: 12,
    isAdmin: true,
    isOwner: true,
    description: 'Administrator platformă Job de o zi.',
    cover: '/assets/cover-watch.jpg',
  },
  {
    id: 'u1',
    name: 'Andrei Popescu',
    phone: '0722111001',
    password: 'demo123',
    city: 'Cluj-Napoca',
    role: 'offerer',
    rating: 4.8,
    ratingCount: 24,
    description: 'Firmă construcții — angajăm zilieri.',
    cover: '/assets/cover-jobs.jpg',
  },
  {
    id: 'u2',
    name: 'Maria Ionescu',
    phone: '0722111002',
    password: 'demo123',
    city: 'București',
    role: 'offerer',
    rating: 4.5,
    ratingCount: 18,
    description: 'Evenimente & catering.',
  },
  {
    id: 'u3',
    name: 'Ion Vasile',
    phone: '0722111003',
    password: 'demo123',
    city: 'Timișoara',
    role: 'seeker',
    rating: 4.2,
    ratingCount: 9,
    description: 'Disponibil pentru munci fizice.',
  },
  {
    id: 'u4',
    name: 'Elena Radu',
    phone: '0722111004',
    password: 'demo123',
    city: 'Iași',
    role: 'seeker',
    rating: 4.9,
    ratingCount: 31,
    description: 'Babysitter și ajutor casnic.',
  },
  {
    id: 'u5',
    name: 'Mihai Georgescu',
    phone: '0722111005',
    password: 'demo123',
    city: 'Brașov',
    role: 'offerer',
    rating: 4.0,
    ratingCount: 7,
    description: 'Depozit logistică.',
  },
  {
    id: 'u6',
    name: 'Ana Stoica',
    phone: '0722111006',
    password: 'demo123',
    city: 'Cluj-Napoca',
    role: 'seeker',
    rating: 4.6,
    ratingCount: 14,
    description: 'Studentă — ospătar / hostess.',
  },
  {
    id: 'u7',
    name: 'Cristian Dobre',
    phone: '0722111007',
    password: 'demo123',
    city: 'Constanța',
    role: 'offerer',
    rating: 3.8,
    ratingCount: 5,
    description: 'Renovări apartamente.',
  },
];

export const seedJobs: Job[] = [
  { id: 'j1', userId: 'u1', type: 'offer', title: 'Zilier construcții — șantier Florești', description: 'Ajutor pe șantier. Plată zilnică.', rate: 120, city: 'Cluj-Napoca', photo: '/assets/cover-jobs.jpg', createdAt: '2026-09-18T08:00:00' },
  { id: 'j2', userId: 'u2', type: 'offer', title: 'Ospătar eveniment corporate', description: 'Seară de vineri, 18:00–01:00.', rate: 80, city: 'București', photo: '/assets/cover-watch.jpg', createdAt: '2026-09-19T10:00:00' },
  { id: 'j3', userId: 'u5', type: 'offer', title: 'Încărcător depozit — 1 zi', description: 'Mutare paleți, scanare colete.', rate: 100, city: 'Brașov', photo: '/assets/cover-jobs.jpg', createdAt: '2026-09-20T07:30:00' },
  { id: 'j4', userId: 'u7', type: 'offer', title: 'Zugrav ajutor — renovare', description: 'Pregătire pereți, vopsit.', rate: 90, city: 'Constanța', photo: '/assets/cover-watch.jpg', createdAt: '2026-09-17T12:00:00' },
  { id: 'j5', userId: 'u3', type: 'seek', title: 'Caut muncă fizică — mutări', description: 'Disponibil imediat în Timișoara.', rate: 70, city: 'Timișoara', photo: '/assets/cover-jobs.jpg', createdAt: '2026-09-19T14:00:00' },
  { id: 'j6', userId: 'u4', type: 'seek', title: 'Babysitter disponibilă', description: 'Copii 2–10 ani. Iași.', rate: 50, city: 'Iași', photo: '/assets/cover-watch.jpg', createdAt: '2026-09-18T16:00:00' },
  { id: 'j7', userId: 'u6', type: 'seek', title: 'Hostess / ospătar — weekend', description: 'Studentă, engleză fluentă.', rate: 60, city: 'Cluj-Napoca', photo: '/assets/cover-jobs.jpg', createdAt: '2026-09-20T09:00:00' },
  { id: 'j8', userId: 'u3', type: 'seek', title: 'Curățenie birouri / case', description: 'Experiență 3 ani.', rate: 55, city: 'Timișoara', photo: '/assets/cover-watch.jpg', createdAt: '2026-09-16T11:00:00' },
];

export const seedReviews: Review[] = [
  { id: 'r1', targetUserId: 'u1', authorId: 'u3', authorName: 'Ion Vasile', rating: 5, text: 'Plată la timp, condiții bune.', reply: 'Mulțumim!', createdAt: '2026-09-10T12:00:00' },
  { id: 'r2', targetUserId: 'u1', authorId: 'u6', authorName: 'Ana Stoica', rating: 4, text: 'Bine organizat.', createdAt: '2026-09-12T15:00:00' },
  { id: 'r3', targetUserId: 'u4', authorId: 'u2', authorName: 'Maria Ionescu', rating: 5, text: 'Excelentă cu copiii!', createdAt: '2026-09-08T18:00:00' },
  { id: 'r4', targetUserId: 'admin', authorId: 'u1', authorName: 'Andrei Popescu', rating: 5, text: 'Platformă utilă.', createdAt: '2026-09-05T10:00:00' },
];

export const seedMessages: Message[] = [
  { id: 'm1', fromId: 'admin', fromName: 'Admin Demo', toId: 'all', text: 'Bine ați venit pe Job de o zi!', createdAt: '2026-09-15T09:00:00', broadcast: true },
  { id: 'm2', fromId: 'u1', fromName: 'Andrei Popescu', toId: 'u3', text: 'Salut Ion, disponibil mâine?', createdAt: '2026-09-19T11:00:00' },
  { id: 'm3', fromId: 'u3', fromName: 'Ion Vasile', toId: 'u1', text: 'Da, de la 7:00.', createdAt: '2026-09-19T11:30:00' },
];

export const seedSettings: AppSettings = {
  ownerPresentation:
    '# Job de o zi\n\nPiața românească de muncă pe zi.\n\n## Cum funcționează\n1. Alege **Ofer de lucru** sau **Caut de lucru**\n2. Creează profilul\n3. Publică sau aplică\n4. Contactează prin telefon, WhatsApp sau mesaj\n\n## Despre\nMVP demo. Admin: 0700000000',
  hubLinks: [
    {
      id: 'h1',
      title: 'Pitch Sponsor',
      url: 'https://cluj1313.github.io/pitch-sponsor/?v=pr14',
      description: 'Prezentare pentru sponsori',
    },
    {
      id: 'h2',
      title: 'GitHub',
      url: 'https://github.com/cluj1313/job-de-o-zi',
      description: 'Cod sursă',
    },
  ],
};
