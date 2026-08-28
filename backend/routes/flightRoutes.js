const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper to generate realistic flights on-the-fly if route is not in initial seed database
async function generateFlightsOnTheFly(originStr, destStr) {
  const cleanOrigin = (originStr || 'New York').trim();
  const cleanDest = (destStr || 'London').trim();

  const originCode = cleanOrigin.length === 3 ? cleanOrigin.toUpperCase() : cleanOrigin.slice(0, 3).toUpperCase();
  const destCode = cleanDest.length === 3 ? cleanDest.toUpperCase() : cleanDest.slice(0, 3).toUpperCase();

  const airlines = [
    { name: 'SkyWay Express', logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&auto=format&fit=crop&q=80', aircraft: 'Boeing 787 Dreamliner', basePrice: 480 },
    { name: 'AeroGlobal Airways', logo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=100&auto=format&fit=crop&q=80', aircraft: 'Airbus A350-900', basePrice: 620 },
    { name: 'Luxe Star Flight', logo: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=100&auto=format&fit=crop&q=80', aircraft: 'Boeing 777-300ER', basePrice: 890 }
  ];

  const generated = [];

  for (let i = 0; i < airlines.length; i++) {
    const a = airlines[i];
    const flightNum = `${a.name.slice(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 899)}`;
    const depHour = 7 + i * 5;
    const depTime = `2026-09-10T${depHour < 10 ? '0' + depHour : depHour}:15:00`;
    const arrHour = (depHour + 8) % 24;
    const arrTime = `2026-09-10T${arrHour < 10 ? '0' + arrHour : arrHour}:45:00`;
    const price = a.basePrice + Math.floor(Math.random() * 150);

    const result = await db.runSql(
      `INSERT INTO flights (
        flight_number, airline, airline_logo, origin_code, origin_city, origin_airport,
        destination_code, destination_city, destination_airport, departure_time,
        arrival_time, duration, price, cabin_class, stops, aircraft, total_seats
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        flightNum,
        a.name,
        a.logo,
        originCode,
        cleanOrigin,
        `${cleanOrigin} Intl Airport (${originCode})`,
        destCode,
        cleanDest,
        `${cleanDest} Intl Airport (${destCode})`,
        depTime,
        arrTime,
        '8h 30m',
        price,
        i === 2 ? 'Business' : 'Economy',
        0,
        a.aircraft,
        120
      ]
    );

    const created = await db.getOne('SELECT * FROM flights WHERE id = ?', [result.id]);
    generated.push(created);
  }

  return generated;
}

// 1. Search & Filter Flights
router.get('/', async (req, res) => {
  try {
    const { origin, destination, cabin_class, min_price, max_price, airline } = req.query;

    let sql = 'SELECT * FROM flights WHERE 1=1';
    const params = [];

    if (origin) {
      sql += ' AND (origin_code LIKE ? OR origin_city LIKE ?)';
      params.push(`%${origin.trim()}%`, `%${origin.trim()}%`);
    }

    if (destination) {
      sql += ' AND (destination_code LIKE ? OR destination_city LIKE ?)';
      params.push(`%${destination.trim()}%`, `%${destination.trim()}%`);
    }

    if (cabin_class && cabin_class !== 'All') {
      sql += ' AND cabin_class = ?';
      params.push(cabin_class);
    }

    if (airline && airline !== 'All') {
      sql += ' AND airline = ?';
      params.push(airline);
    }

    if (min_price) {
      sql += ' AND price >= ?';
      params.push(parseFloat(min_price));
    }

    if (max_price) {
      sql += ' AND price <= ?';
      params.push(parseFloat(max_price));
    }

    sql += ' ORDER BY price ASC';

    let flights = await db.query(sql, params);

    // If no flights found in DB for requested custom route, generate realistic flights dynamically
    if (flights.length === 0 && (origin || destination)) {
      console.log(`Generating flights on-the-fly for route: ${origin || 'ANY'} -> ${destination || 'ANY'}`);
      flights = await generateFlightsOnTheFly(origin, destination);
    }

    res.json({ count: flights.length, flights });
  } catch (error) {
    console.error('Flight search error:', error);
    res.status(500).json({ error: 'Failed to search flights.' });
  }
});

// 2. Get Single Flight Details & Reserved Seats Map
router.get('/:id', async (req, res) => {
  try {
    const flightId = req.params.id;

    const flight = await db.getOne('SELECT * FROM flights WHERE id = ?', [flightId]);
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found.' });
    }

    // Fetch reserved seat numbers for this flight
    const reservedSeatRows = await db.query(
      "SELECT seat_number FROM bookings WHERE flight_id = ? AND status = 'CONFIRMED'",
      [flightId]
    );

    const reservedSeats = reservedSeatRows.map((r) => r.seat_number);

    res.json({
      flight,
      reservedSeats
    });
  } catch (error) {
    console.error('Fetch flight details error:', error);
    res.status(500).json({ error: 'Failed to retrieve flight details.' });
  }
});

module.exports = router;

