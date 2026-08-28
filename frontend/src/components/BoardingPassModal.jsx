import React from 'react';
import { X, Plane, Printer, Download, CheckCircle2, QrCode } from 'lucide-react';

export default function BoardingPassModal({ booking, onClose }) {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatTime = (isoString) => {
    if (!isoString) return '08:00 AM';
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Sep 10, 2026';
    const d = new Date(isoString);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '650px', padding: 0, overflow: 'hidden' }}>
        
        {/* Modal Top Action Bar */}
        <div style={{ padding: '1rem 1.5rem', background: 'rgba(15, 23, 42, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: '700' }}>
            <CheckCircle2 size={20} /> Booking Confirmed!
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={handlePrint} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
              <Printer size={14} /> Print Pass
            </button>
            <button 
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Boarding Pass Ticket Stub Card */}
        <div style={{ padding: '2rem' }}>
          <div className="boarding-pass-card" style={{ padding: '2rem' }}>
            
            {/* Ticket Notches */}
            <div className="ticket-notch-left" />
            <div className="ticket-notch-right" />

            {/* Airline & Ticket Top Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plane size={24} color="#fff" style={{ transform: 'rotate(-45deg)' }} />
                </div>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#fff' }}>{booking.airline || 'SkyWay Airlines'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: '700' }}>BOARDING PASS</div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>PNR REFERENCE</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--accent-gold)', letterSpacing: '0.1em' }}>
                  {booking.booking_reference}
                </div>
              </div>
            </div>

            {/* Flight Origin to Destination Block */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '14px' }}>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff' }}>{booking.origin_code || 'JFK'}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{booking.origin_city || 'New York'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>{formatTime(booking.departure_time)}</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FLIGHT</div>
                <div style={{ fontWeight: '700', color: '#fff', fontSize: '1.1rem' }}>{booking.flight_number || 'SK-101'}</div>
                <Plane size={20} color="var(--primary)" style={{ transform: 'rotate(90deg)', margin: '0.4rem auto' }} />
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff' }}>{booking.destination_code || 'LHR'}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{booking.destination_city || 'London'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>{formatTime(booking.arrival_time)}</div>
              </div>
            </div>

            {/* Passenger & Seat Metadata Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>PASSENGER</div>
                <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.95rem' }}>{booking.passenger_name}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>SEAT</div>
                <div style={{ fontWeight: '800', color: 'var(--success)', fontSize: '1.1rem' }}>{booking.seat_number}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>CLASS</div>
                <div style={{ fontWeight: '700', color: 'var(--accent-gold)', fontSize: '0.95rem' }}>{booking.cabin_class}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>GATE</div>
                <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.95rem' }}>B14</div>
              </div>
            </div>

            <div className="dotted-line" />

            {/* Barcode & QR Footer Section */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {/* Simulated Barcode */}
                <div style={{ height: '36px', width: '220px', background: 'repeating-linear-gradient(90deg, #fff 0px, #fff 2px, transparent 2px, transparent 4px, #fff 4px, #fff 8px)', borderRadius: '4px' }} />
                <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.2em' }}>
                  *{booking.booking_reference}*
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ffffff', padding: '0.5rem', borderRadius: '8px' }}>
                <QrCode size={40} color="#070b16" />
              </div>
            </div>

          </div>
        </div>

        {/* Modal Bottom CTA */}
        <div style={{ padding: '1rem 2rem 1.5rem', textAlign: 'center' }}>
          <button onClick={onClose} className="btn-primary" style={{ width: '100%' }}>
            Done & View My Bookings
          </button>
        </div>

      </div>
    </div>
  );
}
