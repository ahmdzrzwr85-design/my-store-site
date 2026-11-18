# Production Deployment

The database schema already uses PostgreSQL. Deploy the API and Next.js admin separately; the existing public storefront remains the static `Front-End/` Vercel project.

## API

1. Create a PostgreSQL database (for example, on Neon) and keep its connection string private.
2. In Render, create a Blueprint from this repository using `render.yaml`.
3. Set `DATABASE_URL`, `ADMIN_EMAIL`, and a strong `ADMIN_PASSWORD` in the Render service. Set `WEB_ORIGIN` to the comma-separated public storefront and admin origins, for example `https://zarzor.vercel.app,https://zar-zor-admin.vercel.app`.
4. Deploy. The service runs Prisma migrations on startup; its public API base is the Render service URL plus `/api`.

## Admin

Create a Vercel project from the same repository with **Root Directory** set to `apps/web`. Set these environment variables:

- `API_SERVER_URL`: the Render service origin, without `/api` (for example `https://zar-zor-api.onrender.com`).
- `ADMIN_PASSWORD`: the exact same value configured on Render; the middleware uses it to validate the signed session.
- `NEXT_PUBLIC_API_URL`: `/api`.

After deploying, open `/admin/login`, then go to `/admin/products` to add and publish products. The `/api` rewrite keeps the admin session cookie on the Vercel domain while forwarding requests to the API.

## Public Storefront

Set the deployed Render API URL in `Front-End/api-config.js`, for example `https://zar-zor-api.onrender.com/api`, then redeploy the existing static Vercel project. Products marked as published will be appended to its products page. Do not put database credentials or the admin password in this file.
