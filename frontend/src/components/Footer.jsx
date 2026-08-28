import React from 'react';
import { Plane, ShieldCheck, Award, Globe, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ marginTop: '5rem', borderTop: '1px solid var(--border-color)', background: 'rgba(7, 11, 22, 0.95)', padding: '4rem 1.5rem 2rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
        
        {/* Brand Description */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '10px' }}>
              <Plane size={20} color="#fff" style={{ transform: 'rotate(-45deg)' }} />
            </div>
            <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff' }}>SkyWay</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Experience next-generation flight search, seamless cabin seat booking, and instant digital boarding passes for global air travel.
          </p>
        </div>

        {/* Top Global Routes */}
        <div>
          <div style={{ fontWeight: '700', color: '#fff', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
            Popular Routes
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <li>New York (JFK) ✈ London (LHR)</li>
            <li>San Francisco (SFO) ✈ Tokyo (HND)</li>
            <li>Dubai (DXB) ✈ New York (JFK)</li>
            <li>Paris (CDG) ✈ New York (JFK)</li>
            <li>Singapore (SIN) ✈ Sydney (SYD)</li>
          </ul>
        </div>

        {/* Trust Badges */}
        <div>
          <div style={{ fontWeight: '700', color: '#fff', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
            Why SkyWay?
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={16} color="var(--success)" /> 256-Bit SSL Encrypted Booking
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={16} color="var(--accent-gold)" /> Instant E-Ticket & Boarding Pass
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={16} color="var(--accent-cyan)" /> 500+ Global Airline Carriers
            </li>
          </ul>
        </div>

      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '2rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
        © 2026 SkyWay Flight Systems. All rights reserved. Designed for Netlify & Render deployment.
      </div>
    </footer>
  );
}
