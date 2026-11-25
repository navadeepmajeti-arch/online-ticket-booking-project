import React, { useState, useEffect } from 'react';

export default function AuthModal({
  isOpen,
  initialMode = 'login',
  onClose,
  onLoginSuccess,
  getUsers,
  saveUsers,
  addToast
}) {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFillDemoAdmin = () => {
    setMode('login');
    setEmail('admin@tixhub.com');
    setPassword('admin123');
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      addToast('Please fill all fields.', 'error');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      addToast('Please enter a valid email address.', 'warning');
      return;
    }

    if (password.length < 6) {
      addToast('Password must contain at least 6 characters.', 'warning');
      return;
    }

    const users = getUsers();
    if (users.some((u) => u.email === cleanEmail)) {
      addToast('This email is already registered. Please log in.', 'error');
      return;
    }

    const newUser = {
      name: cleanName,
      email: cleanEmail,
      password: password,
      role: 'user'
    };

    saveUsers([...users, newUser]);
    addToast('Account created successfully! Welcome aboard.', 'success');
    onLoginSuccess(newUser);
    onClose();
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      addToast('Please enter both email and password.', 'error');
      return;
    }

    // Demo admin check
    if (cleanEmail === 'admin@tixhub.com' && password === 'admin123') {
      const adminUser = {
        name: 'Admin',
        email: cleanEmail,
        role: 'admin'
      };
      addToast('Welcome back, Admin!', 'success');
      onLoginSuccess(adminUser);
      onClose();
      return;
    }

    const users = getUsers();
    const foundUser = users.find(
      (u) => u.email === cleanEmail && u.password === password
    );

    if (!foundUser) {
      addToast('Invalid email or password.', 'error');
      return;
    }

    addToast(`Login successful! Welcome ${foundUser.name}`, 'success');
    onLoginSuccess(foundUser);
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      id="authModal"
      onClick={(e) => {
        if (e.target.classList.contains('modal-overlay')) onClose();
      }}
    >
      <div className="modal-card auth-box" role="dialog" aria-modal="true">
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close authentication modal"
        >
          ×
        </button>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
        </div>

        <div className="auth-heading">
          <h2>{mode === 'login' ? 'Welcome Back 👋' : 'Create Account 📝'}</h2>
          <p>
            {mode === 'login'
              ? 'Login to select seats and book your tickets.'
              : 'Register to manage bookings and get instant tickets.'}
          </p>
        </div>

        {mode === 'login' && (
          <div className="demo-account-hint">
            <strong>💡 Quick Demo Admin Login:</strong>
            Email: <code>admin@tixhub.com</code> | Password: <code>admin123</code>
            <br />
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              style={{
                marginTop: '6px',
                background: '#166534',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: '600'
              }}
            >
              Autofill Admin Credentials
            </button>
          </div>
        )}

        <form onSubmit={mode === 'login' ? handleLogin : handleSignup}>
          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="signupName">Full Name</label>
              <input
                id="signupName"
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="authEmail">Email Address</label>
            <input
              id="authEmail"
              type="email"
              placeholder="e.g. name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="authPassword">Password</label>
            <input
              id="authPassword"
              type="password"
              placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            {mode === 'login' ? 'Login to TixHub' : 'Create Free Account'}
          </button>
        </form>

        <p className="auth-switch-text">
          {mode === 'login' ? (
            <>
              New to TixHub?
              <button type="button" onClick={() => setMode('signup')}>
                Create an account
              </button>
            </>
          ) : (
            <>
              Already registered?
              <button type="button" onClick={() => setMode('login')}>
                Login here
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

