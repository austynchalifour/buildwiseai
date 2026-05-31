# Deploying BuildWise on Hostinger

BuildWise is a **full-stack Node.js app** (Next.js frontend + Express API + MongoDB). A **403 Forbidden** on Hostinger almost always means the site was deployed as regular web hosting instead of a **Node.js Web App**, or the build settings point at the wrong folder.

## Why you see 403

Hostinger's standard GitHub import copies files into `public_html`. This repo has **no `index.html` at the root** — it is a monorepo with `frontend/` and `backend/`. The web server blocks directory access → **403 Forbidden**.

You need **Node.js Web Apps** hosting (Business or Cloud plan), not plain shared hosting.

References:
- [Hostinger: Deploy Node.js](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/)
- [Hostinger Next.js starter](https://github.com/hostinger/deploy-nextjs)

---

## Step 1 — Set up MongoDB Atlas (required)

Hostinger does not run MongoDB for you. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and copy the connection string.

---

## Step 2 — Deploy the frontend (main website)

1. In hPanel go to **Websites → Add Website → Node.js Apps**
2. Choose **Import Git Repository** and select `buildwiseai`
3. Use these build settings:

| Setting | Value |
|---------|-------|
| **Root directory** | `frontend` *(recommended)* or repo root |
| **Node.js version** | `20` |
| **Install command** | `npm ci` |
| **Build command** | `npm run build` |
| **Start command** | `npm run start -- -p $PORT` |
| **Output directory** | *(leave empty for Next.js SSR)* |

If using **repo root** instead of `frontend/`:

| Setting | Value |
|---------|-------|
| **Install command** | `npm ci --prefix frontend` |
| **Build command** | `npm run build` |
| **Start command** | `npm run start -- -p $PORT` |

4. Add environment variable:

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

Replace with your actual backend URL (Step 3).

5. Click **Deploy** and wait for the build to finish.

---

## Step 3 — Deploy the backend (API)

The frontend cannot work without the API. Deploy a **second Node.js app** (e.g. on `api.yourdomain.com`):

1. **Websites → Add Website → Node.js Apps → Import Git Repository**
2. Select the same repo

| Setting | Value |
|---------|-------|
| **Root directory** | `backend` |
| **Node.js version** | `20` |
| **Install command** | `npm ci` |
| **Build command** | `npm run build` |
| **Start command** | `npm run start` |
| **Entry file** | `dist/index.js` |

3. Environment variables:

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/buildwise
JWT_SECRET=your-long-random-secret
FRONTEND_URL=https://yourdomain.com
OPENAI_API_KEY=sk-...   (optional)
UPLOAD_DIR=./uploads
```

4. After deploy, seed the retail catalog (run once via SSH or Hostinger terminal if available):

```bash
npm run seed
```

5. Verify: `https://api.yourdomain.com/api/health` should return `{"status":"ok",...}`

---

## Step 4 — Fix CORS

`FRONTEND_URL` on the backend must exactly match your live site URL (including `https://`). For multiple domains, use comma-separated values:

```
FRONTEND_URL=https://yourdomain.com,https://www.yourdomain.com
```

---

## If you already deployed the wrong way

1. **Remove** the current website from hPanel (download a backup first if needed)
2. Re-add it as **Node.js Apps**, not regular hosting
3. Redeploy with the settings above

Also try in hPanel: **Fix File Ownership** (sets folders to 755, files to 644) if permissions were corrupted.

---

## Quick checklist

- [ ] Using **Node.js Apps** (Business/Cloud plan), not regular hosting
- [ ] Frontend root = `frontend` (or root with updated build scripts)
- [ ] Start command includes `-p $PORT`
- [ ] `NEXT_PUBLIC_API_URL` points to live backend
- [ ] Backend deployed separately with MongoDB Atlas URI
- [ ] `FRONTEND_URL` on backend matches your domain
- [ ] `/api/health` returns OK on backend URL

## Local vs production

| | Local | Production |
|---|-------|------------|
| Frontend | http://localhost:3000 | https://yourdomain.com |
| Backend | http://localhost:4000 | https://api.yourdomain.com |
| MongoDB | localhost / Docker | MongoDB Atlas |
