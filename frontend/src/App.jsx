import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import BookingCheckoutPage from './pages/BookingCheckoutPage';
import MyBookingsPage from './pages/MyBookingsPage';

import { useAuth } from './context/AuthContext';

export default function App() {
  const { isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'search-results' | 'checkout' | 'my-bookings'
  const [searchParams, setSearchParams] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [authModalMode, setAuthModalMode] = useState(null); // null | 'login' | 'signup'

  // Trigger search from HomePage
  const handleSearch = (params) => {
    setSearchParams(params);
    setActiveTab('search-results');
  };

  // Select destination directly from showcase card
  const handleSelectDestination = (destCode) => {
    setSearchParams({
      origin: 'New York',
      destination: destCode,
      departureDate: '2026-09-10',
      cabin_class: 'All',
      passengers: 1
    });
    setActiveTab('search-results');
  };

  // Select flight from SearchResultsPage -> Navigate to Checkout (requires Auth)
  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
    if (!isAuthenticated) {
      setAuthModalMode('login');
    } else {
      setActiveTab('checkout');
    }
  };

  const handleBookingComplete = () => {
    setActiveTab('my-bookings');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Top Glass Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        openAuthModal={(mode) => setAuthModalMode(mode)}
      />

      {/* Main View Router */}
      <main style={{ flex: 1, padding: '2rem 0' }}>
        {activeTab === 'home' && (
          <HomePage 
            onSearch={handleSearch} 
            onSelectDestination={handleSelectDestination} 
          />
        )}

        {activeTab === 'search-results' && (
          <SearchResultsPage 
            searchParams={searchParams}
            onSelectFlight={handleSelectFlight}
            onBackToSearch={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'checkout' && selectedFlight && (
          <BookingCheckoutPage 
            flight={selectedFlight}
            onBack={() => setActiveTab('search-results')}
            onBookingComplete={handleBookingComplete}
          />
        )}

        {activeTab === 'my-bookings' && (
          <MyBookingsPage 
            onExploreFlights={() => setActiveTab('home')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Sign Up / Login Modal */}
      {authModalMode && (
        <AuthModal 
          initialMode={authModalMode}
          onClose={() => {
            setAuthModalMode(null);
            if (isAuthenticated && selectedFlight) {
              setActiveTab('checkout');
            }
          }}
        />
      )}

    </div>
  );
}
