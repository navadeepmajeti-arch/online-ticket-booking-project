import React, { useEffect } from 'react';

export default function TicketModal({ booking, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!booking) return null;

  return (
    <div
      className="modal-overlay"
      id="ticketModal"
      onClick={(e) => {
        if (e.target.classList.contains('modal-overlay')) onClose();
      }}
    >
      <div className="modal-card ticket-wrapper" role="dialog" aria-modal="true">
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close ticket modal"
        >
          ×
        </button>

        <div className="ticket-header">
          <div className="ticket-icon">🎟️</div>
          <h2>Booking Confirmed!</h2>
          <p>Your digital ticket is ready. Show this at the entry gate.</p>
        </div>

        <div className="ticket-pass">
          <div className="ticket-details">
            <div className="ticket-detail-item">
              <span className="label">Event</span>
              <span className="val">{booking.event}</span>
            </div>
            <div className="ticket-detail-item">
              <span className="label">Seats</span>
              <span className="val">{booking.seats ? booking.seats.join(', ') : 'N/A'}</span>
            </div>
            <div className="ticket-detail-item">
              <span className="label">Booking ID</span>
              <span className="val" style={{ fontFamily: 'monospace' }}>{booking.id}</span>
            </div>
            <div className="ticket-detail-item">
              <span className="label">Booked By</span>
              <span className="val">{booking.customerName || booking.email}</span>
            </div>
            <div className="ticket-detail-item">
              <span className="label">Date & Time</span>
              <span className="val">{booking.date}</span>
            </div>
            <div className="ticket-detail-item">
              <span className="label">Total Paid</span>
              <span className="val highlight">₹{booking.total}</span>
            </div>
          </div>

          <div className="qr-code-box">
            <div className="qr-code-ascii">
              █▀▀▀█ █▀█ █▀▀▀█<br />
              █ █ █ ▀▀█ █ █ █<br />
              █▄▄▄█ █▀█ █▄▄▄█<br />
              ▀▀▀▀▀ ▀ ▀ ▀▀▀▀▀
            </div>
            <span className="qr-hint">VERIFIED TICKET #{booking.id}</span>
          </div>
        </div>

        <div className="ticket-actions">
          <button
            type="button"
            className="print-btn"
            onClick={() => window.print()}
          >
            🖨️ Print Ticket
          </button>
          <button
            type="button"
            className="ticket-close-btn"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

