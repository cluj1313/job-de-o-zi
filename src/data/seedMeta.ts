import type { Review, Message, AppSettings } from '../types';
export const seedReviews: Review[] = [
  {
    id: 'r1',
    targetUserId: 'u1',
    authorId: 'u3',
    authorName: 'Ion Vasile',
    rating: 5,
    text: 'Plată la timp, condiții bune pe șantier.',
    reply: 'Mulțumim! Te așteptăm oricând.',
    createdAt: '2026-09-10T12:00:00',
  },
  {
    id: 'r2',
    targetUserId: 'u1',
    authorId: 'u6',
    authorName: 'Ana Stoica',
    rating: 4,
    text: 'Bine organizat, puțină așteptare dimineața.',
    createdAt: '2026-09-12T15:00:00',
  },
  {
    id: 'r3',
    targetUserId: 'u4',
    authorId: 'u2',
    authorName: 'Maria Ionescu',
    rating: 5,
    text: 'Elena a fost excelentă cu copiii!',
    createdAt: '2026-09-08T18:00:00',
  },
  {
    id: 'r4',
    targetUserId: 'admin',
    authorId: 'u1',
    authorName: 'Andrei Popescu',
    rating: 5,
    text: 'Platformă utilă pentru zilieri.',
    createdAt: '2026-09-05T10:00:00',
  },
  {
    id: 'r-radu1',
    targetUserId: 'u-radu',
    authorId: 'u3',
    authorName: 'Ion Vasile',
    rating: 5,
    text: 'Lucru impecabil, predare la timp. Recomand!',
    reply: 'Mulțumim! Te așteptăm oricând.',
    createdAt: '2026-09-12T12:00:00',
  },
  {
    id: 'r-radu2',
    targetUserId: 'u-radu',
    authorId: 'u6',
    authorName: 'Ana Stoica',
    rating: 5,
    text: 'Echipă serioasă, curățenie pe șantier.',
    createdAt: '2026-09-14T15:00:00',
  },
];

export const seedMessages: Message[] = [
  {
    id: 'm1',
    fromId: 'admin',
    fromName: 'Cioban Iosif Gabriel',
    toId: 'all',
    text: 'Bine ați venit pe Job de o zi! Verificați anunțurile din orașul vostru.',
    createdAt: '2026-09-15T09:00:00',
    broadcast: true,
  },
  {
    id: 'm2',
    fromId: 'u1',
    fromName: 'Andrei Popescu',
    toId: 'u3',
    text: 'Salut Ion, ai fi disponibil mâine pe șantier?',
    createdAt: '2026-09-19T11:00:00',
  },
  {
    id: 'm3',
    fromId: 'u3',
    fromName: 'Ion Vasile',
    toId: 'u1',
    text: 'Da, pot de la 7:00. Trimite adresa.',
    createdAt: '2026-09-19T11:30:00',
  },
];

export const seedSettings: AppSettings = {
  textSize: 'md',
  ownerPresentation: `# Job de o zi

Piața românească de muncă pe zi — conectăm rapid angajatori și zilieri.

## Cum funcționează
1. Alege **Ofer de lucru** sau **Caut de lucru**
2. Creează profilul cu telefon și oraș
3. Publică sau aplică la anunțuri
4. Contactează prin telefon, WhatsApp sau mesaj

## Proprietar
**Cioban Iosif Gabriel**
Email: cluj1313@gmail.com
Tel. 0770.148.119`,
  hubLinks: [
    {
      id: 'aprozar',
      title: 'Aprozar Românesc',
      url: 'https://ever-prism-birch-garden.grok.me/',
      description: 'De la grădină, pe masă — produse proaspete.',
      photo: 'https://cluj1313.github.io/pitch-sponsor/aprozar-cover.jpg',
    },
    {
      id: 'servicii',
      title: 'Servicii Locale',
      url: 'https://servicii-locale3.grok.me/',
      description: 'Toți meșterii din jurul tău.',
      photo: 'https://servicii-locale3.grok.me/og.jpg',
    },
    {
      id: 'produse',
      title: 'Produse Românești',
      url: 'https://bloom-falcon-zephyr-atlas.grok.me/',
      description: 'Marfă fabricată aici, în țară.',
      photo: '/job-de-o-zi/assets/produse-hub.jpg',
    },
    {
      id: 'trading',
      title: 'Trading Companion',
      url: 'https://cluj1313.github.io/ciubi-trading-companion3/',
      description: 'Planul, jurnalul și disciplina — forex și acțiuni.',
      photo: 'https://cluj1313.github.io/pitch-sponsor/trading-cover.jpg',
    },
    {
      id: 'note',
      title: 'Ciubi Note',
      url: 'https://cluj1313.github.io/ciubi-note-app/',
      description: 'Notițe simple, pentru treabă și idei.',
      photo: 'https://cluj1313.github.io/pitch-sponsor/note-cover.jpg',
    },
    {
      id: 'pitch',
      title: 'Pitch sponsor hub',
      url: 'https://cluj1313.github.io/pitch-sponsor/?v=pr14',
      description: 'Caut sponsori pentru aplicații care ajută românii.',
      photo: '/job-de-o-zi/assets/pitch-thumb.jpg',
    },
  ],
};
