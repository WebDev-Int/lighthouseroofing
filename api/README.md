# Lightweight PHP JSON backend

For shared hosting without a database. Stores form submissions as JSON.

## Endpoints

### POST /api/lead.php
Accepts JSON body:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "service": "string",
  "message": "string"
}
```
Response:
```json
{ "success": true, "message": "Lead stored" }
```

Data is appended to `../data/leads.json`. CORS is open (`*`).

## Deploying to shared hosting
1. Upload all files/folders to your hosting root (keep structure: `index.html`, `styles.css`, `scripts/`, `data/`, `api/`).
2. Ensure PHP is enabled (most shared hosting supports PHP 7+). No database needed.
3. Make `data/` writable by PHP for lead storage (chmod 755/775 as allowed by host).
4. Access the site via your domain; form submits to `/api/lead.php`.

## Notes
- `data/services.json` is static and fetched client-side.
- `data/leads.json` is created on first submission if missing.
- If file permissions prevent writes, host may need to adjust ownership/permissions.
