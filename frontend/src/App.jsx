import React, { useState, useEffect } from 'react';
import AuthModule from './AuthModule.jsx';
import JantaKoAwajModule from './JantaKoAwajModule.jsx';

function generateGuestId() {
  return 'guest_' + Math.random().toString(36).substr(2, 9);
}

export default function App() {
  const [user, setUser] = useState(null);
  const [guestId, setGuestId] = useState(null);

  useEffect(() => {
    // Generate guest ID fresh every time if no logged-in user
    if (!user) {
      setGuestId(generateGuestId());
    } else {
      setGuestId(null);
    }
  }, [user]);

  // Function called by AuthModule on successful login/signup
  const handleLogin = (userId, email) => {
    setUser({ userId, email });
  };

  // Logout by clearing user state
  const handleLogout = () => {
    setUser(null);
  };

  // Render login/signup UI when no user
  if (!user) {
    return <AuthModule onLogin={handleLogin} />;
  }

  const votingUserId = user ? user.userId : guestId;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#6a0dad', color: '#fff' }}>
      <header style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        height: '70px',
        backgroundColor: '#7a3ea0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2rem',
        boxSizing: 'border-box',
        borderRadius: '0 0 25px 25px',
        fontSize: '1.8rem',
        fontWeight: '700',
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}>
        <h2 style={{ margin: 0, color: '#fff' }}>Welcome, {user.email}!</h2>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#551a8b',
            border: 'none',
            borderRadius: '20px',
            color: 'white',
            cursor: 'pointer',
            padding: '0.5rem 1.5rem',
            fontSize: '1rem',
          }}
        >
          Logout
        </button>
      </header>

      {/* Padding top on main content to avoid header overlap */}
      <main style={{ paddingTop: '90px', paddingLeft: '2rem', paddingRight: '2rem' }}>
        <JantaKoAwajModule userId={votingUserId} />
      </main>
    </div>
  );
}
