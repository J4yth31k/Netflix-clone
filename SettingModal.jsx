// SettingModal Component - User settings and preferences
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { logOut, resetPassword } from './authService';
import './SettingModal.css';

const SettingModal = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Preferences state
  const [preferences, setPreferences] = useState({
    autoplay: localStorage.getItem('autoplay') === 'true',
    autoplayPreviews: localStorage.getItem('autoplayPreviews') === 'true',
    dataUsage: localStorage.getItem('dataUsage') || 'auto',
    language: localStorage.getItem('language') || 'en',
    maturityRating: localStorage.getItem('maturityRating') || 'all',
  });

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('settings-backdrop')) {
      onClose();
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    const result = await logOut();
    if (result.success) {
      onClose();
    } else {
      setMessage('Failed to log out. Please try again.');
    }
    setLoading(false);
  };

  const handlePasswordReset = async () => {
    if (!currentUser?.email) {
      setMessage('No email associated with this account');
      return;
    }

    setLoading(true);
    const result = await resetPassword(currentUser.email);
    setMessage(result.message);
    setLoading(false);
  };

  const handlePreferenceChange = (key, value) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    localStorage.setItem(key, value);
    setMessage('Preference saved!');
    setTimeout(() => setMessage(''), 2000);
  };

  const clearWatchHistory = () => {
    if (window.confirm('Are you sure you want to clear your watch history?')) {
      localStorage.removeItem('watchHistory');
      setMessage('Watch history cleared!');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  return (
    <div className="settings-backdrop" onClick={handleBackdropClick}>
      <div className="settings-modal">
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="settings-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {message && <div className="settings-message">{message}</div>}

        <div className="settings-content">
          <div className="settings-tabs">
            <button
              className={`tab ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              Account
            </button>
            <button
              className={`tab ${activeTab === 'playback' ? 'active' : ''}`}
              onClick={() => setActiveTab('playback')}
            >
              Playback
            </button>
            <button
              className={`tab ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              Preferences
            </button>
          </div>

          <div className="settings-panel">
            {activeTab === 'account' && (
              <div className="settings-section">
                <h3>Account Information</h3>

                <div className="setting-item">
                  <label>Email</label>
                  <p>{currentUser?.email || 'Not available'}</p>
                </div>

                <div className="setting-item">
                  <label>Display Name</label>
                  <p>{currentUser?.displayName || 'Not set'}</p>
                </div>

                <div className="setting-item">
                  <label>Member Since</label>
                  <p>
                    {currentUser?.metadata?.creationTime
                      ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
                      : 'Unknown'}
                  </p>
                </div>

                <div className="settings-actions">
                  <button
                    className="btn-secondary"
                    onClick={handlePasswordReset}
                    disabled={loading}
                  >
                    Reset Password
                  </button>
                  <button
                    className="btn-danger"
                    onClick={handleLogout}
                    disabled={loading}
                  >
                    {loading ? 'Logging out...' : 'Sign Out'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'playback' && (
              <div className="settings-section">
                <h3>Playback Settings</h3>

                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={preferences.autoplay}
                      onChange={(e) =>
                        handlePreferenceChange('autoplay', e.target.checked)
                      }
                    />
                    Autoplay next episode
                  </label>
                  <p className="setting-description">
                    Automatically play the next episode when one finishes
                  </p>
                </div>

                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={preferences.autoplayPreviews}
                      onChange={(e) =>
                        handlePreferenceChange('autoplayPreviews', e.target.checked)
                      }
                    />
                    Autoplay previews
                  </label>
                  <p className="setting-description">
                    Automatically play previews while browsing
                  </p>
                </div>

                <div className="setting-item">
                  <label>Data Usage</label>
                  <select
                    value={preferences.dataUsage}
                    onChange={(e) =>
                      handlePreferenceChange('dataUsage', e.target.value)
                    }
                  >
                    <option value="low">Low (0.3 GB per hour)</option>
                    <option value="medium">Medium (0.7 GB per hour)</option>
                    <option value="high">High (3 GB per hour)</option>
                    <option value="auto">Auto</option>
                  </select>
                  <p className="setting-description">
                    Controls how much data is used when streaming
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="settings-section">
                <h3>Preferences</h3>

                <div className="setting-item">
                  <label>Language</label>
                  <select
                    value={preferences.language}
                    onChange={(e) =>
                      handlePreferenceChange('language', e.target.value)
                    }
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="ja">日本語</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Maturity Rating</label>
                  <select
                    value={preferences.maturityRating}
                    onChange={(e) =>
                      handlePreferenceChange('maturityRating', e.target.value)
                    }
                  >
                    <option value="all">All Maturity Ratings</option>
                    <option value="kids">Kids Only</option>
                    <option value="teen">Teen and Below</option>
                    <option value="adult">All Including Mature</option>
                  </select>
                  <p className="setting-description">
                    Filter content based on maturity ratings
                  </p>
                </div>

                <div className="settings-actions">
                  <button className="btn-secondary" onClick={clearWatchHistory}>
                    Clear Watch History
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingModal;
