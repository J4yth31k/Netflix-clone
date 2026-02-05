// Navbar Component - Top navigation bar
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { search } from './tmdb';
import './Navbar.css';

const Navbar = ({ onSearchResults, onSettingsClick, onLogoClick }) => {
  const { currentUser } = useAuth();
  const [show, setShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        const results = await search(searchQuery);
        if (onSearchResults) {
          onSearchResults(results);
        }
      } catch (error) {
        console.error('Search error:', error);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (onSearchResults) {
      onSearchResults(null);
    }
  };

  return (
    <nav className={`navbar ${show ? 'navbar-black' : ''}`}>
      <div className="navbar-contents">
        <div className="navbar-left">
          <h1
            className="navbar-logo"
            onClick={onLogoClick}
            role="button"
            tabIndex={0}
          >
            NETFLIX
          </h1>

          <div className="navbar-links">
            <a href="#home">Home</a>
            <a href="#series">TV Shows</a>
            <a href="#movies">Movies</a>
            <a href="#new">New & Popular</a>
            <a href="#mylist">My List</a>
          </div>
        </div>

        <div className="navbar-right">
          {/* Search */}
          <div className={`navbar-search ${showSearch ? 'active' : ''}`}>
            <button
              className="search-icon"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Toggle search"
            >
              🔍
            </button>
            {showSearch && (
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Titles, people, genres"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear"
                    onClick={clearSearch}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </form>
            )}
          </div>

          {/* Notifications */}
          <button className="navbar-icon" aria-label="Notifications">
            🔔
          </button>

          {/* Profile Menu */}
          <div className="navbar-profile">
            <button
              className="profile-button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              aria-label="Profile menu"
            >
              <img
                src={
                  currentUser?.photoURL ||
                  'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'
                }
                alt="Profile"
                className="profile-avatar"
              />
              <span className="profile-caret">▼</span>
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-item profile-user">
                  <img
                    src={
                      currentUser?.photoURL ||
                      'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'
                    }
                    alt="Profile"
                  />
                  <span>{currentUser?.displayName || currentUser?.email || 'User'}</span>
                </div>
                <div className="dropdown-divider" />
                <a href="#account" className="profile-dropdown-item">
                  Account
                </a>
                <a href="#help" className="profile-dropdown-item">
                  Help Center
                </a>
                <div className="dropdown-divider" />
                <button
                  className="profile-dropdown-item"
                  onClick={onSettingsClick}
                >
                  Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
