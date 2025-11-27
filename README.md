# Cinema Front-End Monorepo

This repository contains two separate Vite React applications deployed as distinct Azure Static Web Apps:

- Admin Panel (tags: vX.X.X) → https://lively-moss-05fbe2703.3.azurestaticapps.net/
- Client App (tags: cX.X.X) → https://orange-wave-0372a7903.3.azurestaticapps.net/

## Repository Structure

```
cinema-front-end/
├── cinema-front/          # Admin panel app (tag prefix v)
│   ├── src/
│   ├── index.html
│   └── package.json
├── cinema-client/         # Client-facing app (tag prefix c)
│   ├── src/
│   ├── index.html
│   └── package.json
├── .github/workflows/
│   ├── azure-static-web-apps-lively-moss-05fbe2703.yml   # Admin deploy
│   └── azure-static-web-apps-thankful-grass-0a0c7fa03.yml # Client deploy
└── README.md
```

## Prerequisites

- Node.js 20 or 22 (match workflow Node version)
- npm (or yarn/pnpm)

## Clone

```bash
git clone https://github.com/DIN24-AGI/cinema-front-end.git
cd cinema-front-end
```

## Install Dependencies

Admin app:

```bash
cd cinema-front
npm install
```

Client app:

```bash
cd ../cinema-client
npm install
```

## Development

Start admin (default port 5173):

```bash
cd cinema-front
npm run dev
```

Start client (different port, e.g. 5174):

```bash
cd cinema-client
npm run dev -- --port 5174
```

## Environment Variables

Create `.env` in each app root as needed:

```
VITE_API_BASE_URL=https://your-api.example.com
```

## Scripts (each app)

- `npm run dev` – Development server
- `npm run build` – Production build
- `npm run preview` – Preview build
- `npm run lint` – Lint

## Deployment

Azure workflows trigger on tag push:

- Admin panel: tags starting with `v` (e.g. `v1.0.3`)
- Client app: tags starting with `c` (e.g. `c1.0.3`)

### Steps

1. Push changes:

```bash
git add -A
git commit -m "Feature/update"
git push origin main
```

2. Tag for admin deploy:

```bash
git tag -a v1.0.3 -m "Admin release v1.0.3"
git push origin v1.0.3
```

3. Tag for client deploy:

```bash
git tag -a c1.0.3 -m "Client release c1.0.3"
git push origin c1.0.3
```

Check status in GitHub Actions.

## Versioning

Semantic versioning per app:

- Admin: `vMAJOR.MINOR.PATCH`
- Client: `cMAJOR.MINOR.PATCH`

Increment PATCH for fixes, MINOR for features, MAJOR for breaking changes.

## Team

- Alicja Williams
- Gleb Bulygin
- Igor Bologov

## Next Improvements (Optional)

- Add testing section (Jest / Vitest).
- Add CONTRIBUTING.md.
- Add LICENSE file.
- Document i18n usage (locales folder, language switch).
