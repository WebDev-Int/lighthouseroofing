# LightHouse Roofing & Remodeling – Frontend (Vite) + Lightweight PHP JSON backend

This repo is ready for shared hosting: static Vite build for the frontend, and simple PHP endpoints that write JSON (no database).

## Structure
- `src/` – Vite entry and JS modules
  - `main.js` – wires modules together
  - `services.js` – loads/renders services from `/public/data/services.json`
  - `form.js` – handles contact form submission to `/api/lead.php`
  - `style.css` – site styling
- `public/` – static assets served as-is (logo, favicon, services.json)
- `api/` – PHP endpoints (e.g., `lead.php` writes to `data/leads.json`)
- `data/` – writable folder for PHP to store leads (create `leads.json` at runtime)
- `dist/` – build output after `npm run build`

## Quick start (local)
```bash
npm install
npm run dev   # Vite dev server
npm run build # outputs to dist/
```

## Deploying to shared hosting
1. Build: `npm run build`.
2. Upload `dist/` contents plus the `api/` folder and the writable `data/` folder.
3. Ensure PHP is enabled and `data/` is writable by the web server.
4. The contact form posts to `/api/lead.php`; leads append to `data/leads.json`.

## Editing for non-developers
- **Update services**: edit `public/data/services.json` (titles, summaries, tags, CTAs).
- **Change contact info**: adjust phone/email in `index.html` (contact card) and `src/form.js` fallback text.
- **Change colors/typography**: edit `src/style.css`.
- **Logo/icon**: replace `public/assets/logo.png` (favicon uses the same image at `favicon.png`).

## Notes
- Canonical/OG/Twitter SEO tags and JSON-LD are in `index.html`. Update URLs/handles if they change.
- Keep `public/` paths (e.g., `/assets/logo.png`, `/data/services.json`) when editing references.
- If hosting under a subpath, set `base` in `vite.config.js` accordingly.
