import React from 'react';

export default function SearchBar({ searchQuery, onSearchChange, onSearchSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit();
  };

  return (
    <section className="search-section" aria-label="Search Events">
      <form className="search-box" onSubmit={handleSubmit}>
        <span className="search-icon">🔍</span>
        <input
          type="text"
          id="searchInput"
          placeholder="Search movies, cricket, concerts, cities or venues..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            className="search-clear"
            onClick={() => onSearchChange('')}
            title="Clear search"
          >
            ✕
          </button>
        )}
        <button type="submit" className="search-submit-btn">
          Search
        </button>
      </form>
    </section>
  );
}

