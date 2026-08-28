import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, ArrowRightLeft, Sparkles } from 'lucide-react';

const SUGGESTED_AIRPORTS = [
  { code: 'JFK', city: 'New York', label: 'New York (JFK)' },
  { code: 'LHR', city: 'London', label: 'London Heathrow (LHR)' },
  { code: 'HND', city: 'Tokyo', label: 'Tokyo Haneda (HND)' },
  { code: 'BOM', city: 'Mumbai', label: 'Mumbai (BOM)' },
  { code: 'DEL', city: 'New Delhi', label: 'New Delhi (DEL)' },
  { code: 'BLR', city: 'Bengaluru', label: 'Bengaluru (BLR)' },
  { code: 'DXB', city: 'Dubai', label: 'Dubai (DXB)' },
  { code: 'CDG', city: 'Paris', label: 'Paris Charles de Gaulle (CDG)' },
  { code: 'SFO', city: 'San Francisco', label: 'San Francisco (SFO)' },
  { code: 'LAX', city: 'Los Angeles', label: 'Los Angeles (LAX)' },
  { code: 'ORD', city: 'Chicago', label: 'Chicago O\'Hare (ORD)' },
  { code: 'YYZ', city: 'Toronto', label: 'Toronto Pearson (YYZ)' },
  { code: 'SIN', city: 'Singapore', label: 'Singapore Changi (SIN)' },
  { code: 'SYD', city: 'Sydney', label: 'Sydney (SYD)' },
  { code: 'FRA', city: 'Frankfurt', label: 'Frankfurt (FRA)' }
];

export default function FlightSearchBox({ onSearch }) {
  const [tripType, setTripType] = useState('one-way');
  const [origin, setOrigin] = useState('New York');
  const [destination, setDestination] = useState('London');
  const [departureDate, setDepartureDate] = useState('2026-09-10');
  const [cabinClass, setCabinClass] = useState('All');
  const [passengers, setPassengers] = useState(1);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      origin: origin.trim(),
      destination: destination.trim(),
      departureDate,
      cabin_class: cabinClass,
      passengers
    });
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Search Header Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.8)', padding: '0.3rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <button
            type="button"
            onClick={() => setTripType('one-way')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: tripType === 'one-way' ? 'var(--primary)' : 'transparent',
              color: tripType === 'one-way' ? '#fff' : 'var(--text-muted)',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            One-Way Flight
          </button>
          <button
            type="button"
            onClick={() => setTripType('round-trip')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: tripType === 'round-trip' ? 'var(--primary)' : 'transparent',
              color: tripType === 'round-trip' ? '#fff' : 'var(--text-muted)',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Round-Trip
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Users size={16} color="var(--accent-cyan)" />
            <select 
              value={passengers} 
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="form-select"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
            >
              <option value={1}>1 Passenger</option>
              <option value={2}>2 Passengers</option>
              <option value={3}>3 Passengers</option>
              <option value={4}>4 Passengers</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={16} color="var(--accent-gold)" />
            <select 
              value={cabinClass} 
              onChange={(e) => setCabinClass(e.target.value)}
              className="form-select"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
            >
              <option value="All">All Cabin Classes</option>
              <option value="Economy">Economy</option>
              <option value="Business">Business Class</option>
              <option value="First Class">First Class</option>
            </select>
          </div>
        </div>

      </div>

      {/* Main Freeform Search Inputs Grid */}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', alignItems: 'end' }}>
        
        {/* Origin Freeform Input */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={14} color="var(--primary)" /> From (Source City / Airport)
          </label>
          <input
            type="text"
            required
            list="origin-airports-list"
            placeholder="Type any city or airport (e.g. Mumbai, JFK)"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="form-input"
            style={{ fontWeight: '600' }}
          />
          <datalist id="origin-airports-list">
            {SUGGESTED_AIRPORTS.map((a) => (
              <option key={a.code} value={a.city}>{a.label}</option>
            ))}
          </datalist>
        </div>

        {/* Swap Button */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={handleSwap}
            title="Swap Origin & Destination"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(30, 41, 59, 0.9)',
              border: '1px solid var(--border-color)',
              color: 'var(--accent-cyan)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '4px'
            }}
          >
            <ArrowRightLeft size={18} />
          </button>
        </div>

        {/* Destination Freeform Input */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={14} color="var(--accent-cyan)" /> To (Destination City / Airport)
          </label>
          <input
            type="text"
            required
            list="destination-airports-list"
            placeholder="Type any destination (e.g. London, Tokyo)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="form-input"
            style={{ fontWeight: '600' }}
          />
          <datalist id="destination-airports-list">
            {SUGGESTED_AIRPORTS.map((a) => (
              <option key={a.code} value={a.city}>{a.label}</option>
            ))}
          </datalist>
        </div>

        {/* Departure Date */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={14} color="var(--accent-gold)" /> Departure Date
          </label>
          <input 
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            className="form-input"
            style={{ fontWeight: '600' }}
          />
        </div>

        {/* Search Submit CTA */}
        <button type="submit" className="btn-primary" style={{ height: '46px', fontSize: '1rem', width: '100%' }}>
          <Search size={20} /> Search Flights
        </button>

      </form>

      {/* Quick Select Popular Route Chips */}
      <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <span>Quick Routes:</span>
        {[
          { from: 'Mumbai', to: 'London' },
          { from: 'New Delhi', to: 'Tokyo' },
          { from: 'New York', to: 'Paris' },
          { from: 'San Francisco', to: 'Singapore' },
          { from: 'Dubai', to: 'Sydney' }
        ].map((route, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setOrigin(route.from);
              setDestination(route.to);
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '0.2rem 0.6rem',
              color: 'var(--accent-cyan)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}
          >
            {route.from} ✈ {route.to}
          </button>
        ))}
      </div>

    </div>
  );
}
