import React from 'react';
import FlightSearchBox from '../components/FlightSearchBox';
import { Plane, Compass, Globe, Sparkles, Shield, Clock } from 'lucide-react';

const DESTINATIONS = [
  {
    city: 'Paris, France',
    code: 'CDG',
    price: '$790',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80',
    tag: 'Popular'
  },
  {
    city: 'Tokyo, Japan',
    code: 'HND',
    price: '$890',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
    tag: 'Trending'
  },
  {
    city: 'London, UK',
    code: 'LHR',
    price: '$649',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&auto=format&fit=crop&q=80',
    tag: 'Best Seller'
  },
  {
    city: 'Dubai, UAE',
    code: 'DXB',
    price: '$740',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&auto=format&fit=crop&q=80',
    tag: 'Luxury'
  }
];

export default function HomePage({ onSearch, onSelectDestination }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      
      {/* Hero Section */}
      <section style={{ position: 'relative', paddingTop: '3rem', paddingBottom: '2rem', textAlign: 'center' }}>
        
        {/* Glow pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '0.4rem 1rem', borderRadius: '30px', color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: '700', marginBottom: '1.5rem' }}>
          <Sparkles size={16} /> Seamless Global Air Travel Experience
        </div>

        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', fontWeight: '900', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '1rem', background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Fly Beyond Horizons with <span style={{ background: 'linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SkyWay</span>
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
          Discover non-stop flights to over 200+ worldwide destinations. Reserve your favorite window or aisle seat and get instant digital boarding passes.
        </p>

        {/* Embedded Flight Search Widget */}
        <FlightSearchBox onSearch={onSearch} />

      </section>

      {/* Popular Destinations Showcase */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '0 1.5rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>Explore Top Destinations</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Handpicked flight offers to the world's most vibrant cities</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem' }}>
            <Globe size={18} /> Worldwide Hubs
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {DESTINATIONS.map((d) => (
            <div 
              key={d.code}
              onClick={() => onSelectDestination(d.code)}
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
            >
              <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                <img 
                  src={d.image} 
                  alt={d.city}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <span style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(7, 11, 22, 0.8)', backdropFilter: 'blur(8px)', color: 'var(--accent-gold)', fontWeight: '700', fontSize: '0.75rem', padding: '0.3rem 0.75rem', borderRadius: '20px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  {d.tag}
                </span>
                <span style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'var(--primary)', color: '#fff', fontWeight: '800', fontSize: '0.9rem', padding: '0.4rem 0.8rem', borderRadius: '10px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' }}>
                  From {d.price}
                </span>
              </div>

              <div style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>{d.city}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Airport Code: {d.code}</p>
                </div>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                  <Plane size={18} />
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* Feature Highlights Grid */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '0 1.5rem' }}>
        <div className="glass-panel" style={{ padding: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
          
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Compass size={24} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '0.4rem' }}>Real-time Flight Schedules</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                Direct integration with global airline departure systems ensuring live timing and fare transparency.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Shield size={24} color="var(--success)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '0.4rem' }}>Interactive Cabin Seats</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                Visual aircraft seat maps allowing you to lock in Business or Economy seats in real-time.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Clock size={24} color="var(--accent-gold)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '0.4rem' }}>Instant Digital Passes</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                Get PNR code and printable digital boarding passes immediately upon booking confirmation.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
