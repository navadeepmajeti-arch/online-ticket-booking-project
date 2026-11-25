import React, { useEffect } from 'react';

export default function UserBookingsModal({
  isOpen,
  onClose,
  currentUser,
  bookings = [],
  onSelectBooking
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !currentUser) return null;

  const userBookings = bookings.filter(
    (b) => b.email && b.email.toLowerCase() === currentUser.email.toLowerCase()
  );

  return (
    <div
      className="modal-overlay"
      id="userBookingsModal"
      onClick={(e) => {
        if (e.target.classList.contains('modal-overlay')) onClose();
      }}
    >
      <div className="modal-card user-bookings-card" role="dialog" aria-modal="true">
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close my bookings"
        >
          ×
        </button>

        <h2>My Bookings</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '18px' }}>
          Here are your confirmed tickets. You can view or reprint your digital passes anytime.
        </p>

        {userBookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>🎫</div>
            <p>You haven't booked any tickets yet.</p>
          </div>
        ) : (
          <div className="bookings-list">
            {[...userBookings].reverse().map((booking) => (
              <div key={booking.id} className="booking-history-item">
                <div className="booking-info">
                  <h4>{booking.event}</h4>
                  <p>
                    <strong>Seats:</strong> {booking.seats ? booking.seats.join(', ') : 'N/A'} •{' '}
                    <strong>Amount:</strong> ₹{booking.total}
                  </p>
                  <p style={{ fontSize: '12px', marginTop: '2px' }}>
                    ID: <code>{booking.id}</code> • {booking.date}
                  </p>
                </div>
                <button
                  type="button"
                  className="view-pass-btn"
                  onClick={() => {
                    onSelectBooking(booking);
                    onClose();
                  }}
                >
                  View Pass 🎟️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

