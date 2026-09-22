/** Seed hub apps from Ciubi pitch — admin can override via Settings hubLinks. */
export interface CiubiApp {
  id: string;
  title: string;
  url: string;
  description: string;
  thumb: string;
  color: string;
  /** Optional CTA label shown beside the thumb (e.g. Pitch). */
  cta?: string;
}

export const CIUBI_APPS: CiubiApp[] = [
  {
    id: 'aprozar',
    title: 'Aprozar Românesc',
    url: 'https://ever-prism-birch-garden.grok.me/',
    description: 'De la grădină, pe masă — produse proaspete.',
    thumb: 'https://cluj1313.github.io/pitch-sponsor/aprozar-cover.jpg',
    color: '#5a7a4a',
  },
  {
    id: 'servicii',
    title: 'Servicii Locale',
    url: 'https://servicii-locale3.grok.me/',
    description: 'Toți meșterii din jurul tău.',
    thumb: 'https://servicii-locale3.grok.me/og.jpg',
    color: '#8b6914',
  },
  {
    id: 'produse',
    title: 'Produse Românești',
    url: 'https://bloom-falcon-zephyr-atlas.grok.me/',
    description: 'Marfă fabricată aici, în țară.',
    thumb: '/job-de-o-zi/assets/produse-hub.jpg',
    color: '#c46a3a',
  },
  {
    id: 'trading',
    title: 'Trading Companion',
    url: 'https://cluj1313.github.io/ciubi-trading-companion3/',
    description: 'Planul, jurnalul și disciplina — forex și acțiuni.',
    thumb: 'https://cluj1313.github.io/pitch-sponsor/trading-cover.jpg',
    color: '#3d5a80',
  },
  {
    id: 'note',
    title: 'Ciubi Note',
    url: 'https://cluj1313.github.io/ciubi-note-app/',
    description: 'Notițe simple, pentru treabă și idei.',
    thumb: 'https://cluj1313.github.io/pitch-sponsor/note-cover.jpg',
    color: '#c4a35a',
  },
  {
    id: 'pitch',
    title: 'Pitch sponsor hub',
    url: 'https://cluj1313.github.io/pitch-sponsor/?v=pr14',
    description: 'Caut sponsori pentru aplicații care ajută românii.',
    thumb: '/job-de-o-zi/assets/pitch-thumb.jpg',
    color: '#3d2b1f',
    cta: 'Vezi pitch-ul',
  },
];
