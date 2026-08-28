import React, { useState, useEffect } from 'react';
import FlightCard from '../components/FlightCard';
import { Filter, SlidersHorizontal, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function SearchResultsPage({ searchParams, onSelectFlight, onBackToSearch }) {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [maxPrice, setMaxPrice] = useState(3000);
  const [selectedAirline, setSelectedAirline] = useState('All');
  const [selectedClass, setSelectedClass] = useState(searchParams?.cabin_class || 'All');

  useEffect(() => {
    fetchFlights();
  }, [searchParams]);

  const fetchFlights = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.searchFlights({
        origin: searchParams?.origin,
        destination: searchParams?.destination,
        cabin_class: selectedClass !== 'All' ? selectedClass : undefined
      });
      setFlights(res.flights || []);
    } catch (err) {
      console.error('Failed to load flights:', err);
      setError('Could not load flights for selected route.');
    } finally {
      setLoading(false);
    }
  };

  // Filter flights locally based on price & airline
  const filteredFlights = flights.filter((f) => {
    const matchesPrice = f.price <= maxPrice;
    const matchesAirline = selectedAirline === 'All' || f.airline === selectedAirline;
    const matchesClass = selectedClass === 'All' || f.cabin_class === selectedClass;
    return matchesPrice && matchesAirline && matchesClass;
  });

  const airlinesList = Array.from(new Set(flights.map((f) => f.airline)));

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '0 1.5rem' }}>
      
      {/* Top Breadcrumb Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <button 
          onClick={onBackToSearch}
          className="btn-secondary" 
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} /> Modify Search
        </button>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>
            {searchParams?.origin || 'ANY'} ✈ {searchParams?.destination || 'ANY'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing available flight options ({filteredFlights.length} found)
          </p>
        </div>

        <button onClick={fetchFlights} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Main Results Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Filters Sidebar */}
        <aside className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <SlidersHorizontal size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff' }}>Filter Results</h3>
          </div>

          {/* Max Price Filter */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <span>Max Budget:</span>
              <span style={{ fontWeight: '700', color: 'var(--accent-gold)' }}>${maxPrice}</span>
            </div>
            <input 
              type="range"
              min="500"
              max="3000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
          </div>

          {/* Airline Carrier Filter */}
          <div className="form-group">
            <label className="form-label">Airline Carrier</label>
            <select 
              value={selectedAirline} 
              onChange={(e) => setSelectedAirline(e.target.value)}
              className="form-select"
            >
              <option value="All">All Carriers</option>
              {airlinesList.map((airline) => (
                <option key={airline} value={airline}>{airline}</option>
              ))}
            </select>
          </div>

          {/* Cabin Class Filter */}
          <div className="form-group">
            <label className="form-label">Cabin Class</label>
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="form-select"
            >
              <option value="All">All Classes</option>
              <option value="Economy">Economy</option>
              <option value="Business">Business Class</option>
              <option value="First Class">First Class</option>
            </select>
          </div>

          <button 
            onClick={() => {
              setMaxPrice(3000);
              setSelectedAirline('All');
              setSelectedClass('All');
            }}
            style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', fontWeight: '600' }}
          >
            Reset Filters
          </button>
        </aside>

        {/* Flight Cards Stream */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {loading ? (
            <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✈️</div>
              Searching real-time airline schedules...
            </div>
          ) : error ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: '#f87171' }}>
              <AlertCircle size={32} style={{ margin: '0 auto 1rem' }} />
              {error}
            </div>
          ) : filteredFlights.length === 0 ? (
            <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>No Flights Match Criteria</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Try relaxing your price filters or searching a different origin/destination hub.
              </p>
              <button onClick={() => { setMaxPrice(3000); setSelectedAirline('All'); setSelectedClass('All'); }} className="btn-secondary">
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredFlights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} onSelect={onSelectFlight} />
            ))
          )}

        </main>

      </div>

    </div>
  );
}
