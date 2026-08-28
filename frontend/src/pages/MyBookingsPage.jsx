import React, { useState, useEffect } from 'react';
import BoardingPassModal from '../components/BoardingPassModal';
import { Ticket, Plane, Calendar, MapPin, AlertCircle, Trash2, CheckCircle2, QrCode } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MyBookingsPage({ onExploreFlights }) {
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedBookingForPass, setSelectedBookingForPass] = useState(null);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.getMyBookings();
      setBookings(res.bookings || []);
    } catch (err) {
      console.error('Fetch bookings error:', err);
      setErrorMsg('Failed to load your flight tickets.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this flight booking reservation?')) {
      return;
    }

    try {
      await api.cancelBooking(bookingId);
      fetchUserBookings();
    } catch (err) {
      alert(err.message || 'Failed to cancel booking.');
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', padding: '0 1.5rem' }}>
      
      {/* Dashboard Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-gold)', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
            <Ticket size={16} /> My Reservations
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff' }}>
            Booked Flight Tickets
          </h1>
        </div>

        <button onClick={onExploreFlights} className="btn-primary">
          <Plane size={18} /> Book Another Flight
        </button>
      </div>

      {loading ? (
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading your flight itineraries...
        </div>
      ) : errorMsg ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: '#f87171' }}>
          <AlertCircle size={32} style={{ margin: '0 auto 1rem' }} />
          {errorMsg}
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎫</div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', marginBottom: '0.5rem' }}>No Active Bookings Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
            You haven't booked any flight tickets yet. Explore global destinations and pick your seats now!
          </p>
          <button onClick={onExploreFlights} className="btn-primary">
            Explore Flights
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {bookings.map((booking) => {
            const isCancelled = booking.status === 'CANCELLED';

            return (
              <div key={booking.id} className="glass-panel animate-fade-in" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', opacity: isCancelled ? 0.65 : 1 }}>
                
                {/* Booking Card Top Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Plane size={22} color="#fff" style={{ transform: 'rotate(-45deg)' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#fff' }}>{booking.airline}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Flight {booking.flight_number} • PNR: <span style={{ color: 'var(--accent-gold)', fontWeight: '700' }}>{booking.booking_reference}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className={`badge-status ${isCancelled ? 'badge-cancelled' : 'badge-confirmed'}`}>
                      {booking.status}
                    </span>
                    <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>
                      ${booking.total_price}
                    </span>
                  </div>
                </div>

                {/* Itinerary Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ROUTE</div>
                    <div style={{ fontWeight: '800', color: 'var(--accent-cyan)', fontSize: '1.05rem' }}>
                      {booking.origin_code} ✈ {booking.destination_code}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      {booking.origin_city} to {booking.destination_city}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DATE & TIME</div>
                    <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.95rem' }}>
                      {formatDate(booking.departure_time)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      Departure: {formatTime(booking.departure_time)}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PASSENGER & SEAT</div>
                    <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.95rem' }}>
                      {booking.passenger_name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: '700' }}>
                      Seat {booking.seat_number} ({booking.cabin_class})
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Booked on: {formatDate(booking.booking_date)}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {!isCancelled && (
                      <>
                        <button
                          onClick={() => setSelectedBookingForPass(booking)}
                          className="btn-primary"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                        >
                          <QrCode size={16} /> View Boarding Pass
                        </button>

                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#f87171',
                            padding: '0.5rem 1rem',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}
                        >
                          <Trash2 size={15} /> Cancel Ticket
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal view for Boarding Pass */}
      {selectedBookingForPass && (
        <BoardingPassModal 
          booking={selectedBookingForPass} 
          onClose={() => setSelectedBookingForPass(null)} 
        />
      )}

    </div>
  );
}
