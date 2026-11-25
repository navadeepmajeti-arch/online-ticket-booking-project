import React, { useState, useEffect } from 'react';
import { SEAT_NAMES } from '../data/initialEvents';

export default function BookingModal({
  event,
  bookedSeats = [],
  onClose,
  onConfirmBooking,
  promotion,
  addToast
}) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!event) return null;

  const handleSeatClick = (seatName) => {
    if (bookedSeats.includes(seatName)) return;

    if (selectedSeats.includes(seatName)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatName));
    } else {
      if (selectedSeats.length >= 5) {
        addToast('You can select a maximum of 5 seats at a time.', 'warning');
        return;
      }
      setSelectedSeats([...selectedSeats, seatName]);
    }
  };

  const subtotal = event.price * selectedSeats.length;
  // If promotion exists and contains a % discount (e.g., "10% festival offer")
  let discountAmount = 0;
  if (promotion) {
    const match = promotion.match(/(\d+)%/);
    if (match && match[1]) {
      const percent = parseInt(match[1], 10);
      if (!isNaN(percent) && percent > 0 && percent <= 100) {
        discountAmount = Math.round((subtotal * percent) / 100);
      }
    }
  }
  const grandTotal = Math.max(0, subtotal - discountAmount);

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      addToast('Please select at least one seat before proceeding.', 'warning');
      return;
    }
    onConfirmBooking({
      event,
      seats: selectedSeats,
      subtotal,
      discount: discountAmount,
      total: grandTotal
    });
  };

  return (
    <div
      className="modal-overlay"
      id="bookingModal"
      onClick={(e) => {
        if (e.target.classList.contains('modal-overlay')) onClose();
      }}
    >
      <div className="modal-card booking-box" role="dialog" aria-modal="true">
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close booking modal"
        >
          ×
        </button>

        <h2>Book Tickets: {event.title}</h2>
        <p className="booking-subtitle">
          <span>{event.venue}</span> • <span>₹{event.price} per seat</span>
        </p>

        <div className="screen-container">
          <div className="screen">SCREEN / STAGE</div>
          <div className="screen-curve" />
        </div>

        <div className="seat-container" id="seatContainer">
          {SEAT_NAMES.map((name) => {
            const isBooked = bookedSeats.includes(name);
            const isSelected = selectedSeats.includes(name);

            return (
              <button
                key={name}
                type="button"
                className={`seat ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSeatClick(name)}
                disabled={isBooked}
                title={isBooked ? `Seat ${name} is already booked` : `Seat ${name}`}
              >
                {name}
              </button>
            );
          })}
        </div>

        <div className="seat-info">
          <div className="seat-legend-item">
            <span className="seat-sample avail" />
            <span>Available</span>
          </div>
          <div className="seat-legend-item">
            <span className="seat-sample sel" />
            <span>Selected</span>
          </div>
          <div className="seat-legend-item">
            <span className="seat-sample book" />
            <span>Booked</span>
          </div>
        </div>

        <div className="booking-summary-box">
          <div className="booking-summary-row">
            <span>Selected Seats:</span>
            <strong>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</strong>
          </div>
          <div className="booking-summary-row">
            <span>Seat Count:</span>
            <span>{selectedSeats.length} {selectedSeats.length === 1 ? 'ticket' : 'tickets'}</span>
          </div>
          {discountAmount > 0 && (
            <div className="booking-summary-row" style={{ color: '#16a34a' }}>
              <span>Promo Discount:</span>
              <span>-₹{discountAmount}</span>
            </div>
          )}
          <div className="booking-summary-row total-row">
            <span>Grand Total:</span>
            <strong>₹{grandTotal}</strong>
          </div>
        </div>

        <button
          type="button"
          className="payment-btn"
          onClick={handleProceed}
          disabled={selectedSeats.length === 0}
        >
          💳 Confirm & Pay (₹{grandTotal})
        </button>
      </div>
    </div>
  );
}

