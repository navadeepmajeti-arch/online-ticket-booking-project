import React from 'react';

export default function Hero({ onExploreClick }) {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <p className="small-title">BOOK YOUR EXPERIENCE</p>
        <h1>
          Movies. Sports.<br />
          <span>Music & More.</span>
        </h1>
        <p>
          Discover and book tickets for the best movies, cricket matches,
          concerts, and live events near you with instant confirmation.
        </p>
        <button
          type="button"
          className="explore-btn"
          onClick={onExploreClick}
        >
          Explore Events →
        </button>
      </div>
    </section>
  );
}

