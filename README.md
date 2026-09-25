# ZAR ZOR

Affiliate electronics catalog with two maintained application surfaces:

- `Front-End/`: complete public static HTML/CSS/JavaScript website. Its entry point is `Front-End/index.html`.
- `Admin-Panel/`: static administration pages, with shared public styles referenced from `Front-End/css/`.
- `apps/web/`: separate Next.js frontend workspace.
- `apps/api/`: separate Express API workspace.
- `prisma/`: shared Prisma schema, migrations, and seed script.

## Static site

Run the public static site from its own directory so administration files are not served alongside it:

```powershell
python -m http.server 8081 --directory Front-End
```

Open `http://localhost:8081/`.

For a Vercel project serving the static website, set the Vercel **Root Directory** to `Front-End`. No build command is required; that directory contains `index.html` and its relative assets. Do not deploy the repository root as a static site because it also contains administration source files.

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

Set `ADMIN_EMAIL` and a strong, unique `ADMIN_PASSWORD` in the root `.env`; those values are the only admin login. Never commit `.env`. The API compares the submitted credentials to these environment values and issues an eight-hour, HTTP-only signed cookie. Keep `WEB_ORIGIN` and `NEXT_PUBLIC_API_URL` aligned with your app URLs, and use HTTPS in production.

The Next.js app protects `/admin/*` and legacy `/Admin-Panel/*` URLs. The API protects admin data and product writes independently of the browser UI. Public storefront pages remain in `Front-End/`.

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
