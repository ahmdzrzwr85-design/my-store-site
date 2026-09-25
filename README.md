# ZAR ZOR

Affiliate electronics catalog with two maintained application surfaces:

- `Front-End/`: complete public static HTML/CSS/JavaScript website. Its entry point is `Front-End/index.html`.
- `Admin-Panel/`: static administration pages, with shared public styles referenced from `Front-End/css/`.
- `apps/web/`: separate Next.js frontend workspace.
- `apps/api/`: separate Express API workspace.
- `prisma/`: shared Prisma schema, migrations, and seed script.

## Static site

Run the static site locally from the repository root:

```powershell
python -m http.server 8081 --directory .
```

Open `http://localhost:8081/Front-End/`.

For a Vercel project serving the static website, set the Vercel **Root Directory** to `Front-End`. No build command is required; that directory contains `index.html` and its relative assets.

The repository root also contains a small `index.html` redirect so the complete repository can be opened directly by static hosts. Keep the Vercel Root Directory empty when deploying the complete repository; use `Front-End` when deploying only the public frontend.

## Workspace applications

Install dependencies from the repository root:

```powershell
npm install
```

Run the Next.js frontend:

```powershell
npm run web:dev
```

Run the API:

```powershell
npm run api:dev
```

The API uses `DATABASE_URL` from the root environment. Copy `.env.example` to `.env` and configure PostgreSQL before running Prisma commands.

## Static site structure

```text
Front-End/
├── index.html
├── *.html
├── legal/
├── css/
├── js/
├── assets/
│   ├── fonts/
│   ├── icons/
│   └── images/
└── data/

Admin-Panel/
├── pages/
├── css/
├── js/
└── assets/
```

No source files were deleted or renamed. Generated folders such as `.next/` and `dist/` are ignored by Git and can be recreated by the relevant build commands.
