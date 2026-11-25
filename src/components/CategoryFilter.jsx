import React from 'react';

const CATEGORIES = [
  { id: 'all', label: '🎟️ All Events' },
  { id: 'movie', label: '🎬 Movies' },
  { id: 'sports', label: '🏏 Sports' },
  { id: 'music', label: '🎵 Music' }
];

export default function CategoryFilter({ activeCategory, onSelectCategory }) {
  return (
    <section className="categories" id="events">
      <h2>Explore Categories</h2>
      <div className="category-container">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={activeCategory === cat.id ? 'active' : ''}
            onClick={() => onSelectCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </section>
  );
}

