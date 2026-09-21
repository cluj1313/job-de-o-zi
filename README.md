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

1. **Acasă** — cover, Share (`navigator.share` + clipboard), butoane Ofer / Caut
2. **Liste** — carduri verticale (poză, titlu, lei/oră, oraș, stele, inimă) + filtre
3. **Auth** — înregistrare / login (nume, telefon, parolă, oraș) + sesiune localStorage
4. **Avatar** — cameră sau fișier + refacere (fără video)
5. **Profil** — cover + avatar rotund, Call / WhatsApp / Mesaj, rating de la 0, recenzii + răspuns oferent
6. **Creează ofertă**
7. **Favorite** persistente
8. **Mesaje** mock + broadcast admin
9. **Setări** — hub cards (default Pitch Sponsor) + prezentare proprietar
10. **Admin** — blocare/ștergere useri, mesaje, link-uri hub, ștergere recenzii

## Navigare jos

Acasă · Mesaje · **Favorite** (centru) · Cont · Setări  
Activ: bandă maroon `#7a1f2b` + text/icon alb.

## TODO (post-MVP)

- [ ] Avatar video (înregistrare scurtă)
- [ ] GPS / geolocație pentru anunțuri din apropiere
- [ ] Plăți / escrow
- [ ] Backend real (API + auth)
- [ ] Push notifications
- [ ] Paginare / căutare full-text

## Structură

```
public/assets/   cover-jobs.jpg, cover-watch.jpg
src/pages/       ecrane
src/components/  BottomNav, JobCard, …
src/store/       localStorage store
src/data/seed.ts date demo (8 joburi + useri)
src/assets/covers.ts  imagini cover embedate (data URL)
```

## Licență

MVP demo — `cluj1313/job-de-o-zi`
