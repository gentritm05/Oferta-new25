# PVC Oferta - Program për Oferta Dyer & Dritare PVC

## Përmbledhje
Sistemi i menaxhimit të ofertave për dyer dhe dritare PVC. Aplikacioni mundëson krijimin, menaxhimin dhe eksportimin e ofertave profesionale në PDF.

## Funksionalitetet Kryesore

### 1. Paneli Kryesor (Dashboard)
- Statistika të përgjithshme: klientë, oferta, të ardhura
- Statusi i ofertave: draft, të dërguar, të pranuar, të refuzuar
- Veprime të shpejta: krijimi i ofertës/klientit, shikimi i katalogut

### 2. Katalogu i Produkteve
- **Dritare:** 7 lloje (fikse, përkulëse, rrotulluese, përkul-rrotull, rrëshqitëse, etj.)
- **Dyer:** 5 lloje (hyrëse, ballkoni, rrëshqitëse, HST, palosëse)
- **Profile:** 6 profile (Decco, Aluplast, Rehau, Veka)
- **Xhama:** 5 lloje (FLOAT, Low-E, Triple, Sigurie)
- **Ngjyra:** 7 ngjyra me shumaxës çmimi
- **Aksesorë/Hardware:** 8 lloje mekanizmash (Maco, Winkhaus, Roto)

### 3. Menaxhimi i Klientëve
- Shtimi, ndryshimi, fshirja e klientëve
- Informacionet: emri, kompania, telefoni, email, adresa, qyteti
- Zbritje e personalizuar për çdo klient

### 4. Menaxhimi i Ofertave
- Krijimi i ofertave me shumë produkte
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

### 5. Gjenerimi i PDF
- Ofertë profesionale me:
  - Header me numrin e ofertës dhe datën
  - Informacionet e klientit
  - Tabela me produktet
  - Totalet me zbritje dhe TVSH
  - Vlefshmëria e ofertës

## Arkitektura Teknike

### Backend (FastAPI + MongoDB)
- **Endpoints:**
  - `/api/window-types` - Llojet e dritareve
  - `/api/door-types` - Llojet e dyerve
  - `/api/profiles` - Profilet
  - `/api/glass-types` - Llojet e xhamit
  - `/api/colors` - Ngjyrat
  - `/api/hardware` - Aksesorët
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

## Llogaritja e Çmimeve

```
Çmimi = (Çmimi_bazë × Sipërfaqja) × Shumaxës_profil + (Çmimi_xham × Sipërfaqja) × Shumaxës_ngjyre + Çmimi_mekanizëm
```

## Përdorimi

1. **Shtoni klientë** nga seksioni "Klientët"
2. **Krijoni ofertë** nga seksioni "Ofertat"
3. **Zgjidhni produktet** me dimensione, profile, xham, ngjyrë
4. **Caktoni zbritjen dhe TVSH-në**
5. **Eksportoni në PDF** për ta dërguar klientit

## Të Dhënat Seed
Aplikacioni vjen me të dhëna paraprake:
- 7 lloje dritaresh
- 5 lloje dyersh
- 6 profile
- 5 lloje xhami
- 7 ngjyra
- 8 aksesorë

## Statusi i Projektit
✅ MVP i plotë - Funksional dhe i gatshëm për përdorim
