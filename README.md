# 🎬 Netflix Clone

A full-featured Netflix clone built with React, Firebase Authentication, and The Movie Database (TMDB) API. Features include user authentication, content browsing, video player, and personalized settings.

## ✨ Features

- 🔐 **User Authentication**
  - Email/Password sign-up and sign-in
  - Google OAuth authentication
  - Password reset functionality
  - Session management

- 🎥 **Content Browsing**
  - Horizontal scrolling content rows
  - Multiple categories (Trending, Top Rated, Action, Comedy, etc.)
  - Netflix Originals section
  - Detailed movie/show information modals
  - Similar content recommendations

- ▶️ **Video Player**
  - Custom video player with controls
  - YouTube trailer integration
  - Play/pause, seek, volume controls
  - Fullscreen support

- ⚙️ **User Settings**
  - Account management
  - Playback preferences
  - Language and data usage settings
  - Watch history management

## 📁 Project Structure

```
netflix-clone/
├── firebase.js                 # Firebase configuration
├── authService.js              # Authentication functions
├── tmdb.js                     # TMDB API service
│
├── AuthContext.jsx             # Auth state management
├── Login.jsx                   # Original login component
├── NetflixLogin.jsx            # Netflix-styled login
├── Signup.jsx                  # Registration component
│
├── ContentRow.jsx              # Movie/show row component
├── ContentModal.jsx            # Content details modal
├── SettingModal.jsx            # Settings modal
├── Player.jsx                  # Video player component
│
├── *.css                       # Component styles
├── .env.example                # Environment template
└── .vscode/                    # VS Code configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- TMDB API account

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd netflix-clone
   ```

2. **Install dependencies**
   ```bash
   npm install firebase
   ```

3. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Add a web app to your project
   - Enable Authentication (Email/Password and Google)
   - Copy your Firebase configuration

4. **Set up TMDB API**
   - Go to [TMDB](https://www.themoviedb.org/)
   - Create an account
   - Go to Settings → API
   - Request an API key (free)

5. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your credentials:
   ```env
   REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id

   REACT_APP_TMDB_API_KEY=your-tmdb-api-key
   ```

6. **Start the development server**
   ```bash
   npm start
   ```

## 🎨 Components Overview

### Authentication Components

**NetflixLogin.jsx** - Netflix-styled login page with:
- Floating label inputs
- Remember me checkbox
- Google sign-in option
- Netflix branding

**Signup.jsx** - User registration with:
- Display name field
- Email and password
- Password confirmation
- Google sign-up option

**AuthContext.jsx** - Global auth state management

### Content Components

**ContentRow.jsx** - Horizontal scrolling content rows
- Fetches data from TMDB
- Hover effects with movie info
- Left/right scroll buttons
- Supports large poster format

**ContentModal.jsx** - Detailed content view
- Full backdrop image
- Movie/show details (cast, genres, ratings)
- Similar content suggestions
- Play button integration

**SettingModal.jsx** - User preferences
- Account information
- Playback settings (autoplay, data usage)
- Language preferences
- Watch history management

**Player.jsx** - Video player
- YouTube trailer integration
- Custom controls
- Seek, volume, fullscreen
- Time display

## 🔧 API Integration

### TMDB Service (tmdb.js)

The TMDB service provides functions to fetch:
- Trending content
- Netflix Originals
- Movies by genre (Action, Comedy, Horror, etc.)
- TV shows
- Content details
- Videos/trailers
- Search results

Example usage:
```javascript
import { requests, getDetails, getPosterUrl } from './tmdb';

// Fetch trending content
const trending = await requests.fetchTrending();

// Get movie details
const details = await getDetails('movie', movieId);

// Get poster URL
const posterUrl = getPosterUrl(movie.poster_path);
```

### Firebase Authentication (authService.js)

Available auth functions:
```javascript
import { signUp, signIn, signInWithGoogle, logOut } from './authService';

// Sign up
const result = await signUp(email, password, displayName);

// Sign in
const result = await signIn(email, password);

// Google sign-in
const result = await signInWithGoogle();

// Sign out
await logOut();
```

## 📱 Example App Integration

Here's how to use these components in your App.js:

```javascript
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import NetflixLogin from './NetflixLogin';
import Signup from './Signup';
import ContentRow from './ContentRow';
import ContentModal from './ContentModal';
import SettingModal from './SettingModal';
import Player from './Player';
import { requests } from './tmdb';

function HomePage() {
  const { currentUser } = useAuth();
  const [selectedContent, setSelectedContent] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [playerContent, setPlayerContent] = useState(null);

  if (playerContent) {
    return <Player content={playerContent} onClose={() => setPlayerContent(null)} />;
  }

  return (
    <div className="app">
      {/* Content rows */}
      <ContentRow
        title="Trending Now"
        fetchData={requests.fetchTrending}
        onContentClick={setSelectedContent}
      />
      <ContentRow
        title="Top Rated"
        fetchData={requests.fetchTopRated}
        onContentClick={setSelectedContent}
      />
      <ContentRow
        title="Netflix Originals"
        fetchData={requests.fetchNetflixOriginals}
        isLargeRow
        onContentClick={setSelectedContent}
      />

      {/* Modals */}
      {selectedContent && (
        <ContentModal
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
          onPlayClick={setPlayerContent}
        />
      )}

      {showSettings && (
        <SettingModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}

function App() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <AuthProvider>
      <AuthWrapper
        showSignup={showSignup}
        setShowSignup={setShowSignup}
      />
    </AuthProvider>
  );
}

function AuthWrapper({ showSignup, setShowSignup }) {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return showSignup ? (
      <Signup onSwitchToLogin={() => setShowSignup(false)} />
    ) : (
      <NetflixLogin onSwitchToSignup={() => setShowSignup(true)} />
    );
  }

  return <HomePage />;
}

export default App;
```

## 🎯 VS Code Setup

The project includes VS Code configuration:

**Recommended Extensions:**
- ESLint
- Prettier
- React snippets
- Firebase Explorer
- Path Intellisense

**Features:**
- Auto-format on save
- ESLint auto-fix
- Debug configurations
- Path intellisense

Press `F5` to start debugging in Chrome!

## 🔐 Security Notes

- Never commit your `.env` file
- Firebase credentials are in `.env` only
- TMDB API key is rate-limited (free tier: 40 requests/10 seconds)
- Set up Firebase Security Rules for production
- Use HTTPS in production

## 🎨 Customization

### Styling
All components have separate CSS files. Key files:
- `NetflixLogin.css` - Login page styling
- `ContentRow.css` - Content row styling
- `ContentModal.css` - Modal styling
- `Player.css` - Player controls

### Colors
Netflix brand colors used:
- Primary Red: `#e50914`
- Background: `#141414`, `#181818`
- Text: `#ffffff`, `#999999`

### Content Categories
Add more content rows in `tmdb.js`:
```javascript
customCategory: `/discover/movie?api_key=${API_KEY}&with_genres=YOUR_GENRE_ID`,
```

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [TMDB API Documentation](https://developers.themoviedb.org/3)
- [React Documentation](https://react.dev)
- [Firebase Auth Guide](FIREBASE_SETUP_GUIDE.md)

## 🐛 Troubleshooting

**Issue: "API key not valid"**
- Check `.env` file exists and has correct keys
- Restart dev server after creating `.env`

**Issue: "No content loading"**
- Verify TMDB API key is correct
- Check browser console for API errors
- Ensure API key has proper permissions

**Issue: "Google sign-in popup blocked"**
- Allow popups for localhost in browser
- Check Firebase console for proper OAuth setup

**Issue: Images not loading**
- TMDB image URLs require valid API key
- Check network tab for failed image requests

## 📄 License

This is a learning project. TMDB and Netflix are trademarks of their respective owners.

---

Made with ❤️ using React, Firebase, and TMDB
