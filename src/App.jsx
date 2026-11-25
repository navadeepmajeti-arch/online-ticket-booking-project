import React, { useState, useEffect, useMemo } from 'react';
import { initialEvents } from './data/initialEvents';
import Header from './components/Header';
import PromoBanner from './components/PromoBanner';
import Hero from './components/Hero';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import EventCard from './components/EventCard';
import BookingModal from './components/BookingModal';
import TicketModal from './components/TicketModal';
import AuthModal from './components/AuthModal';
import AdminModal from './components/AdminModal';
import UserBookingsModal from './components/UserBookingsModal';
import Footer from './components/Footer';
import NotificationToast from './components/NotificationToast';

export default function App() {
  // ---- STATE: Events ----
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('tixhubEvents');
      return saved ? JSON.parse(saved) : initialEvents;
    } catch {
      return initialEvents;
    }
  });

  // ---- STATE: Filter & Search ----
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ---- STATE: Auth & Users ----
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tixhubCurrentUser')) || null;
    } catch {
      return null;
    }
  });

  const [users, setUsers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tixhubUsers')) || [];
    } catch {
      return [];
    }
  });

  // ---- STATE: Bookings & Seats ----
  const [bookedSeats, setBookedSeats] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tixhubBookedSeats')) || {};
    } catch {
      return {};
    }
  });

  const [bookings, setBookings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tixhubBookings')) || [];
    } catch {
      return [];
    }
  });

  // ---- STATE: Promotion ----
  const [promotion, setPromotion] = useState(() => {
    return localStorage.getItem('tixhubPromotion') || '';
  });

  // ---- STATE: Modals ----
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [userBookingsOpen, setUserBookingsOpen] = useState(false);
  const [selectedEventForBooking, setSelectedEventForBooking] = useState(null);
  const [activeTicket, setActiveTicket] = useState(null);

  // ---- STATE: Toast Notifications ----
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // ---- SYNCHRONIZE WITH LOCALSTORAGE ----
  useEffect(() => {
    try {
      localStorage.setItem('tixhubEvents', JSON.stringify(events));
    } catch (e) {
      console.error(e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem('tixhubUsers', JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('tixhubCurrentUser', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('tixhubCurrentUser');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('tixhubBookedSeats', JSON.stringify(bookedSeats));
    } catch (e) {
      console.error(e);
    }
  }, [bookedSeats]);

  useEffect(() => {
    try {
      localStorage.setItem('tixhubBookings', JSON.stringify(bookings));
    } catch (e) {
      console.error(e);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      if (promotion) {
        localStorage.setItem('tixhubPromotion', promotion);
      } else {
        localStorage.removeItem('tixhubPromotion');
      }
    } catch (e) {
      console.error(e);
    }
  }, [promotion]);

  // ---- NAVIGATION & SCROLLING ----
  const scrollToEvents = () => {
    const el = document.getElementById('events-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ---- AUTH ACTIONS ----
  const handleOpenLogin = () => setAuthModal({ isOpen: true, mode: 'login' });
  const handleOpenSignup = () => setAuthModal({ isOpen: true, mode: 'signup' });
  const handleCloseAuth = () => setAuthModal({ isOpen: false, mode: 'login' });

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    addToast('You have been logged out.', 'info');
  };

  // ---- BOOKING FLOW ----
  const handleOpenBooking = (event) => {
    if (!currentUser) {
      addToast('Please login or create an account before booking tickets.', 'warning');
      handleOpenLogin();
      return;
    }
    setSelectedEventForBooking(event);
  };

  const handleConfirmBooking = ({ event, seats, subtotal, discount, total }) => {
    const bookingId = 'TH' + Math.floor(100000 + Math.random() * 900000);
    const dateFormatted = new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newBooking = {
      id: bookingId,
      event: event.title,
      seats: seats,
      subtotal: subtotal,
      discount: discount,
      total: total,
      email: currentUser.email,
      customerName: currentUser.name,
      date: dateFormatted
    };

    // Update booked seats for this specific event
    const eventKey = event.title;
    const existing = bookedSeats[eventKey] || [];
    const updatedBookedSeats = {
      ...bookedSeats,
      [eventKey]: [...existing, ...seats]
    };

    setBookedSeats(updatedBookedSeats);
    setBookings((prev) => [...prev, newBooking]);

    setSelectedEventForBooking(null);
    setActiveTicket(newBooking);
    addToast(`Seats confirmed for ${event.title}!`, 'success');
  };

  // ---- ADMIN ACTIONS ----
  const handleSavePromotion = (newPromo) => {
    setPromotion(newPromo);
  };

  const handleClearPromotion = () => {
    setPromotion('');
  };

  const handleAddEvent = (createdEvent) => {
    setEvents((prev) => [createdEvent, ...prev]);
  };

  // ---- FILTERED EVENTS COMPUTATION ----
  const filteredEvents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return events.filter((evt) => {
      // Category check
      const matchesCategory =
        activeCategory === 'all' || evt.category.toLowerCase() === activeCategory.toLowerCase();

      // Search check
      const textToSearch = `${evt.title} ${evt.genre} ${evt.venue} ${evt.category} ${evt.date}`.toLowerCase();
      const matchesSearch = !q || textToSearch.includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [events, activeCategory, searchQuery]);

  return (
    <div className="app-root">
      {/* Toast Notifications */}
      <NotificationToast toasts={toasts} onDismiss={removeToast} />

      {/* Promotion Announcement Banner */}
      <PromoBanner promotion={promotion} />

      {/* Global Navigation Header */}
      <Header
        currentUser={currentUser}
        onOpenLogin={handleOpenLogin}
        onOpenSignup={handleOpenSignup}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onOpenBookings={() => setUserBookingsOpen(true)}
        onLogout={handleLogout}
        onSelectCategory={(cat) => setActiveCategory(cat)}
        onScrollToEvents={scrollToEvents}
      />

      {/* Hero Showcase Section */}
      <Hero onExploreClick={scrollToEvents} />

      {/* Real-time Search Box */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={scrollToEvents}
      />

      {/* Category Pills & Count Anchor */}
      <div id="events-anchor">
        <CategoryFilter
          activeCategory={activeCategory}
          onSelectCategory={(cat) => setActiveCategory(cat)}
        />
      </div>

      {/* Events Listing Section */}
      <section className="events-section">
        <div className="section-heading">
          <div>
            <p className="section-label">DON'T MISS OUT</p>
            <h2>
              {activeCategory === 'all'
                ? 'Popular Events'
                : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Events`}
            </h2>
          </div>
          <span className="event-count-badge" id="eventCount">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'}
          </span>
        </div>

        <div className="event-container" id="eventContainer">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((evt) => (
              <EventCard
                key={evt.id || evt.title}
                event={evt}
                onBook={handleOpenBooking}
              />
            ))
          ) : (
            <div className="no-events-box">
              <h3>No events match your search</h3>
              <p>Try searching for a different keyword or browse all categories.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      {selectedEventForBooking && (
        <BookingModal
          event={selectedEventForBooking}
          bookedSeats={bookedSeats[selectedEventForBooking.title] || []}
          onClose={() => setSelectedEventForBooking(null)}
          onConfirmBooking={handleConfirmBooking}
          promotion={promotion}
          addToast={addToast}
        />
      )}

      {activeTicket && (
        <TicketModal
          booking={activeTicket}
          onClose={() => setActiveTicket(null)}
        />
      )}

      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={handleCloseAuth}
        onLoginSuccess={handleLoginSuccess}
        getUsers={() => users}
        saveUsers={(updated) => setUsers(updated)}
        addToast={addToast}
      />

      <AdminModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        users={users}
        bookings={bookings}
        promotion={promotion}
        onSavePromotion={handleSavePromotion}
        onClearPromotion={handleClearPromotion}
        onAddEvent={handleAddEvent}
        addToast={addToast}
      />

      <UserBookingsModal
        isOpen={userBookingsOpen}
        onClose={() => setUserBookingsOpen(false)}
        currentUser={currentUser}
        bookings={bookings}
        onSelectBooking={(b) => setActiveTicket(b)}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => setActiveCategory(cat)}
        onScrollToEvents={scrollToEvents}
      />
    </div>
  );
}

