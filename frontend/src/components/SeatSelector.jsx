import React from 'react';
import { Armchair, Shield, Sparkles, CheckCircle } from 'lucide-react';

export default function SeatSelector({ flight, reservedSeats = [], selectedSeat, onSelectSeat }) {
  // Generate rows (1 to 8, columns A B C D)
  const rows = [1, 2, 3, 4, 5, 6, 7, 8];
  const columns = ['A', 'B', 'C', 'D'];

  const getSeatCategory = (row) => {
    return row <= 2 ? 'Business' : 'Economy';
  };

  const getSeatFee = (seatNum) => {
    const row = parseInt(seatNum);
    return row <= 2 ? 150 : 0;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
      
      {/* Cockpit Graphic Header */}
      <div style={{ margin: '0 auto', maxWidth: '300px', padding: '0.5rem 1rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px dashed var(--primary)', borderRadius: '30px 30px 10px 10px', color: 'var(--primary)', fontWeight: '700', fontSize: '0.85rem' }}>
        ✈️ Aircraft Cockpit / Front
      </div>

      {/* Seat Map Legend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ width: '16px', height: '16px', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
          <span style={{ color: 'var(--text-muted)' }}>Available</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ width: '16px', height: '16px', background: '#10b981', borderRadius: '4px' }} />
          <span style={{ color: '#fff', fontWeight: '600' }}>Selected</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ width: '16px', height: '16px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '4px' }} />
          <span style={{ color: 'var(--text-muted)' }}>Booked</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ width: '16px', height: '16px', border: '1px solid var(--accent-gold)', borderRadius: '4px' }} />
          <span style={{ color: 'var(--accent-gold)' }}>Business (+$150)</span>
        </div>
      </div>

      {/* Aircraft Fuselage seating area */}
      <div 
        style={{
          background: 'rgba(15, 23, 42, 0.7)',
          padding: '2rem 1.5rem',
          borderRadius: '40px',
          border: '1px solid var(--border-color)',
          maxWidth: '520px',
          margin: '0 auto',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {rows.map((row) => {
            const isBusiness = row <= 2;

            return (
              <div key={row} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                <span style={{ width: '24px', fontSize: '0.8rem', fontWeight: '700', color: isBusiness ? 'var(--accent-gold)' : 'var(--text-dim)' }}>
                  R{row}
                </span>

                {columns.map((col, index) => {
                  const seatNum = `${row}${col}`;
                  const isTaken = reservedSeats.includes(seatNum);
                  const isSelected = selectedSeat === seatNum;
                  const isAisleRight = index === 1; // Aisle after B column

                  return (
                    <React.Fragment key={seatNum}>
                      <button
                        type="button"
                        onClick={() => !isTaken && onSelectSeat(seatNum)}
                        disabled={isTaken}
                        className={`seat-btn ${isSelected ? 'selected' : ''} ${isTaken ? 'taken' : ''} ${isBusiness ? 'first-class' : ''}`}
                        title={isTaken ? `Seat ${seatNum} is booked` : `Seat ${seatNum} (${isBusiness ? 'Business +$150' : 'Standard'})`}
                      >
                        {seatNum}
                      </button>

                      {isAisleRight && (
                        <div style={{ width: '30px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.7rem', fontWeight: '600' }}>
                          AISLE
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            );
          })}

        </div>
      </div>

      {/* Selected Seat Summary Card */}
      {selectedSeat ? (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '520px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left' }}>
            <CheckCircle size={24} color="#10b981" />
            <div>
              <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.95rem' }}>
                Seat {selectedSeat} Selected
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {getSeatCategory(parseInt(selectedSeat))} Cabin
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--success)' }}>
              +${getSeatFee(selectedSeat)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Seat Fee</div>
          </div>
        </div>
      ) : (
        <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontStyle: 'italic' }}>
          👉 Please click on an available seat to proceed with booking.
        </div>
      )}

    </div>
  );
}
