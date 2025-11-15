import pool from './db.js';

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...\n');

    // Test basic connection
    const client = await pool.connect();
    console.log('✅ Database connection successful!\n');

    // Test if table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'powermeter_readings'
      );
    `);

    if (tableCheck.rows[0].exists) {
      console.log('✅ Table "powermeter_readings" exists\n');

      // Get table info
      const countResult = await client.query('SELECT COUNT(*) FROM powermeter_readings');
      console.log(`📊 Total records: ${countResult.rows[0].count}\n`);

      // Get unique meters
      const metersResult = await client.query('SELECT DISTINCT meter_id FROM powermeter_readings ORDER BY meter_id');
      console.log('📋 Available meters:');
      metersResult.rows.forEach(row => {
        console.log(`   - ${row.meter_id}`);
      });
      console.log('');

      // Get latest reading
      const latestResult = await client.query(`
        SELECT meter_id, date, time, total_active_power_w, vll_avg_l_l, pf_avg
        FROM powermeter_readings
        ORDER BY date DESC, time DESC
        LIMIT 1
      `);

      if (latestResult.rows.length > 0) {
        const latest = latestResult.rows[0];
        console.log('🕐 Latest reading:');
        console.log(`   Meter: ${latest.meter_id}`);
        console.log(`   Date/Time: ${latest.date} ${latest.time}`);
        console.log(`   Power: ${latest.total_active_power_w} W`);
        console.log(`   Voltage: ${latest.vll_avg_l_l} V`);
        console.log(`   Power Factor: ${latest.pf_avg}`);
      }
    } else {
      console.log('❌ Table "powermeter_readings" does not exist');
      console.log('Please create the table using the schema provided in the documentation.');
    }

    client.release();
    console.log('\n✨ Test completed successfully!');
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('\nPlease check:');
    console.error('1. PostgreSQL is running');
    console.error('2. Database credentials in .env are correct');
    console.error('3. Database and table exist');
    console.error('4. Network/firewall settings allow connection');
  } finally {
    await pool.end();
  }
}

testConnection();
