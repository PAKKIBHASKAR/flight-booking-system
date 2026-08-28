const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Generate unique 6-character PNR reference (e.g. SKY982)
function generatePNR() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pnr = 'SK';
  for (let i = 0; i < 4; i++) {
    pnr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pnr;
}

// 1. Create a New Booking (Protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { flight_id, passenger_name, passenger_email, passenger_phone, seat_number, cabin_class } = req.body;

    if (!flight_id || !passenger_name || !passenger_email || !seat_number) {
      return res.status(400).json({ error: 'Flight ID, passenger name, email, and seat number are required.' });
    }

    // Verify flight exists
    const flight = await db.getOne('SELECT * FROM flights WHERE id = ?', [flight_id]);
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found.' });
    }

    // Check if seat is already booked for this flight
    const existingSeat = await db.getOne(
      "SELECT * FROM bookings WHERE flight_id = ? AND seat_number = ? AND status = 'CONFIRMED'",
      [flight_id, seat_number]
    );

    if (existingSeat) {
      return res.status(400).json({ error: `Seat ${seat_number} is already booked on this flight. Please choose another seat.` });
    }

    // Calculate price (add premium for business/first class if applicable)
    let finalPrice = flight.price;
    if (seat_number.startsWith('1') || seat_number.startsWith('2')) {
      finalPrice += 150; // Premium front seat fee
    }

    const bookingReference = generatePNR();

    const result = await db.runSql(
      `INSERT INTO bookings (
        booking_reference, user_id, flight_id, passenger_name, passenger_email,
        passenger_phone, seat_number, cabin_class, total_price, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED')`,
      [
        bookingReference,
        userId,
        flight_id,
        passenger_name,
        passenger_email,
        passenger_phone || '',
        seat_number,
        cabin_class || flight.cabin_class,
        finalPrice
      ]
    );

    const newBooking = await db.getOne('SELECT * FROM bookings WHERE id = ?', [result.id]);

    res.status(201).json({
      message: 'Flight booked successfully!',
      booking: {
        ...newBooking,
        flight
      }
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ error: 'Failed to complete flight booking.' });
  }
});

// 2. Get All Bookings for Logged-in User (Protected)
router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await db.query(
      `SELECT b.*, f.flight_number, f.airline, f.airline_logo, f.origin_code, f.origin_city,
              f.origin_airport, f.destination_code, f.destination_city, f.destination_airport,
              f.departure_time, f.arrival_time, f.duration, f.aircraft
       FROM bookings b
       JOIN flights f ON b.flight_id = f.id
       WHERE b.user_id = ?
       ORDER BY b.booking_date DESC`,
      [userId]
    );

    res.json({ count: bookings.length, bookings });
  } catch (error) {
    console.error('Fetch my bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch user bookings.' });
  }
});

// 3. Cancel Booking (Protected)
router.put('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;

    const booking = await db.getOne('SELECT * FROM bookings WHERE id = ? AND user_id = ?', [bookingId, userId]);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found or unauthorized.' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ error: 'This booking is already cancelled.' });
    }

    await db.runSql("UPDATE bookings SET status = 'CANCELLED' WHERE id = ?", [bookingId]);

    res.json({ message: 'Booking cancelled successfully.' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking.' });
  }
});

module.exports = router;
