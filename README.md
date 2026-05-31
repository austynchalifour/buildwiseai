# BuildWise AI

Upload a sketch of what you want to build and instantly receive a complete material list, cost estimate, shopping cart, and step-by-step construction plan.

**Repository:** [github.com/austynchalifour/buildwiseai](https://github.com/austynchalifour/buildwiseai)

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB (Mongoose) |
| AI | OpenAI GPT-4o (optional — mock fallback included) |
| PDF | PDFKit |

## MVP Features

- Upload sketch / photo / description
- AI project identification & dimension estimation
- Material list with waste factors
- Cost estimation (materials, labor, permits, regional pricing)
- Home Depot & Lowe's product matching
- Step-by-step build instructions with phases
- PDF export (Pro tier)
- Free tier: 3 projects/month

## Quick Start

### Prerequisites

- Node.js 18+
- Docker (for MongoDB)

### 1. Start MongoDB

**Option A — Docker:**

```bash
docker compose up -d
```

**Option B — Local MongoDB:** Install [MongoDB Community Server](https://www.mongodb.com/try/download/community) and ensure it is running on `mongodb://localhost:27017`.

**Option C — MongoDB Atlas:** Create a free cluster and set `MONGODB_URI` in `backend/.env`.

### 2. Install dependencies

```bash
npm run install:all
```

### 3. Configure environment

```bash
cp .env.example .env
# or: cp backend/.env.example backend/.env
```

Edit `.env` or `backend/.env` and set `MONGODB_URI`. Optionally set `OPENAI_API_KEY`.

### 4. Seed retail catalog

```bash
npm run seed
```

### 5. Run the app

```bash
npm install
npm install --prefix frontend
npm run dev
```

- **UI:** http://localhost:3000  
- **API:** http://localhost:4000  

Production-style single port: `npm run dev:unified` → http://localhost:3000

## Project Structure

```
BuildWise/
├── server/           # Unified Express + Next.js entry
├── backend/src/      # API routes, models, services
├── frontend/         # Next.js UI
└── package.json      # Single deploy target
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Current user |
| GET | `/api/projects` | List projects |
| POST | `/api/projects` | Create project (multipart) |
| POST | `/api/projects/:id/analyze` | Run AI analysis |
| GET | `/api/projects/:id/pdf` | Export PDF (Pro) |
| DELETE | `/api/projects/:id` | Delete project |

## Tiers

- **Free**: 3 projects/month, cost estimate, material list
- **Pro** ($19/mo): Unlimited projects, PDF exports, advanced plans

To test Pro features, update a user's tier in MongoDB:

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { tier: "pro" } })
```

## License

MIT

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md). **One Node.js app** on Hostinger — root directory `.`, build `npm run build`, start `npm run start`.
