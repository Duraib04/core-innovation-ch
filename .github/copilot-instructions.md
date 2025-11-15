# Smart Energy Analytics - AI Coding Agent Instructions

## Architecture Overview

This is a 3-tier energy monitoring system for IoT power meters with Docker deployment:

- **Backend**: Express.js REST API (port 3001) with PostgreSQL connection pooling
- **Frontend**: React + TypeScript + Vite SPA (port 8080) with shadcn/ui components
- **Database**: PostgreSQL 16 with `powermeter_readings` table storing real-time energy data
- **Deployment**: Docker Compose orchestration with health checks and service dependencies

### Key Data Flow
1. Power meter readings arrive in PostgreSQL (`powermeter_readings` table)
2. Backend serves readings via REST endpoints with date conversion logic (DB uses DD-MM-YYYY format)
3. Frontend polls via React Query hooks (`useMeterData`) and displays in real-time dashboard
4. Authentication is client-side only (localStorage/sessionStorage) with default users

## Critical Developer Workflows

### Local Development
```bash
# Backend (runs on 3001)
cd backend
npm install
npm start  # or ./start-backend.sh

# Frontend (runs on 8080)
cd frontend
npm install
npm run dev
```

### Docker Deployment
```bash
# Full stack with PostgreSQL
docker-compose up -d

# Backend env vars must match postgres service in docker-compose.yml
# Frontend build requires VITE_API_URL arg for production API endpoint
```

### Environment Setup
- **Backend** requires `.env` with: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- **Frontend** uses `VITE_API_URL` (defaults to `http://localhost:3001/api`)
- Docker Compose hardcodes credentials: `DB_USER=cubeaiiot`, `DB_PASSWORD=asd321`, `DB_NAME=smart_energy`

## Project-Specific Conventions

### Date Handling Quirk (CRITICAL)
The database stores dates as **DD-MM-YYYY text strings**, not DATE types. All queries must convert:
```javascript
// Backend pattern for date filtering
TO_DATE(date, 'DD-MM-YYYY') >= TO_DATE($1, 'DD-MM-YYYY')

// Helper function converts user input (YYYY-MM-DD) to DB format (DD-MM-YYYY)
function convertDateFormat(dateString) { /* see backend/server.js:91 */ }
```

Frontend date pickers use YYYY-MM-DD but must be converted before API calls.

### Database Schema (powermeter_readings)
Key columns: `meter_id` (text), `date` (text DD-MM-YYYY), `time` (text HH:MM:SS), voltage fields (`vll_avg`, `vln_avg`, `v1_n`, `v2_n`, `v3_n`), current (`i1`, `i2`, `i3`, `iavg`), power (`total_active_power_kw`, `p1_active_kw`, etc.), energy (`forward_active_energy_kwh`, `todays_consumption_kwh`, `units_consumed`), load percentages, power factor.

### API Endpoint Patterns
- Routes are ordered in `server.js` - specific routes **before** parameterized ones (e.g., `/meters/all/latest` before `/meters/:meterId/latest`)
- All endpoints use async/await with try-catch error handling
- Responses include descriptive error messages: `{ error: 'descriptive message' }`
- Complex queries use parameterized SQL with `$1, $2...` placeholders (PostgreSQL node-pg pattern)

### Frontend Component Structure
- **UI Components**: `frontend/src/components/ui/` contains shadcn/ui primitives (button, card, etc.) - never edit these directly
- **Custom Components**: `frontend/src/components/` (MetricCard, PhaseCard, MeterSelection, etc.)
- **Pages**: `frontend/src/pages/` (Dashboard, Reports, Analytics, etc.)
- **Hooks**: `useMeterData` (global meter state), `useNotifications` (alerts), located in `frontend/src/hooks/`
- **Contexts**: `AuthContext` provides client-side auth with hardcoded users (admin@gmail.com/admin@123, user@gmail.com/user@123)

### State Management
- **Global Meter Data**: `MeterDataContext` in `useMeterData.tsx` provides real-time readings with auto-refresh
- **Meter Mapping**: `meterNameMapping` object maps meter IDs to display names/locations (e.g., "Meter-001" → "Main Panel")
- **Auth State**: Stored in localStorage (remember me) or sessionStorage, managed by `AuthContext`

### Styling Conventions
- Tailwind CSS with custom energy theme colors (see `tailwind.config.ts`)
- Responsive grids: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` pattern for metric cards
- Icon usage: lucide-react icons imported per component (Zap, Activity, Gauge, etc.)

## Integration Points

### Backend → Database
- Connection pool in `backend/db.js` with 20 max connections, 30s idle timeout
- Pool emits 'connect' and 'error' events for monitoring
- Test connection: `node test-db.js`

### Frontend → Backend API
- API client in `frontend/src/lib/api.ts` with typed interfaces (`PowerMeterReading`, `ReportResponse`, etc.)
- Base URL from `import.meta.env.VITE_API_URL`
- React Query hooks abstract polling logic (5-second refresh rates in `useMeterData`)

### Docker Service Dependencies
- Backend `depends_on` postgres with `service_healthy` condition
- Frontend `depends_on` backend (no health condition)
- Health checks use wget for HTTP endpoints

## Common Gotchas

1. **Date queries fail silently** if you forget `TO_DATE(date, 'DD-MM-YYYY')` conversion
2. **Route ordering matters** in Express - specific routes must come before generic `:param` routes
3. **Auth is mock** - no backend validation, all user management is frontend localStorage
4. **Build args required** for Docker frontend: `docker build --build-arg VITE_API_URL=<url>`
5. **PostgreSQL healthcheck** required before backend starts (see docker-compose.yml dependencies)
6. **Meter IDs are strings** not integers - use `meter_id = $1` not numeric comparisons

## Key Files Reference

- `backend/server.js` - All API routes and date conversion logic
- `backend/db.js` - PostgreSQL connection pool configuration
- `frontend/src/hooks/useMeterData.tsx` - Global meter state and real-time polling
- `frontend/src/lib/api.ts` - TypeScript interfaces for API responses
- `frontend/src/contexts/AuthContext.tsx` - Client-side auth with default users
- `docker-compose.yml` - Service orchestration with health checks
- `frontend/vite.config.ts` - Dev server config (port 8080, host `::`)