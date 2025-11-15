# Energy Meter Power Monitoring System - Frontend

React + TypeScript + Vite application for real-time energy monitoring dashboard.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at: `http://localhost:8080`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components (Dashboard, Reports, Devices, etc.)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities and API client
│   └── contexts/       # React contexts
├── public/             # Static assets
└── index.html          # Entry HTML file
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server (port 8080)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Environment Variables (`.env`)

```bash
VITE_API_URL=http://localhost:3001/api
```

### Vite Config (`vite.config.ts`)

- Port: 8080
- Host: `::`  (accessible from network)
- Allowed hosts configured for Cloudflare tunnels

## 📊 Main Features

- **Dashboard**: Real-time energy metrics and phase-wise consumption
- **Reports**: Downloadable Excel reports with date filtering
- **Devices**: Device status and monitoring
- **Energy Analytics**: Charts and consumption analysis

## 🎨 Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **TailwindCSS** for styling
- **Shadcn/ui** for UI components
- **Recharts** for data visualization
- **React Router** for navigation

## 🔌 API Integration

The frontend connects to the backend API at `http://localhost:3001/api`. Make sure the backend server is running before starting the frontend.

## 📝 Notes

- Auto-refreshes data every 30 seconds
- Responsive design for mobile and desktop
- Dark/Light theme support
- Real-time meter status indicators
