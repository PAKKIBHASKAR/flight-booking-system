import React, { useState, useEffect } from 'react';
import SeatSelector from '../components/SeatSelector';
import BoardingPassModal from '../components/BoardingPassModal';
import { Plane, User, Mail, Phone, CreditCard, ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function BookingCheckoutPage({ flight, onBack, onBookingComplete }) {
  const { user } = useAuth();

  const [reservedSeats, setReservedSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState('3A');
  const [passengerName, setPassengerName] = useState(user?.name || '');
  const [passengerEmail, setPassengerEmail] = useState(user?.email || '');
  const [passengerPhone, setPassengerPhone] = useState('+1 (555) 234-5678');
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [completedBooking, setCompletedBooking] = useState(null);

  useEffect(() => {
    if (flight?.id) {
      api.getFlightDetails(flight.id)
        .then((res) => {
          setReservedSeats(res.reservedSeats || []);
        })
        .catch((err) => console.error('Error fetching reserved seats:', err));
    }
  }, [flight]);

  // Calculate pricing breakdown
  const basePrice = flight?.price || 0;
  const isBusinessSeat = selectedSeat.startsWith('1') || selectedSeat.startsWith('2');
  const seatFee = isBusinessSeat ? 150 : 0;
  const airportTax = 45;
  const totalPrice = basePrice + seatFee + airportTax;

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!selectedSeat) {
      setErrorMsg('Please select an available seat from the cabin layout.');
      return;
    }

    setErrorMsg(null);
    setSubmitting(true);

    try {
      const res = await api.createBooking({
        flight_id: flight.id,
        passenger_name: passengerName,
        passenger_email: passengerEmail,
        passenger_phone: passengerPhone,
        seat_number: selectedSeat,
        cabin_class: isBusinessSeat ? 'Business' : flight.cabin_class
      });

      // Fire victory confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setCompletedBooking(res.booking);
    } catch (err) {
      setErrorMsg(err.message || 'Booking process failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 1.5rem' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <button onClick={onBack} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Back to Search Results
        </button>

        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff' }}>
          Flight Booking & Seat Reservation
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)', fontSize: '0.85rem', fontWeight: '700' }}>
          <ShieldCheck size={18} /> SSL Secured
        </div>
      </div>

      {errorMsg && (
        <div className="toast-alert toast-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} /> {errorMsg}
        </div>
      )}

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Column: Interactive Seat Selector */}
        <section className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff' }}>Select Aircraft Seat</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Flight {flight.flight_number} • {flight.aircraft}</p>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: '700' }}>
              {flight.origin_code} ✈ {flight.destination_code}
            </span>
          </div>

          <SeatSelector 
            flight={flight}
            reservedSeats={reservedSeats}
            selectedSeat={selectedSeat}
            onSelectSeat={(seat) => setSelectedSeat(seat)}
          />
        </section>

        {/* Right Column: Passenger Info & Checkout Summary */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Passenger Information Card */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Passenger Details
            </h3>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name (as on Passport / ID)</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    required
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '2.5rem' }}
                  />
                  <User size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email (for E-Ticket delivery)</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="email" 
                    required
                    value={passengerEmail}
                    onChange={(e) => setPassengerEmail(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '2.5rem' }}
                  />
                  <Mail size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '2.5rem' }}
                  />
                  <Phone size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>
            </form>
          </div>

          {/* Fare Summary & Payment */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Fare Breakdown
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Base Flight Fare ({flight.airline}):</span>
                <span style={{ color: '#fff', fontWeight: '600' }}>${basePrice}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Seat Reservation ({selectedSeat}):</span>
                <span style={{ color: 'var(--success)', fontWeight: '600' }}>+${seatFee}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Airport & Government Fees:</span>
                <span style={{ color: '#fff', fontWeight: '600' }}>+${airportTax}</span>
              </div>

              <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '800' }}>
                <span>Total Amount:</span>
                <span style={{ color: 'var(--accent-gold)' }}>${totalPrice}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Payment Method</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: paymentMethod === 'card' ? 'var(--primary)' : 'var(--border-color)',
                    background: paymentMethod === 'card' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <CreditCard size={16} /> Credit Card
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: paymentMethod === 'upi' ? 'var(--primary)' : 'var(--border-color)',
                    background: paymentMethod === 'upi' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Instant Pay / Wallet
                </button>
              </div>
            </div>

            {/* Submit Confirmation Button */}
            <button
              onClick={handleConfirmBooking}
              disabled={submitting || !selectedSeat}
              className="btn-accent"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem' }}
            >
              {submitting ? 'Processing Booking...' : `Confirm & Pay $${totalPrice}`}
            </button>
          </div>

        </section>

      </div>

      {/* Boarding Pass Confirmation Modal */}
      {completedBooking && (
        <BoardingPassModal 
          booking={completedBooking}
          onClose={() => {
            setCompletedBooking(null);
            onBookingComplete();
          }}
        />
      )}

    </div>
  );
}
