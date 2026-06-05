# Ethixweb Site

Official website for [Ethixweb](https://ethixweb.com) — a digital operations agency specializing in websites, AI automation, CRM integrations, SEO, and digital marketing for US-based businesses.

## Tech Stack

- **Framework** — [TanStack Start](https://tanstack.com/start) (React + Vite)
- **Styling** — [Tailwind CSS v4](https://tailwindcss.com)
- **Animations** — [Framer Motion](https://www.framer.com/motion)
- **UI Components** — [Radix UI](https://www.radix-ui.com)
- **Icons** — [Lucide React](https://lucide.dev)
- **Deployment** — [Vercel](https://vercel.com)

## Prerequisites

- Node.js **v20.19+** or **v22.12+**
- npm **v10+**

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

## Deploy to Vercel

### Option 1 — Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option 2 — Vercel Dashboard

1. Push this repository to GitHub / GitLab / Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Vite — no extra config needed.
4. Click **Deploy**.

### Vercel Settings (if needed)

| Setting          | Value           |
| ---------------- | --------------- |
| Framework Preset | Vite            |
| Build Command    | `npm run build` |
| Output Directory | `dist`          |
| Install Command  | `npm install`   |
| Node.js Version  | 22.x            |

## Scripts

| Command             | Description                      |
| ------------------- | -------------------------------- |
| `npm run dev`       | Start dev server                 |
| `npm run build`     | Production build                 |
| `npm run preview`   | Preview production build locally |
| `npm run typecheck` | TypeScript type check            |
| `npm run lint`      | Lint code                        |
| `npm run format`    | Format code with Prettier        |

## Environment Variables

No required environment variables for the base site. If integrating with external services, create a `.env` file:

```env
# Example — add as needed
VITE_API_URL=https://api.example.com
```

Add the same variables in **Vercel Dashboard → Project → Settings → Environment Variables**.
