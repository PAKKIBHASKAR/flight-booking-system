import React, { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle, Plane, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ initialMode = 'login', onClose }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        await signup(name, email, password);
        setSuccessMsg('Account created successfully!');
      } else {
        await login(email, password);
        setSuccessMsg('Logged in successfully!');
      }
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem', position: 'relative' }}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}>
            <Plane size={26} color="#fff" style={{ transform: 'rotate(-45deg)' }} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff', marginBottom: '0.3rem' }}>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {mode === 'login' ? 'Log in to access your flight tickets & bookings' : 'Join SkyWay to book flights with best fares'}
          </p>
        </div>

        {/* Error / Success Toast */}
        {errorMsg && (
          <div className="toast-alert toast-error">
            <AlertCircle size={18} /> {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="toast-alert toast-success">
            <CheckCircle size={18} /> {successMsg}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Alex Morgan" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input" 
                  style={{ width: '100%', paddingLeft: '2.5rem' }} 
                />
                <User size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                required
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input" 
                style={{ width: '100%', paddingLeft: '2.5rem' }} 
              />
              <Mail size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                required
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input" 
                style={{ width: '100%', paddingLeft: '2.5rem' }} 
              />
              <Lock size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary" 
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Free Account'}
          </button>

        </form>

        {/* Demo Login Quick fill */}
        {mode === 'login' && (
          <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => {
                setEmail('demo@skyway.com');
                setPassword('password123');
              }}
              style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', fontSize: '0.8rem', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Fill Demo Credentials (demo@skyway.com)
            </button>
          </div>
        )}

        {/* Toggle Mode */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => { setMode('signup'); setErrorMsg(null); }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer' }}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button 
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(null); }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer' }}
              >
                Log In
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
