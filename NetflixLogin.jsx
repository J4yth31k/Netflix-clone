// Netflix-styled Login Component
import React, { useState } from 'react';
import { signIn, signInWithGoogle } from './authService';
import './NetflixLogin.css';

const NetflixLogin = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn(email, password);

    if (result.success) {
      console.log('Signed in:', result.user);
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    const result = await signInWithGoogle();

    if (result.success) {
      console.log('Signed in with Google:', result.user);
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="netflix-login-page">
      <div className="netflix-header">
        <h1 className="netflix-logo">NETFLIX</h1>
      </div>

      <div className="netflix-login-wrapper">
        <div className="netflix-login-card">
          <h2>Sign In</h2>

          {error && <div className="netflix-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="netflix-input-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder=" "
              />
              <label htmlFor="email">Email or phone number</label>
            </div>

            <div className="netflix-input-group">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder=" "
                minLength={6}
              />
              <label htmlFor="password">Password</label>
            </div>

            <button type="submit" className="netflix-btn-signin" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="netflix-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#help" className="need-help">
                Need help?
              </a>
            </div>
          </form>

          <div className="netflix-signup-section">
            <p>
              New to Netflix?{' '}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="netflix-signup-link"
              >
                Sign up now
              </button>
              .
            </p>
          </div>

          <div className="netflix-recaptcha-text">
            This page is protected by Google reCAPTCHA to ensure you're not a bot.
          </div>

          <div className="netflix-divider">
            <span>OR</span>
          </div>

          <button
            type="button"
            className="netflix-btn-google"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              width="20"
              height="20"
            />
            Sign in with Google
          </button>
        </div>
      </div>

      <div className="netflix-footer">
        <p>Questions? Contact us.</p>
      </div>
    </div>
  );
};

export default NetflixLogin;
