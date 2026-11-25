import React, { useState, useEffect } from 'react';

export default function AdminModal({
  isOpen,
  onClose,
  users = [],
  bookings = [],
  promotion,
  onSavePromotion,
  onClearPromotion,
  onAddEvent,
  addToast
}) {
  const [promoInput, setPromoInput] = useState('');
  const [showAddEvent, setShowAddEvent] = useState(false);

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'movie',
    categoryLabel: 'MOVIE',
    price: '',
    genre: '',
    venue: '',
    date: '',
    rating: '⭐ 8.5',
    image: ''
  });

  useEffect(() => {
    setPromoInput(promotion || '');
  }, [promotion]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalSales = bookings.reduce((sum, b) => sum + (Number(b.total) || 0), 0);

  const handleSavePromo = (e) => {
    e.preventDefault();
    const clean = promoInput.trim();
    if (!clean) {
      addToast('Please enter a promotion description.', 'warning');
      return;
    }
    onSavePromotion(clean);
    addToast('Promotion updated successfully!', 'success');
  };

  const handleClearPromo = () => {
    onClearPromotion();
    setPromoInput('');
    addToast('Promotion removed.', 'info');
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !newEvent.price || !newEvent.venue.trim()) {
      addToast('Please fill all required event details.', 'error');
      return;
    }

    const defaultImages = {
      movie: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
      sports: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80',
      music: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80'
    };

    const created = {
      id: `evt-${Date.now()}`,
      title: newEvent.title.trim(),
      category: newEvent.category,
      categoryLabel: newEvent.category.toUpperCase(),
      price: Number(newEvent.price),
      genre: newEvent.genre.trim() || 'General Admission',
      venue: newEvent.venue.trim(),
      date: newEvent.date.trim() || 'Upcoming',
      rating: newEvent.rating.trim() || '⭐ 8.5',
      image: newEvent.image.trim() || defaultImages[newEvent.category]
    };

    onAddEvent(created);
    addToast(`Added "${created.title}" to events list!`, 'success');
    setShowAddEvent(false);
    setNewEvent({
      title: '',
      category: 'movie',
      categoryLabel: 'MOVIE',
      price: '',
      genre: '',
      venue: '',
      date: '',
      rating: '⭐ 8.5',
      image: ''
    });
  };

  return (
    <div
      className="modal-overlay"
      id="adminModal"
      onClick={(e) => {
        if (e.target.classList.contains('modal-overlay')) onClose();
      }}
    >
      <div className="modal-card admin-modal-card" role="dialog" aria-modal="true">
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close admin dashboard"
        >
          ×
        </button>

        <div className="admin-header">
          <h2>Admin Management Dashboard</h2>
          <p>Real-time analytics, promotion campaign controls, and bookings monitor.</p>
        </div>

        {/* Analytics stats */}
        <div className="admin-stats">
          <div className="stat-card">
            <strong>{users.length}</strong>
            <span>Registered Users</span>
          </div>
          <div className="stat-card">
            <strong>{bookings.length}</strong>
            <span>Completed Bookings</span>
          </div>
          <div className="stat-card">
            <strong>₹{totalSales.toLocaleString('en-IN')}</strong>
            <span>Total Revenue</span>
          </div>
        </div>

        {/* Promotion Management */}
        <div className="admin-section">
          <h3>📣 Active Promotion Campaign</h3>
          <form className="promo-form" onSubmit={handleSavePromo}>
            <input
              type="text"
              placeholder="e.g. 10% festival offer or FLAT100 discount"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
            />
            <button type="submit">Save Promo</button>
            {promotion && (
              <button
                type="button"
                className="promo-clear-btn"
                onClick={handleClearPromo}
              >
                Clear
              </button>
            )}
          </form>
          <p className="current-promo-status">
            {promotion ? (
              <span>
                <strong>Live Banner:</strong> 🎉 {promotion}
              </span>
            ) : (
              <em>No active promotion configured right now.</em>
            )}
          </p>
        </div>

        {/* Add Event Module */}
        <div className="admin-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>🎟️ Add New Event</h3>
            <button
              type="button"
              onClick={() => setShowAddEvent(!showAddEvent)}
              style={{
                background: showAddEvent ? '#64748b' : '#e63946',
                color: 'white',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px'
              }}
            >
              {showAddEvent ? 'Cancel' : '+ Add Event'}
            </button>
          </div>

          {showAddEvent && (
            <form onSubmit={handleCreateEvent} style={{ marginTop: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Event Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Inception Re-release"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                  >
                    <option value="movie">🎬 Movie</option>
                    <option value="sports">🏏 Sports</option>
                    <option value="music">🎵 Music</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price in ₹ *</label>
                  <input
                    type="number"
                    placeholder="e.g. 250"
                    value={newEvent.price}
                    onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Genre / Subtype</label>
                  <input
                    type="text"
                    placeholder="e.g. English • Sci-Fi / Thriller"
                    value={newEvent.genre}
                    onChange={(e) => setNewEvent({ ...newEvent, genre: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Venue *</label>
                  <input
                    type="text"
                    placeholder="e.g. PVR Forum Mall, Bengaluru"
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="text"
                    placeholder="e.g. 28 October 2026"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Image URL (optional)</label>
                <input
                  type="url"
                  placeholder="Paste Unsplash or direct image URL (optional)"
                  value={newEvent.image}
                  onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })}
                />
              </div>
              <button
                type="submit"
                style={{
                  background: '#16a34a',
                  color: 'white',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  marginTop: '8px'
                }}
              >
                Publish Event
              </button>
            </form>
          )}
        </div>

        {/* Recent Bookings List */}
        <div className="admin-section">
          <h3>📋 Recent Bookings ({bookings.length})</h3>
          {bookings.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '13px', fontStyle: 'italic' }}>
              No tickets booked yet.
            </p>
          ) : (
            <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
              <table className="admin-bookings-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>User</th>
                    <th>Event</th>
                    <th>Seats</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {[...bookings].reverse().map((b) => (
                    <tr key={b.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{b.id}</td>
                      <td>{b.customerName || b.email}</td>
                      <td>{b.event}</td>
                      <td>{b.seats ? b.seats.join(', ') : 'N/A'}</td>
                      <td style={{ color: '#e63946', fontWeight: 'bold' }}>₹{b.total}</td>
                      <td style={{ color: '#64748b', fontSize: '12px' }}>{b.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

