import React from 'react';
import { Plane, Clock, ShieldCheck, Tag, ArrowRight } from 'lucide-react';

export default function FlightCard({ flight, onSelect }) {
  const formatTime = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img 
            src={flight.airline_logo} 
            alt={flight.airline}
            style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }} 
          />
          <div>
            <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#fff' }}>{flight.airline}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {flight.flight_number} • {flight.aircraft}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge-status badge-confirmed" style={{ fontSize: '0.7rem' }}>
            {flight.stops === 0 ? 'Direct Non-Stop' : `${flight.stops} Stop`}
          </span>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-gold)', background: 'rgba(245,158,11,0.1)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
            {flight.cabin_class}
          </span>
        </div>
      </div>

      {/* Flight Schedule & Trajectory Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', alignItems: 'center', gap: '1rem', background: 'rgba(15, 23, 42, 0.5)', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
        
        {/* Origin */}
        <div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em' }}>
            {formatTime(flight.departure_time)}
          </div>
          <div style={{ fontWeight: '700', color: 'var(--accent-cyan)', fontSize: '1rem' }}>
            {flight.origin_code} ({flight.origin_city})
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            {formatDate(flight.departure_time)}
          </div>
        </div>

        {/* Duration Trajectory Line */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
            <Clock size={14} /> {flight.duration}
          </div>
          <div className="flight-line-container">
            <div className="flight-dot" />
            <div className="flight-line">
              <Plane size={18} className="flight-icon-anim" />
            </div>
            <div className="flight-dot" style={{ background: 'var(--accent-cyan)', boxShadow: '0 0 10px var(--accent-cyan)' }} />
          </div>
        </div>

        {/* Destination */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em' }}>
            {formatTime(flight.arrival_time)}
          </div>
          <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1rem' }}>
            {flight.destination_code} ({flight.destination_city})
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            {formatDate(flight.arrival_time)}
          </div>
        </div>

      </div>

      {/* Bottom Price & Select Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>From</span>
          <span style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ffffff' }}>
            ${flight.price}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ passenger</span>
        </div>

        <button 
          onClick={() => onSelect(flight)}
          className="btn-primary" 
          style={{ padding: '0.7rem 1.4rem' }}
        >
          Select Seats <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}
