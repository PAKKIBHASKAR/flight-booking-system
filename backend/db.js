const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'flights.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

// Helper for promise-based queries
db.query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

db.getOne = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

db.runSql = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const seedFlights = [
  {
    flight_number: 'SK-101',
    airline: 'AeroGlobal',
    airline_logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&auto=format&fit=crop&q=80',
    origin_code: 'JFK',
    origin_city: 'New York',
    origin_airport: 'John F. Kennedy Intl',
    destination_code: 'LHR',
    destination_city: 'London',
    destination_airport: 'Heathrow Airport',
    departure_time: '2026-09-10T08:30:00',
    arrival_time: '2026-09-10T20:45:00',
    duration: '7h 15m',
    price: 649,
    cabin_class: 'Economy',
    stops: 0,
    aircraft: 'Boeing 787 Dreamliner',
    total_seats: 120
  },
  {
    flight_number: 'SK-102',
    airline: 'AeroGlobal',
    airline_logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&auto=format&fit=crop&q=80',
    origin_code: 'JFK',
    origin_city: 'New York',
    origin_airport: 'John F. Kennedy Intl',
    destination_code: 'LHR',
    destination_city: 'London',
    destination_airport: 'Heathrow Airport',
    departure_time: '2026-09-10T19:00:00',
    arrival_time: '2026-09-11T07:10:00',
    duration: '7h 10m',
    price: 1499,
    cabin_class: 'Business',
    stops: 0,
    aircraft: 'Boeing 777-300ER',
    total_seats: 80
  },
  {
    flight_number: 'PA-304',
    airline: 'Pacific Sky',
    airline_logo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=100&auto=format&fit=crop&q=80',
    origin_code: 'SFO',
    origin_city: 'San Francisco',
    origin_airport: 'San Francisco Intl',
    destination_code: 'HND',
    destination_city: 'Tokyo',
    destination_airport: 'Haneda Airport',
    departure_time: '2026-09-12T11:15:00',
    arrival_time: '2026-09-13T14:50:00',
    duration: '11h 35m',
    price: 890,
    cabin_class: 'Economy',
    stops: 0,
    aircraft: 'Airbus A350-900',
    total_seats: 150
  },
  {
    flight_number: 'PA-308',
    airline: 'Pacific Sky',
    airline_logo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=100&auto=format&fit=crop&q=80',
    origin_code: 'SFO',
    origin_city: 'San Francisco',
    origin_airport: 'San Francisco Intl',
    destination_code: 'HND',
    destination_city: 'Tokyo',
    destination_airport: 'Haneda Airport',
    departure_time: '2026-09-12T22:40:00',
    arrival_time: '2026-09-14T02:15:00',
    duration: '11h 35m',
    price: 2850,
    cabin_class: 'First Class',
    stops: 0,
    aircraft: 'Airbus A350-1000',
    total_seats: 40
  },
  {
    flight_number: 'EK-201',
    airline: 'Emirates Sky',
    airline_logo: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=100&auto=format&fit=crop&q=80',
    origin_code: 'DXB',
    origin_city: 'Dubai',
    origin_airport: 'Dubai Intl Airport',
    destination_code: 'JFK',
    destination_city: 'New York',
    destination_airport: 'John F. Kennedy Intl',
    departure_time: '2026-09-15T02:30:00',
    arrival_time: '2026-09-15T08:50:00',
    duration: '14h 20m',
    price: 1120,
    cabin_class: 'Economy',
    stops: 0,
    aircraft: 'Airbus A380-800',
    total_seats: 180
  },
  {
    flight_number: 'EK-203',
    airline: 'Emirates Sky',
    airline_logo: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=100&auto=format&fit=crop&q=80',
    origin_code: 'DXB',
    origin_city: 'Dubai',
    origin_airport: 'Dubai Intl Airport',
    destination_code: 'LHR',
    destination_city: 'London',
    destination_airport: 'Heathrow Airport',
    departure_time: '2026-09-15T14:15:00',
    arrival_time: '2026-09-15T18:40:00',
    duration: '7h 25m',
    price: 740,
    cabin_class: 'Economy',
    stops: 0,
    aircraft: 'Boeing 777-300ER',
    total_seats: 140
  },
  {
    flight_number: 'AF-502',
    airline: 'Air Luxe Paris',
    airline_logo: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=100&auto=format&fit=crop&q=80',
    origin_code: 'CDG',
    origin_city: 'Paris',
    origin_airport: 'Charles de Gaulle',
    destination_code: 'JFK',
    destination_city: 'New York',
    destination_airport: 'John F. Kennedy Intl',
    departure_time: '2026-09-16T13:30:00',
    arrival_time: '2026-09-16T15:45:00',
    duration: '8h 15m',
    price: 790,
    cabin_class: 'Economy',
    stops: 0,
    aircraft: 'Boeing 787-9',
    total_seats: 120
  },
  {
    flight_number: 'SQ-401',
    airline: 'Star Singapore',
    airline_logo: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=100&auto=format&fit=crop&q=80',
    origin_code: 'SIN',
    origin_city: 'Singapore',
    origin_airport: 'Changi Airport',
    destination_code: 'SYD',
    destination_city: 'Sydney',
    destination_airport: 'Kingsford Smith',
    departure_time: '2026-09-18T20:10:00',
    arrival_time: '2026-09-19T05:55:00',
    duration: '7h 45m',
    price: 680,
    cabin_class: 'Economy',
    stops: 0,
    aircraft: 'Airbus A350-900',
    total_seats: 130
  },
  {
    flight_number: 'AI-105',
    airline: 'Veda Air',
    airline_logo: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=100&auto=format&fit=crop&q=80',
    origin_code: 'DEL',
    origin_city: 'New Delhi',
    origin_airport: 'Indira Gandhi Intl',
    destination_code: 'LHR',
    destination_city: 'London',
    destination_airport: 'Heathrow Airport',
    departure_time: '2026-09-20T06:50:00',
    arrival_time: '2026-09-20T11:30:00',
    duration: '9h 10m',
    price: 620,
    cabin_class: 'Economy',
    stops: 0,
    aircraft: 'Boeing 787-8',
    total_seats: 120
  },
  {
    flight_number: 'QF-011',
    airline: 'Aussie Wings',
    airline_logo: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=100&auto=format&fit=crop&q=80',
    origin_code: 'SYD',
    origin_city: 'Sydney',
    origin_airport: 'Kingsford Smith',
    destination_code: 'LAX',
    destination_city: 'Los Angeles',
    destination_airport: 'Los Angeles Intl',
    departure_time: '2026-09-22T10:00:00',
    arrival_time: '2026-09-22T06:30:00',
    duration: '13h 30m',
    price: 1050,
    cabin_class: 'Economy',
    stops: 0,
    aircraft: 'Boeing 787-9',
    total_seats: 140
  }
];

function initDatabase() {
  db.serialize(async () => {
    // 1. Users Table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Flights Table
    db.run(`
      CREATE TABLE IF NOT EXISTS flights (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        flight_number TEXT NOT NULL,
        airline TEXT NOT NULL,
        airline_logo TEXT,
        origin_code TEXT NOT NULL,
        origin_city TEXT NOT NULL,
        origin_airport TEXT NOT NULL,
        destination_code TEXT NOT NULL,
        destination_city TEXT NOT NULL,
        destination_airport TEXT NOT NULL,
        departure_time TEXT NOT NULL,
        arrival_time TEXT NOT NULL,
        duration TEXT NOT NULL,
        price REAL NOT NULL,
        cabin_class TEXT DEFAULT 'Economy',
        stops INTEGER DEFAULT 0,
        aircraft TEXT NOT NULL,
        total_seats INTEGER DEFAULT 120,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Bookings Table
    db.run(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_reference TEXT UNIQUE NOT NULL,
        user_id INTEGER NOT NULL,
        flight_id INTEGER NOT NULL,
        passenger_name TEXT NOT NULL,
        passenger_email TEXT NOT NULL,
        passenger_phone TEXT NOT NULL,
        seat_number TEXT NOT NULL,
        cabin_class TEXT NOT NULL,
        total_price REAL NOT NULL,
        booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'CONFIRMED',
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (flight_id) REFERENCES flights (id)
      )
    `);

    // Seed default demo user if not exists
    try {
      const demoUser = await db.getOne(`SELECT * FROM users WHERE email = ?`, ['demo@skyway.com']);
      if (!demoUser) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await db.runSql(`INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)`, [
          'Alex Morgan',
          'demo@skyway.com',
          hashedPassword
        ]);
        console.log('Demo user created: demo@skyway.com / password123');
      }
    } catch (e) {
      console.error('Error seeding demo user:', e.message);
    }

    // Seed initial flights if database table is empty
    try {
      const flightCount = await db.getOne(`SELECT COUNT(*) as count FROM flights`);
      if (flightCount && flightCount.count === 0) {
        console.log('Seeding initial flight schedules...');
        const stmt = db.prepare(`
          INSERT INTO flights (
            flight_number, airline, airline_logo, origin_code, origin_city, origin_airport,
            destination_code, destination_city, destination_airport, departure_time,
            arrival_time, duration, price, cabin_class, stops, aircraft, total_seats
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        seedFlights.forEach((f) => {
          stmt.run([
            f.flight_number,
            f.airline,
            f.airline_logo,
            f.origin_code,
            f.origin_city,
            f.origin_airport,
            f.destination_code,
            f.destination_city,
            f.destination_airport,
            f.departure_time,
            f.arrival_time,
            f.duration,
            f.price,
            f.cabin_class,
            f.stops,
            f.aircraft,
            f.total_seats
          ]);
        });
        stmt.finalize();
        console.log(`Successfully seeded ${seedFlights.length} flights.`);
      }
    } catch (e) {
      console.error('Error seeding flights:', e.message);
    }
  });
}

initDatabase();

module.exports = db;
