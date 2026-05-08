# Samtur Page - Agent Instructions

## Commands
- `npm run dev` - Start Vite dev server (default port 5173)
- `npm run build` - Run `tsc` typecheck, then `vite build`
- `npm run preview` - Preview production build

## Tech Stack
- React 19 + TypeScript + Vite
- Tailwind CSS (configured in `tailwind.config.js`)
- React Router for routing
- Recharts for charts
- Lucide React + React Icons for icons
- `react-tailwindcss-datepicker` for date picking

## Architecture
- Entry: `src/main.tsx` → `src/App.tsx`
- Route order: `/login` → `/` (Dashboard) → `/stats` → `/sales` → `/clients` → `/itineraries` → `/users` → `/config`
- `/users` and `/config` require admin role
- Auth: `src/context/AuthContext.tsx` - manages login state via localStorage
- Data: `src/context/DataContext.tsx` - provides mock data
- Permissions: `src/context/PermissionsContext.tsx` - role-based access

## Key Directories
- `src/pages/` - Page components (Dashboard, Sales, Clients, Itineraries, Users, Config, StatsView, Login)
- `src/components/ui/` - Reusable UI (Button, Card, Modal, Table, Form, Badge)
- `src/components/layout/` - Layout, Header, Sidebar
- `src/components/dashboard/` - Dashboard widgets (KPICard, TrendChart, SalesTable, RecentBookings, etc.)
- `src/components/sales/` - Sales-specific components (NewSaleWizard)
- `src/data/mockData.ts` - Mock data source
- `src/utils/` - Utilities (kpCalculator, formatters, creditUtils)
- `public/` - Static assets (logo_samtur.png)

## Design System
- Primary: `#102846` (dark blue)
- Accent: `#f2892f` (orange)
- Font: Poppins (headings), Inter (body)
- Tailwind content includes `node_modules/react-tailwindcss-datepicker/dist/index.esm.js`

## TypeScript Config
- Strict mode is **disabled** (`strict: false`)
- `noUnusedLocals` and `noUnusedParameters` are **disabled**
- Do not expect strict type checking behavior

## Notes
- Mock data only - no real backend integration
- Spanish-language travel agency dashboard
- Login persists via localStorage
- No test framework configured
- `step143_content.txt` in root is likely test/development artifact