# CLAUDE.md - Victorias fällar / Backend

## Projekt
E-handelsplattform för fårskinn. Keystone.js backend + Next.js frontend.

**Teknikstack:** Next.js, Tailwind, Zod (frontend) · Node.js, Keystone.js, PostgreSQL, Stripe, Resend (backend) · TypeScript, ESLint + Prettier · Railway/Render + Vercel (driftsättning)

## MVP-krav
- Produktvisning med bilder, pris och beskrivning
- Keystone Admin UI för produkthantering
- Kundsidor: produkter, om oss, kontakt
- Varukorg (client-side, localStorage)
- Checkout med Stripe (kortbetalning)
- E-postkvitto via Resend
- Responsiv design (desktop + mobil)
- Driftsatt på Railway/Render + Vercel

## Nuvarande status
Backend klar och körande på port 3001 med PostgreSQL (`viktorias_fallar`).

### Scheman (klara)
- `src/schemas/Product.ts` — namn, slug (auto-genererad från namn), pris (kr), ras (fritext), storlek, sortering, i lager, publicerad, bilder, skapad
- `src/schemas/ProductImage.ts` — bildtext, produkt, uppladdad — **saknar image-fält (se steg 1)**
- `src/schemas/Order.ts` — ordernummer, kundinfo, leveransadress, orderrader (json), belopp, Stripe-ID, status, tidsstämplar
- `src/schemas/Page.ts` — titel, slug, innehåll (textarea), publicerad, uppdaterad

Alla fält har svenska labels. Slug och tidsstämplar är dolda i create-vyn och read-only i edit-vyn.

### Övrigt
- `keystone.ts` och `.env` lämnas orörda
- `@keystone-6/fields-document` används inte (Slate-krasch) — Page använder textarea
- Access control är `allowAll` på alla scheman — låses ned innan produktion

---

## Nästa steg

### 1. Bilduppladdning för ProductImage
Lägg till `image`-fält i `src/schemas/ProductImage.ts` och storage-config i `keystone.ts`.

**Fråga användaren först:** lokal lagring (enklare, ej lämplig för produktion) eller molntjänst (Cloudinary/S3)?

Lokal lagring — lägg till i `keystone.ts`:
```typescript
storage: {
  productImages: {
    kind: 'local',
    type: 'image',
    generateUrl: path => `http://localhost:3001/images${path}`,
    serverRoute: { path: '/images' },
    storagePath: 'public/images',
  },
},
```

Lägg till i `src/schemas/ProductImage.ts`:
```typescript
import { image } from '@keystone-6/core/fields';

image: image({ label: 'Bild', storage: 'productImages' }),
```

### 2. Frontend — Next.js
Skapa `/frontend` parallellt med `/backend` (separat repo eller monorepo).

- Next.js App Router
- Apollo Client eller urql för GraphQL mot `http://localhost:3001/api/graphql`
- Tailwind för styling, Zod för formulärvalidering

Sidor:
- `/` — produktlista
- `/produkter/[slug]` — produktsida
- `/varukorg` — varukorg (localStorage)
- `/kassa` — checkout med Stripe
- `/orderbekraftelse` — bekräftelsesida
- `/om-oss`, `/kontakt` — statiska sidor (hämtar från Page-schemat)

### 3. Stripe — betalningar
- Installera `stripe` i backend
- Skapa custom route i `src/routes/` för payment intent + webhook
- Order-schemat är förberett med `stripePaymentIntentId` och `status`
- Webhook uppdaterar orderstatus till `paid` och triggar e-post

### 4. Resend — e-postkvitton
- Installera `resend` i backend
- Skicka orderbekräftelse när Stripe webhook tar emot `payment_intent.succeeded`
- E-post ska innehålla: ordernummer, produkter, belopp, leveransadress

### 5. Driftsättning
- Backend → Railway eller Render (sätt `DATABASE_URL` som env-variabel)
- Frontend → Vercel
- Uppdatera CORS och `generateUrl` för bilder till produktions-URL
