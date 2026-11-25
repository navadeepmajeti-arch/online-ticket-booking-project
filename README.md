# 🎟️ TixHub - React Ticket Booking Platform

A modern, responsive online ticket booking platform built with **React** and **Vite**, converted and upgraded from the vanilla JavaScript/HTML/CSS project.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Running Locally

1. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000` (or the URL displayed in the terminal).

2. **Build for Production:**
   ```bash
   npm run build
   ```
   The production build will be generated in the `dist` folder.

3. **Preview Production Build:**
   ```bash
   npm run preview
   ```

---

## ✨ Features & Upgrades

### 1. 🎟️ Event Discovery & Dynamic Filtering
- **Category Filters:** All Events, Movies, Sports, and Live Concerts.
- **Instant Search:** Search in real-time across event names, genres, languages, venues, and dates.
- **Dynamic Event Counter:** Live update of matched events.

### 2. 💺 Interactive Seat Selection
- Realistic movie / stage screen orientation with visual curve.
- 18 seats arranged in grid (A1-A6, B1-B6, C1-C6).
- Seat status indicators:
  - 🟩 Available (clickable)
  - 🟦 Selected (with real-time total update)
  - ⬛ Booked (disabled & persistent)
- Maximum 5 seats per booking limit with friendly alerts.
- Live billing summary (quantity, subtotal, promotional discount, grand total).

### 3. 🎫 Digital Ticket & Boarding Pass
- Generates a unique Booking ID (e.g., `TH-482910`).
- Displays event name, seat numbers, customer details, and total amount paid.
- Visual QR code verification graphic.
- **Print Ticket:** One-click print / save to PDF functionality.

### 4. 🔐 Authentication & Session Persistence
- **Sign Up:** Register new users with validation (email, min 6-char password).
- **Login:** Session saved to `localStorage`.
- **Preconfigured Admin Demo Account:**
  - **Email:** `admin@tixhub.com`
  - **Password:** `admin123`
  - (Convenient 1-click autofill button in the login modal!)

### 5. ⚙️ Admin Management Module
- View total registered users, completed bookings count, and total sales revenue in ₹.
- **Promotion Management:** Create or remove promotional offers (e.g. `10% festival offer`) that display across the site.
- **Add New Events:** Dynamically create and publish new movies, matches, or music concerts.
- **Recent Bookings Monitor:** Audit all past customer bookings with ID, seats, and amount.

### 6. 📱 My Bookings
- Logged-in users can view all their past tickets and re-open/print their passes anytime.

---

## 📁 Project Architecture

```
project2/
├── dist/                     # Production build artifacts
├── src/
│   ├── components/
│   │   ├── AdminModal.jsx       # Admin dashboard & management
│   │   ├── AuthModal.jsx        # Login & Signup modal
│   │   ├── BookingModal.jsx     # Seat selection & checkout
│   │   ├── CategoryFilter.jsx   # Filter pills by category
│   │   ├── EventCard.jsx        # Individual event card
│   │   ├── Footer.jsx           # Global footer
│   │   ├── Header.jsx           # Top navigation & user status
│   │   ├── Hero.jsx             # Hero banner
│   │   ├── NotificationToast.jsx# Modern toast alerts
│   │   ├── PromoBanner.jsx      # Active promotion announcement
│   │   ├── SearchBar.jsx        # Search input with clear button
│   │   ├── TicketModal.jsx      # Digital ticket with QR & print
│   │   └── UserBookingsModal.jsx# User's ticket history
│   ├── data/
│   │   └── initialEvents.js     # Default events & seat constants
│   ├── App.jsx                  # Main application orchestrator
│   ├── index.css                # Global stylesheet & design system
│   └── main.jsx                 # React root mount
├── vanilla_backup/              # Original vanilla HTML/JS/CSS files
├── index.html                   # Vite entry HTML
├── package.json                 # Project dependencies & scripts
├── vite.config.js               # Vite configuration
└── README.md                    # Documentation
```

