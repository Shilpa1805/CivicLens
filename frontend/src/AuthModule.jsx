import React, { useEffect, useState } from 'react';
import './AuthModule.css';

export default function AuthModule({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailSuggestions, setEmailSuggestions] = useState([]);

  useEffect(() => {
    // Fetch registered emails for email autocomplete suggestions
    fetch('http://localhost:5000/api/emails')
      .then(res => res.json())
      .then(data => setEmailSuggestions(data))
      .catch(() => setEmailSuggestions([]));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const url = isLogin ? 'http://localhost:5000/api/login' : 'http://localhost:5000/api/signup';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        onLogin(data.user_id, data.email);
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (err) {
      setError("Network error");
    }
  }

  function guestLogin() {
    // Generate a guest ID for tracking purposes
    const guestId = 'guest_' + Math.random().toString(36).substr(2, 9);
    onLogin(guestId, 'Guest');
  }

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Signup'}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          list="email-list"
          type="email"
          placeholder="Email"
          value={email}
          autoComplete="off"
          required
          onChange={e => setEmail(e.target.value)}
        />
        <datalist id="email-list">
          {emailSuggestions.map((email) => (
            <option key={email} value={email} />
          ))}
        </datalist>
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
      </form>
      <p className="auth-switch" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
        {isLogin ? "Don't have an account? Signup" : "Already have an account? Login"}
      </p>
      <button className="guest-btn" onClick={guestLogin}>Continue as Guest</button>

      {error && <p className="auth-error">{error}</p>}
    </div>
  );
}
