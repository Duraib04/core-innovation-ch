# Energy Meter Power Monitoring System - Backend

Express.js REST API server for power meter data management.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start server
npm start

# Or use the start script
./start-backend.sh
```

The backend will be available at: `http://localhost:3001`

## 📁 Project Structure

```
backend/
├── server.js           # Main Express server
├── db.js              # PostgreSQL connection pool
├── test-db.js         # Database connection test
├── .env               # Environment variables
└── start-backend.sh   # Server startup script
```

## 🔧 Configuration

### Environment Variables (`.env`)

```bash
DB_HOST=localhost          # Your PostgreSQL host
DB_PORT=5432              # Your PostgreSQL port
DB_NAME=your_db_name      # Your database name
DB_USER=your_db_user      # Your database username
DB_PASSWORD=your_password # Your database password
```

## 📡 API Endpoints

### Meters

- `GET /api/health` - Health check
- `GET /api/meters` - Get all unique meter IDs
- `GET /api/meters/all/latest` - Get latest readings for all meters
- `GET /api/meters/:meterId/latest` - Get latest reading for specific meter
- `GET /api/meters/:meterId/stats` - Get meter statistics
- `GET /api/meters/:meterId/realtime` - Get last 10 readings

### Reports

- `GET /api/reports` - Get filtered report data
  - Query params: `meterId`, `fromDate`, `toDate`, `page`, `limit`
  - Returns paginated results with date range filtering

## 🗄️ Database

- **Type**: PostgreSQL
- **Table**: `powermeter_readings`
- **Date Format**: DD-MM-YYYY (stored as TEXT)
- **Columns**: 30+ fields including voltage, current, power, energy metrics

### Key Features

- Date format conversion (YYYY-MM-DD to DD-MM-YYYY)
- Proper datetime sorting for text-based dates
- Pagination support
- Date range validation (2025-01-01 to today)
- CORS enabled for frontend access

## 🛠️ Available Scripts

- `npm start` - Start server with nodemon (auto-restart)
- `node test-db.js` - Test database connection

## 📝 Notes

- Auto-restarts on file changes (nodemon)
- Logs all database queries
- Validates date ranges before querying
- Returns proper error messages for invalid requests

## 🔒 Security

- CORS enabled for frontend origin
- Input validation for date ranges
- SQL injection protection via parameterized queries
- Error handling middleware

## 📊 Database Schema

The `powermeter_readings` table contains real-time power meter data with fields for:
- Voltage (VLL, VLN per phase)
- Current (per phase)
- Power (active, reactive per phase)
- Energy consumption
- Power factor
- Load percentage
- Timestamps
