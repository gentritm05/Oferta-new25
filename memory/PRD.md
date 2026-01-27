# PVC Oferta - Program për Oferta Dyer & Dritare PVC

## Përmbledhje
Sistemi i menaxhimit të ofertave për dyer dhe dritare PVC. Aplikacioni mundëson krijimin, menaxhimin dhe eksportimin e ofertave profesionale në PDF.

## Funksionalitetet Kryesore

### 1. Autentikimi & Multi-tenancy
- **JWT Authentication:** Login/Register për përdoruesit
- **Multi-tenant:** Çdo kompani sheh vetëm të dhënat e veta
- **Admin Panel:** Aktivizimi dhe menaxhimi i përdoruesve
- **Abonimi:** Sistem i bazuar në pagesë mujore

### 2. Menaxhimi i Çmimeve (Admin)
- Administratori mund të ndryshojë çmimin mujor të abonimit
- Paketa automatike me zbritje: 1 muaj (0%), 3 muaj (-10%), 6 muaj (-20%), 12 muaj (-30%)
- Çmimet shfaqen në faqen e regjistrimit

### 3. Paneli Kryesor (Dashboard)
- Statistika të përgjithshme: klientë, oferta, të ardhura
- Statusi i ofertave: draft, të dërguar, të pranuar, të refuzuar
- Veprime të shpejta: krijimi i ofertës/klientit, shikimi i katalogut

### 4. Katalogu i Produkteve
- **Dritare:** 7 lloje (fikse, përkulëse, rrotulluese, përkul-rrotull, rrëshqitëse)
- **Dyer:** 5 lloje (hyrëse, ballkoni, rrëshqitëse, HST, palosëse)
- **Profile:** 6 profile (Decco, Aluplast, Rehau, Veka)
- **Xhama:** 5 lloje (FLOAT, Low-E, Triple, Sigurie)
- **Ngjyra:** 7 ngjyra me shumaxës çmimi
- **Aksesorë/Hardware:** 8 lloje mekanizmash (Maco, Winkhaus, Roto)
- Vizualizime SVG për dritare dhe dyer

### 5. Menaxhimi i Klientëve
- Shtimi, ndryshimi, fshirja e klientëve
- Informacionet: emri, kompania, telefoni, email, adresa, qyteti
- Zbritje e personalizuar për çdo klient

### 6. Menaxhimi i Ofertave
- Krijimi i ofertave me **SHUMË produkte të ndryshme** (dritare + dyer)
- Llogaritja automatike e çmimeve bazuar në:
  - Dimensionet (sipërfaqja në m²)
  - Lloji i produktit
  - Profili dhe shumaxësi
  - Xhami dhe çmimi për m²
  - Ngjyra dhe shumaxësi
  - Mekanizmi (opsional)
- Zbritje dhe TVSH automatike
- Statuset: draft, dërguar, pranuar, refuzuar
- Eksportim në PDF

### 7. Gjenerimi i PDF
- Ofertë profesionale me:
  - Header me numrin e ofertës dhe datën
  - Informacionet e klientit
  - Tabela me produktet
  - Totalet me zbritje dhe TVSH
  - Vlefshmëria e ofertës

## Arkitektura Teknike

### Backend (FastAPI + MongoDB)
- **Auth Endpoints:**
  - `/api/auth/register` - Regjistrim
  - `/api/auth/login` - Kyçje
  - `/api/auth/me` - Profili i përdoruesit
  - `/api/auth/profile` - Përditësim profili
  - `/api/auth/forgot-password` - Kërko kod rikthimi
  - `/api/auth/reset-password` - Rikthe fjalëkalimin

- **Admin Endpoints:**
  - `/api/admin/users` - Lista e përdoruesve
  - `/api/admin/users/{id}/activate` - Aktivizo/çaktivizo
  - `/api/admin/pricing` - Ndrysho çmimin mujor
  - `/api/pricing` - Merr çmimet (publike)

- **Product Endpoints:**
  - `/api/window-types` - Llojet e dritareve
  - `/api/door-types` - Llojet e dyerve
  - `/api/profiles` - Profilet
  - `/api/glass-types` - Llojet e xhamit
  - `/api/colors` - Ngjyrat
  - `/api/hardware` - Aksesorët

- **Business Endpoints:**
  - `/api/customers` - Klientët (CRUD)
  - `/api/offers` - Ofertat (CRUD)
  - `/api/offers/{id}/pdf` - Gjenerimi i PDF
  - `/api/dashboard/stats` - Statistikat

### Frontend (React + Tailwind CSS)
- Dizajn responsive (desktop dhe mobile)
- Sidebar navigimi me ngjyra gradient
- Vizualizime SVG për dritare dhe dyer
- Modals për forma
- Tabelat për ofertat

## Statusi i Projektit
✅ MVP i plotë - Funksional dhe i gatshëm për përdorim

### Implementuar (27 Janar 2025)
- [x] Admin pricing management - ndryshimi i çmimit mujor
- [x] Paketat e çmimeve në faqen e regjistrimit (1,3,6,12 muaj)
- [x] Shumë produkte në një ofertë (dritare + dyer)
- [x] Testet backend (15/15 passed)
- [x] Testet frontend (all passed)

### Detyra të Ardhshme (Backlog)
- [ ] Forgot password - implementim email (aktualisht shfaq kodin)
- [ ] Faqja e dedikuar e profilit të përdoruesit
- [ ] Refaktorim App.js në komponente më të vogla
- [ ] Refaktorim server.py në router files
