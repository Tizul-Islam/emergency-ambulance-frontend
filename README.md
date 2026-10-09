# Emergency Ambulance Dispatch — Frontend

Next.js App Router frontend for the Emergency Ambulance Dispatch System. Connects to the real backend API only (no mock workflow data).

## Tech stack

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn-style UI components
- TanStack Query (client cache/mutations)
- Zustand (UI state — mobile sidebar)
- React Hook Form + Zod
- Axios API client (browser proxy + server modules)
- Leaflet / React Leaflet (maps)
- Recharts (analytics)
- Sonner (toasts)
- JWT middleware route protection

## Setup

```bash
npm install
cp .env.example .env.local   # or create .env.local manually
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
JWT_ACCESS_SECRET=<same as backend JWT_ACCESS_SECRET>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Ensure the backend is running on port 5000 with CORS allowing the frontend origin.

## Verified demo credentials

Password for all accounts: `Password123!`

| Role | Email |
|------|-------|
| ADMIN | admin@dispatch.com |
| DISPATCHER | dispatcher1@dispatch.com |
| PATIENT | patient1@dispatch.com |

Use the three **Quick Demo Login** buttons on `/login` for one-click evaluator access.

## Routes

| Route | Description |
|-------|-------------|
| `/login` | Login + demo buttons |
| `/register` | Patient registration |
| `/dashboard` | Role-based dashboard |
| `/emergencies` | Emergency list / dispatcher queue |
| `/emergencies/create` | Create emergency (patient) |
| `/emergencies/[id]` | Emergency details + timeline + map |
| `/ambulances` | Ambulance fleet |
| `/dispatches` | Dispatch monitoring |
| `/hospitals` | Hospital directory |
| `/trips` | Trip records |
| `/payments` | Payment history / pay now |
| `/payments/success` | Stripe success return |
| `/payments/cancel` | Stripe cancel return |
| `/notifications` | Notification history |
| `/analytics` | Admin analytics + user management |
| `/profile` | Profile view/edit |

## Scripts

```bash
npm run dev      # development
npm run build    # production build
npm run start    # production server
npm run lint     # ESLint
```

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables (`NEXT_PUBLIC_API_BASE_URL`, `JWT_ACCESS_SECRET`, `NEXT_PUBLIC_APP_URL`)
4. Deploy and verify login, role routes, and Stripe test checkout
