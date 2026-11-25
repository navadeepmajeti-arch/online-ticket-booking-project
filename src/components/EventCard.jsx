import React from 'react';

export default function EventCard({ event, onBook }) {
  const { title, category, categoryLabel, price, genre, venue, date, rating, image } = event;

  return (
    <article className={`event-card ${category}`} data-event={title} data-price={price}>
      <div
        className="event-image"
        style={{ backgroundImage: `url("${image}")` }}
      >
        <div className="event-image-overlay" />
        <span className={`event-type ${category}`}>{categoryLabel || category.toUpperCase()}</span>
        <span className="rating">{rating}</span>
      </div>

      <div className="event-details">
        <h3>{title}</h3>
        <p className="event-meta">{genre}</p>
        <p className="event-meta">{venue}</p>
        <p className="event-meta">{date}</p>

        <div className="event-bottom">
          <div className="event-price">
            <span>Starting from</span>
            <strong>₹{price}</strong>
          </div>
          <button
            type="button"
            className="book-btn"
            onClick={() => onBook(event)}
          >
            Book Now
          </button>
        </div>
      </div>
    </article>
  );
}

