import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Get all unique meter IDs
app.get('/api/meters', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT DISTINCT meter_id FROM powermeter_readings ORDER BY meter_id'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching meters:', error);
    res.status(500).json({ error: 'Failed to fetch meters' });
  }
});

// Get latest readings for all meters (must be before /:meterId/latest)
app.get('/api/meters/all/latest', async (req, res) => {
  try {
    // Since date is stored as text in DD-MM-YYYY format, we need to convert it for proper sorting
    const result = await pool.query(
      `SELECT DISTINCT ON (meter_id) *
       FROM powermeter_readings
       ORDER BY meter_id,
                to_timestamp(
                  concat(
                    split_part(date, '-', 3), '-',
                    split_part(date, '-', 2), '-',
                    split_part(date, '-', 1), ' ',
                    time
                  ),
                  'YYYY-MM-DD HH24:MI:SS'
                ) DESC`
    );
    console.log(`✅ Fetched latest readings for ${result.rows.length} meters`);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all latest readings:', error);
    res.status(500).json({ error: 'Failed to fetch latest readings' });
  }
});

// Get latest reading for a specific meter
app.get('/api/meters/:meterId/latest', async (req, res) => {
  try {
    const { meterId } = req.params;
    // Since date is stored as text in DD-MM-YYYY format, we need to convert it for proper sorting
    const result = await pool.query(
      `SELECT * FROM powermeter_readings 
       WHERE meter_id = $1 
       ORDER BY to_timestamp(
                  concat(
                    split_part(date, '-', 3), '-',
                    split_part(date, '-', 2), '-',
                    split_part(date, '-', 1), ' ',
                    time
                  ),
                  'YYYY-MM-DD HH24:MI:SS'
                ) DESC
       LIMIT 1`,
      [meterId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No data found for this meter' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching latest reading:', error);
    res.status(500).json({ error: 'Failed to fetch latest reading' });
  }
});

// Helper function to convert YYYY-MM-DD to DD-MM-YYYY
function convertDateFormat(dateString) {
  if (!dateString) return null;
  // Input: YYYY-MM-DD, Output: DD-MM-YYYY
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateString;
}

// Get historical data for reports with date range and meter filter
app.get('/api/reports', async (req, res) => {
  try {
    const { meterId, fromDate, toDate, page = 1, limit = 50 } = req.query;
    
    // Validate dates
    const minDate = '2025-01-01';
    const maxDate = new Date().toISOString().split('T')[0]; // Today's date
    
    if (fromDate && fromDate < minDate) {
      return res.status(400).json({ 
        error: `From date cannot be before ${minDate}` 
      });
    }
    
    if (toDate && toDate > maxDate) {
      return res.status(400).json({ 
        error: `To date cannot be after today (${maxDate})` 
      });
    }
    
    if (fromDate && toDate && fromDate > toDate) {
      return res.status(400).json({ 
        error: 'From date cannot be after to date' 
      });
    }
    
    // Convert dates from YYYY-MM-DD to DD-MM-YYYY format for database query
    const dbFromDate = fromDate ? convertDateFormat(fromDate) : null;
    const dbToDate = toDate ? convertDateFormat(toDate) : null;
    
    console.log('📅 Date conversion:', { 
      originalFrom: fromDate, 
      dbFrom: dbFromDate,
      originalTo: toDate,
      dbTo: dbToDate
    });
    
    let query = 'SELECT * FROM powermeter_readings WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (meterId) {
      query += ` AND meter_id = $${paramIndex}`;
      params.push(meterId);
      paramIndex++;
    }

    if (dbFromDate) {
      // Convert DD-MM-YYYY text to date for proper comparison
      query += ` AND TO_DATE(date, 'DD-MM-YYYY') >= TO_DATE($${paramIndex}, 'DD-MM-YYYY')`;
      params.push(dbFromDate);
      paramIndex++;
    }

    if (dbToDate) {
      // Convert DD-MM-YYYY text to date for proper comparison
      query += ` AND TO_DATE(date, 'DD-MM-YYYY') <= TO_DATE($${paramIndex}, 'DD-MM-YYYY')`;
      params.push(dbToDate);
      paramIndex++;
    }

    query += ' ORDER BY TO_DATE(date, \'DD-MM-YYYY\') DESC, time DESC';
    
    // Add pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), offset);

    console.log('🔍 Query:', query);
    console.log('🔍 Params:', params);

    const result = await pool.query(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM powermeter_readings WHERE 1=1';
    const countParams = [];
    let countParamIndex = 1;

    if (meterId) {
      countQuery += ` AND meter_id = $${countParamIndex}`;
      countParams.push(meterId);
      countParamIndex++;
    }

    if (dbFromDate) {
      // Convert DD-MM-YYYY text to date for proper comparison
      countQuery += ` AND TO_DATE(date, 'DD-MM-YYYY') >= TO_DATE($${countParamIndex}, 'DD-MM-YYYY')`;
      countParams.push(dbFromDate);
      countParamIndex++;
    }

    if (dbToDate) {
      // Convert DD-MM-YYYY text to date for proper comparison
      countQuery += ` AND TO_DATE(date, 'DD-MM-YYYY') <= TO_DATE($${countParamIndex}, 'DD-MM-YYYY')`;
      countParams.push(dbToDate);
    }

    const countResult = await pool.query(countQuery, countParams);
    const totalRecords = parseInt(countResult.rows[0].count);

    console.log('✅ Found records:', totalRecords);

    res.json({
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalRecords,
        totalPages: Math.ceil(totalRecords / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching report data:', error);
    res.status(500).json({ error: 'Failed to fetch report data' });
  }
});

// Get meter statistics
app.get('/api/meters/:meterId/stats', async (req, res) => {
  try {
    const { meterId } = req.params;
    const { fromDate, toDate } = req.query;

    let query = `
      SELECT 
        meter_id,
        COUNT(*) as total_readings,
        AVG(total_active_power_kw) as avg_power,
        MAX(total_active_power_kw) as max_power,
        MIN(total_active_power_kw) as min_power,
        AVG(vll_avg) as avg_voltage,
        AVG(iavg) as avg_current,
        AVG(pf_avg) as avg_power_factor,
        AVG(percent_average_load) as avg_load,
        MAX(total_active_energy_kwh) as total_energy
      FROM powermeter_readings
      WHERE meter_id = $1
    `;

    const params = [meterId];
    let paramIndex = 2;

    if (fromDate) {
      query += ` AND date >= $${paramIndex}`;
      params.push(fromDate);
      paramIndex++;
    }

    if (toDate) {
      query += ` AND date <= $${paramIndex}`;
      params.push(toDate);
      paramIndex++;
    }

    query += ' GROUP BY meter_id';

    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No data found for this meter' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching meter statistics:', error);
    res.status(500).json({ error: 'Failed to fetch meter statistics' });
  }
});

// Get real-time data stream (last 10 readings)
app.get('/api/meters/:meterId/realtime', async (req, res) => {
  try {
    const { meterId } = req.params;
    const result = await pool.query(
      `SELECT * FROM powermeter_readings 
       WHERE meter_id = $1 
       ORDER BY date DESC, time DESC 
       LIMIT 10`,
      [meterId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching real-time data:', error);
    res.status(500).json({ error: 'Failed to fetch real-time data' });
  }
});

// Get hourly analytics for a specific meter and date
app.get('/api/analytics/hourly/:meterId', async (req, res) => {
  try {
    const { meterId } = req.params;
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required (format: YYYY-MM-DD)' });
    }
    
    // Convert YYYY-MM-DD to DD-MM-YYYY for database query
    const dbDate = convertDateFormat(date);
    
    console.log('📊 Fetching hourly analytics:', { meterId, date, dbDate });
    
    // Query to get the last reading for each hour of the specified date
    const result = await pool.query(
      `SELECT DISTINCT ON (hour_part)
        SUBSTR(time::TEXT, 1, 2) as hour_part,
        time,
        todays_consumption_kwh,
        total_active_power_kw,
        percent_average_load,
        units_consumed
       FROM powermeter_readings
       WHERE meter_id = $1 AND date = $2
       ORDER BY hour_part,
                to_timestamp(
                  concat(
                    split_part(date, '-', 3), '-',
                    split_part(date, '-', 2), '-',
                    split_part(date, '-', 1), ' ',
                    time
                  ),
                  'YYYY-MM-DD HH24:MI:SS'
                ) DESC`,
      [meterId, dbDate]
    );
    
    // Only return hours that have actual data (don't fill with zeros)
    const hourlyData = result.rows.map(row => ({
      hour: `${row.hour_part}:00`,
      consumption: parseFloat(row.todays_consumption_kwh) || 0,
      peakLoad: parseFloat(row.total_active_power_kw) || 0,
      avgLoad: parseFloat(row.percent_average_load) || 0,
      unitsConsumed: parseFloat(row.units_consumed) || 0
    }));
    
    console.log(`✅ Fetched hourly data: ${result.rows.length} hours with data`);
    res.json(hourlyData);
  } catch (error) {
    console.error('Error fetching hourly analytics:', error);
    res.status(500).json({ error: 'Failed to fetch hourly analytics' });
  }
});

// Get weekly analytics for a specific meter (last 7 days)
app.get('/api/analytics/weekly/:meterId', async (req, res) => {
  try {
    const { meterId } = req.params;
    
    console.log('📊 Fetching weekly analytics:', { meterId });
    
    // Get last 7 days of data
    const weeklyData = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
      const dbDate = convertDateFormat(dateStr); // DD-MM-YYYY
      
      // Get the last reading for this date
      const result = await pool.query(
        `SELECT 
          date,
          time,
          todays_consumption_kwh,
          units_consumed
         FROM powermeter_readings
         WHERE meter_id = $1 AND date = $2
         ORDER BY to_timestamp(
                    concat(
                      split_part(date, '-', 3), '-',
                      split_part(date, '-', 2), '-',
                      split_part(date, '-', 1), ' ',
                      time
                    ),
                    'YYYY-MM-DD HH24:MI:SS'
                  ) DESC
         LIMIT 1`,
        [meterId, dbDate]
      );
      
      const dayLabel = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      
      if (result.rows.length > 0) {
        const row = result.rows[0];
        weeklyData.push({
          day: dayLabel,
          date: dateStr,
          consumption: parseFloat(row.todays_consumption_kwh) || 0,
          units: parseFloat(row.units_consumed) || 0
        });
      } else {
        weeklyData.push({
          day: dayLabel,
          date: dateStr,
          consumption: 0,
          units: 0
        });
      }
    }
    
    console.log(`✅ Fetched weekly data: ${weeklyData.length} days`);
    res.json(weeklyData);
  } catch (error) {
    console.error('Error fetching weekly analytics:', error);
    res.status(500).json({ error: 'Failed to fetch weekly analytics' });
  }
});

// Get monthly analytics for a specific meter (last 30 days)
app.get('/api/analytics/monthly/:meterId', async (req, res) => {
  try {
    const { meterId } = req.params;
    
    console.log('📊 Fetching monthly analytics:', { meterId });
    
    // Get last 30 days of data
    const monthlyData = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
      const dbDate = convertDateFormat(dateStr); // DD-MM-YYYY
      
      // Get the last reading for this date (for past days, this is end of day value)
      // For current day, this is the most recent value
      const result = await pool.query(
        `SELECT 
          date,
          time,
          todays_consumption_kwh,
          units_consumed
         FROM powermeter_readings
         WHERE meter_id = $1 AND date = $2
         ORDER BY to_timestamp(
                    concat(
                      split_part(date, '-', 3), '-',
                      split_part(date, '-', 2), '-',
                      split_part(date, '-', 1), ' ',
                      time
                    ),
                    'YYYY-MM-DD HH24:MI:SS'
                  ) DESC
         LIMIT 1`,
        [meterId, dbDate]
      );
      
      const dayLabel = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      
      if (result.rows.length > 0) {
        const row = result.rows[0];
        monthlyData.push({
          day: dayLabel,
          date: dateStr,
          consumption: parseFloat(row.todays_consumption_kwh) || 0,
          units: parseFloat(row.units_consumed) || 0
        });
      } else {
        monthlyData.push({
          day: dayLabel,
          date: dateStr,
          consumption: 0,
          units: 0
        });
      }
    }
    
    console.log(`✅ Fetched monthly data: ${monthlyData.length} days`);
    res.json(monthlyData);
  } catch (error) {
    console.error('Error fetching monthly analytics:', error);
    res.status(500).json({ error: 'Failed to fetch monthly analytics' });
  }
});

// Get last 60 days analytics for a specific meter
app.get('/api/analytics/last60days/:meterId', async (req, res) => {
  try {
    const { meterId } = req.params;
    
    console.log('📊 Fetching last 60 days analytics:', { meterId });
    
    // Get last 60 days of data
    const last60DaysData = [];
    const today = new Date();
    
    for (let i = 59; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
      const dbDate = convertDateFormat(dateStr); // DD-MM-YYYY
      
      // Get the last reading for this date (for past days, this is end of day value)
      // For current day, this is the most recent value
      const result = await pool.query(
        `SELECT 
          date,
          time,
          todays_consumption_kwh,
          units_consumed
         FROM powermeter_readings
         WHERE meter_id = $1 AND date = $2
         ORDER BY to_timestamp(
                    concat(
                      split_part(date, '-', 3), '-',
                      split_part(date, '-', 2), '-',
                      split_part(date, '-', 1), ' ',
                      time
                    ),
                    'YYYY-MM-DD HH24:MI:SS'
                  ) DESC
         LIMIT 1`,
        [meterId, dbDate]
      );
      
      const dayLabel = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      
      if (result.rows.length > 0) {
        const row = result.rows[0];
        last60DaysData.push({
          day: dayLabel,
          date: dateStr,
          consumption: parseFloat(row.todays_consumption_kwh) || 0,
          units: parseFloat(row.units_consumed) || 0
        });
      } else {
        last60DaysData.push({
          day: dayLabel,
          date: dateStr,
          consumption: 0,
          units: 0
        });
      }
    }
    
    console.log(`✅ Fetched last 60 days data: ${last60DaysData.length} days`);
    res.json(last60DaysData);
  } catch (error) {
    console.error('Error fetching last 60 days analytics:', error);
    res.status(500).json({ error: 'Failed to fetch last 60 days analytics' });
  }
});

// Get custom date range analytics for a specific meter (monthly aggregation)
app.get('/api/analytics/custom/:meterId', async (req, res) => {
  try {
    const { meterId } = req.params;
    const { fromDate, toDate } = req.query; // Expected format: YYYY-MM-DD
    
    if (!fromDate || !toDate) {
      return res.status(400).json({ 
        error: 'Both fromDate and toDate parameters are required (format: YYYY-MM-DD)' 
      });
    }
    
    console.log('📊 Fetching custom analytics:', { meterId, fromDate, toDate });
    
    const customData = [];
    const today = new Date();
    const currentMonth = today.getMonth(); // 0-11
    const currentYear = today.getFullYear();
    
    // Parse from and to dates
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);
    
    // Get the start month/year and end month/year
    const startMonth = fromDateObj.getMonth();
    const startYear = fromDateObj.getFullYear();
    const endMonth = toDateObj.getMonth();
    const endYear = toDateObj.getFullYear();
    
    // Loop through each month in the range
    let currentDate = new Date(startYear, startMonth, 1);
    
    while (currentDate <= toDateObj) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const monthName = currentDate.toLocaleDateString('en-US', { month: 'short' });
      
      // Determine the date range for this month
      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);
      
      // Adjust for the selected range
      const rangeStart = (year === startYear && month === startMonth) ? fromDateObj : firstDayOfMonth;
      const rangeEnd = (year === endYear && month === endMonth) ? toDateObj : lastDayOfMonth;
      
      let totalConsumption = 0;
      let totalUnits = 0;
      
      // Check if this is the current month
      const isCurrentMonth = (year === currentYear && month === currentMonth);
      
      // Loop through each day in the month range
      let dayDate = new Date(rangeStart);
      while (dayDate <= rangeEnd) {
        const dayStr = dayDate.toISOString().split('T')[0];
        const dbDate = convertDateFormat(dayStr);
        
        // Get the last reading for this day
        const result = await pool.query(
          `SELECT 
            todays_consumption_kwh,
            units_consumed
           FROM powermeter_readings
           WHERE meter_id = $1 AND date = $2
           ORDER BY to_timestamp(
                      concat(
                        split_part(date, '-', 3), '-',
                        split_part(date, '-', 2), '-',
                        split_part(date, '-', 1), ' ',
                        time
                      ),
                      'YYYY-MM-DD HH24:MI:SS'
                    ) DESC
           LIMIT 1`,
          [meterId, dbDate]
        );
        
        if (result.rows.length > 0) {
          const row = result.rows[0];
          totalConsumption += parseFloat(row.todays_consumption_kwh) || 0;
          totalUnits += parseFloat(row.units_consumed) || 0;
        }
        
        // Move to next day
        dayDate.setDate(dayDate.getDate() + 1);
      }
      
      customData.push({
        month: monthName,
        year: year,
        consumption: totalConsumption,
        units: totalUnits,
        isCurrentMonth: isCurrentMonth
      });
      
      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    console.log(`✅ Fetched custom data: ${customData.length} months`);
    res.json(customData);
  } catch (error) {
    console.error('Error fetching custom analytics:', error);
    res.status(500).json({ error: 'Failed to fetch custom analytics' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});
