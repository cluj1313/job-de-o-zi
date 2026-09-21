# Job de o zi

Piață mobilă MVP (România) pentru joburi pe zi / gig-uri.

**Ofer de lucru** · **Caut de lucru**

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- React Router
- Persistare locală (`localStorage`) — fără backend

## Pornire locală

```bash
npm install
npm run dev
```

Deschide URL-ul afișat de Vite (de obicei `http://localhost:5173`).

Build producție:

```bash
npm run build
npm run preview
```

## Cont admin demo

| Câmp    | Valoare      |
|---------|--------------|
| Telefon | `0700000000` |
| Parolă  | `admin123`   |

Alți useri demo: `0722111001`–`0722111007` / parolă `demo123`.

## Funcționalități MVP

1. **Acasă** — cover, Share, butoane Ofer / Caut
2. **Liste** — carduri + filtre (oraș, lei/oră, rating)
3. **Auth** — înregistrare / login + sesiune localStorage
4. **Avatar** — cameră sau fișier + refacere
5. **Profil** — cover + avatar, Call / WhatsApp / Mesaj, rating, recenzii
6. **Creează ofertă**
7. **Favorite** persistente
8. **Mesaje** mock + broadcast admin
9. **Setări** — hub (Pitch Sponsor) + prezentare proprietar
10. **Admin** — useri, mesaje, hub links, recenzii

## Navigare jos

Acasă · Mesaje · **Favorite** (centru) · Cont · Setări  
Activ: maroon `#7a1f2b` + text/icon alb.

## Cover images

Add under `public/assets/` (present in local workspace):

- `cover-jobs.jpg`
- `cover-watch.jpg`

## TODO (post-MVP)

- [ ] Avatar video
- [ ] GPS / geolocație
- [ ] Plăți / escrow
- [ ] Backend real
- [ ] Push notifications

## Gaps / follow-up

Complete runnable app lives at local `/workspace/job-de-o-zi`.

If missing after clone, copy from local:

- `src/pages/Profile.tsx` (if absent)
- `public/assets/cover-*.jpg`
- `package-lock.json` (or run `npm install`)

## Licență

MVP demo — `cluj1313/job-de-o-zi`
