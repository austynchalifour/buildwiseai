# Deploying BuildWise on Hostinger

BuildWise runs as **one Node.js app**: Express serves `/api/*` and Next.js serves the UI on the same port.

## Hostinger (single Node.js app)

1. **Remove** any old regular-hosting or split deployments
2. **Websites → Add Website → Node.js Apps → Import Git Repository**
3. Select `buildwiseai`

| Setting | Value |
|---------|-------|
| **Root directory** | `.` (repo root) |
| **Node.js version** | `20` |
| **Install command** | `npm ci` |
| **Build command** | `npm run build` |
| **Start command** | `npm run start` |
| **Entry file** | `dist/server/index.js` |
| **Output directory** | *(leave empty)* |

### Environment variables

Set these in the Hostinger app panel (do not commit secrets to GitHub):

```
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=long-random-secret
FRONTEND_URL=https://yourdomain.com
UPLOAD_DIR=./uploads
NODE_ENV=production
OPENAI_API_KEY=sk-...   (optional)
```

`NEXT_PUBLIC_API_URL` is **not required** when frontend and API share one domain (default).

### After first deploy

Run seed once (SSH/terminal if available):

```bash
npm run seed
```

Verify:

- `https://yourdomain.com` — app UI
- `https://yourdomain.com/api/health` — `{"status":"ok",...}`

---

## Local development

```bash
npm install
npm install --prefix frontend
cp .env.example .env
# or use backend/.env
npm run seed
npm run dev
```

Open **http://localhost:3000** (API + UI on one port).

---

## Project layout

```
BuildWise/
├── server/index.ts      # Unified entry (Express + Next.js)
├── backend/src/         # API routes, models, services
├── frontend/            # Next.js UI
└── package.json         # Single install & deploy
```

`backend/` and `frontend/` remain separate source folders but deploy together.

---

## References

- [Hostinger: Deploy Node.js](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/)
- [Hostinger Next.js starter](https://github.com/hostinger/deploy-nextjs)
