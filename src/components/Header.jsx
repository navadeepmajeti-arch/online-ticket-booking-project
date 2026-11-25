import React from 'react';

export default function Header({
  currentUser,
  onOpenLogin,
  onOpenSignup,
  onOpenAdmin,
  onOpenBookings,
  onLogout,
  onSelectCategory,
  onScrollToEvents
}) {
  return (
    <header>
      <div
        className="logo"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (onSelectCategory) onSelectCategory('all');
        }}
        role="button"
        tabIndex={0}
      >
        🎟️ Tix<span>Hub</span>
      </div>

      <nav aria-label="Main Navigation">
        <a href="#home">Home</a>
        <button
          type="button"
          className="nav-link"
          onClick={() => {
            onSelectCategory('all');
            onScrollToEvents();
          }}
        >
          Events
        </button>
        <button
          type="button"
          className="nav-link"
          onClick={() => {
            onSelectCategory('movie');
            onScrollToEvents();
          }}
        >
          Movies
        </button>
        <button
          type="button"
          className="nav-link"
          onClick={() => {
            onSelectCategory('sports');
            onScrollToEvents();
          }}
        >
          Sports
        </button>
        <button
          type="button"
          className="nav-link"
          onClick={() => {
            onSelectCategory('music');
            onScrollToEvents();
          }}
        >
          Music
        </button>
      </nav>

      <div className="header-actions">
        {currentUser ? (
          <>
            <span className="user-badge">
              👤 Hi, {currentUser.name}
            </span>
            <button
              type="button"
              className="my-bookings-btn"
              onClick={onOpenBookings}
              title="View your booked tickets"
            >
              🎟️ My Bookings
            </button>
            {currentUser.role === 'admin' && (
              <button
                type="button"
                className="admin-btn"
                onClick={onOpenAdmin}
              >
                ⚙️ Admin
              </button>
            )}
            <button
              type="button"
              className="logout-btn"
              onClick={onLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="login-btn"
              onClick={onOpenLogin}
            >
              Login
            </button>
            <button
              type="button"
              className="signup-btn"
              onClick={onOpenSignup}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
}

