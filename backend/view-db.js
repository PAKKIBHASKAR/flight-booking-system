const db = require('./db');

async function viewDatabaseSummary() {
  console.log('\n==================================================');
  console.log('✈️  SKYWAY FLIGHT BOOKING SYSTEM - DATABASE VIEW');
  console.log('==================================================\n');

  try {
    // 1. Registered Users
    console.log('👤 REGISTERED USERS (users table):');
    console.log('--------------------------------------------------');
    const users = await db.query('SELECT id, name, email, created_at FROM users');
    if (users.length === 0) {
      console.log('No users registered yet.');
    } else {
      console.table(users);
    }
    console.log('\n');

    // 2. Booked Tickets
    console.log('🎫 BOOKED TICKETS (bookings table):');
    console.log('--------------------------------------------------');
    const bookings = await db.query(`
      SELECT b.id, b.booking_reference as PNR, b.passenger_name, b.passenger_email, 
             b.seat_number, b.total_price, b.status, f.flight_number, f.origin_code, f.destination_code
      FROM bookings b
      JOIN flights f ON b.flight_id = f.id
      ORDER BY b.booking_date DESC
    `);
    if (bookings.length === 0) {
      console.log('No flight bookings created yet.');
    } else {
      console.table(bookings);
    }
    console.log('\n');

    // 3. Flight Schedules Summary
    console.log('✈️ FLIGHT SCHEDULES SUMMARY (flights table):');
    console.log('--------------------------------------------------');
    const flightsCount = await db.getOne('SELECT COUNT(*) as total FROM flights');
    console.log(`Total Active Flights in Database: ${flightsCount.total}`);

    process.exit(0);
  } catch (error) {
    console.error('Error querying database:', error);
    process.exit(1);
  }
}

viewDatabaseSummary();
