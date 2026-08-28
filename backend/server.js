const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const flightRoutes = require('./routes/flightRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration (allow requests from frontend dev & production deployments)
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'SkyWay Flight Booking API',
    timestamp: new Date().toISOString()
  });
});

// Admin DB summary endpoint to view registered users & bookings
const db = require('./db');
app.get('/api/admin/db', async (req, res) => {
  try {
    const users = await db.query('SELECT id, name, email, created_at FROM users');
    const bookings = await db.query(`
      SELECT b.id, b.booking_reference, b.passenger_name, b.passenger_email, 
             b.seat_number, b.total_price, b.status, f.flight_number, f.origin_code, f.destination_code
      FROM bookings b
      JOIN flights f ON b.flight_id = f.id
      ORDER BY b.booking_date DESC
    `);
    const flightCount = await db.getOne('SELECT COUNT(*) as count FROM flights');

    res.json({
      summary: {
        total_users: users.length,
        total_bookings: bookings.length,
        total_flights: flightCount.count
      },
      users,
      bookings
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to query database summary.' });
  }
});

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`✈️ SkyWay Backend Server running on http://localhost:${PORT}`);
});
