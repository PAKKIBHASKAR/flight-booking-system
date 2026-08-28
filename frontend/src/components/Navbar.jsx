import React, { useState } from 'react';
import { Plane, User, LogOut, Ticket, Compass, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab, openAuthModal }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)'
          }}>
            <Plane size={24} color="#ffffff" style={{ transform: 'rotate(-45deg)' }} />
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #ffffff, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SkyWay
            </span>
            <span style={{ fontSize: '0.65rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--accent-cyan)', fontWeight: '700' }}>
              Air Travel
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <button 
            onClick={() => setActiveTab('home')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'home' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeTab === 'home' ? '700' : '500',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'color 0.2s ease'
            }}
          >
            <Compass size={18} /> Explore Flights
          </button>

          <button 
            onClick={() => {
              if (!isAuthenticated) {
                openAuthModal('login');
              } else {
                setActiveTab('my-bookings');
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'my-bookings' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeTab === 'my-bookings' ? '700' : '500',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'color 0.2s ease'
            }}
          >
            <Ticket size={18} /> My Bookings
          </button>
        </nav>

        {/* Auth State Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="btn-secondary"
                style={{ borderRadius: '30px', padding: '0.5rem 1rem' }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.85rem'
                }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span>{user?.name?.split(' ')[0]}</span>
              </button>

              {showDropdown && (
                <div 
                  className="glass-panel animate-fade-in"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '120%',
                    width: '220px',
                    padding: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                  }}
                >
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.email}</div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('my-bookings');
                      setShowDropdown(false);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-main)',
                      textAlign: 'left',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      fontSize: '0.9rem'
                    }}
                  >
                    <Ticket size={16} /> My Tickets
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                      setActiveTab('home');
                    }}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: 'none',
                      color: '#f87171',
                      textAlign: 'left',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button 
                onClick={() => openAuthModal('login')} 
                className="btn-secondary"
              >
                Log In
              </button>
              <button 
                onClick={() => openAuthModal('signup')} 
                className="btn-primary"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
