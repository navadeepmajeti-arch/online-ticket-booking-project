import React from 'react';

export default function PromoBanner({ promotion }) {
  if (!promotion) return null;

  return (
    <aside className="promo-banner" aria-label="Current Promotion">
      <span className="promo-badge">Special Offer</span>
      <span>🎉 {promotion}</span>
    </aside>
  );
}

