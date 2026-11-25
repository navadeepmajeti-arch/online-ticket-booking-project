import React from 'react';

export default function Footer({ onSelectCategory, onScrollToEvents }) {
  return (
    <footer>
      <div className="footer-logo">
        🎟️ Tix<span>Hub</span>
      </div>
      <p>
        Your premium one-stop destination for movies, sports, live concerts,
        and unforgettable events across India.
      </p>

      <div className="footer-links">
        <a href="#home">Home</a>
        <button
          type="button"
          onClick={() => {
            onSelectCategory('all');
            onScrollToEvents();
          }}
        >
          All Events
        </button>
        <button
          type="button"
          onClick={() => {
            onSelectCategory('movie');
            onScrollToEvents();
          }}
        >
          Movies
        </button>
        <button
          type="button"
          onClick={() => {
            onSelectCategory('sports');
            onScrollToEvents();
          }}
        >
          Sports
        </button>
        <button
          type="button"
          onClick={() => {
            onSelectCategory('music');
            onScrollToEvents();
          }}
        >
          Music
        </button>
      </div>

      <p className="copyright">
        © {new Date().getFullYear()} TixHub Entertainment Pvt Ltd. All Rights Reserved. Built with React.
      </p>
    </footer>
  );
}

