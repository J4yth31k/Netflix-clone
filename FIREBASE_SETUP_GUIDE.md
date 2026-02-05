# Firebase Authentication Setup Guide for VS Code

This guide will help you set up Firebase Authentication in your React project using VS Code.

## 📋 Prerequisites

- Node.js and npm installed
- VS Code installed
- A Google account for Firebase

## 🚀 Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "my-app")
4. Click "Continue" and follow the setup wizard
5. Once created, you'll be taken to your project dashboard

## 🔧 Step 2: Register Your Web App

1. In the Firebase Console, click the **web icon** (`</>`) to add a web app
2. Give your app a nickname (e.g., "My React App")
3. Check "Also set up Firebase Hosting" if you want (optional)
4. Click "Register app"
5. **Copy the Firebase configuration object** - you'll need these values!

## 🔑 Step 3: Set Up Environment Variables

1. In your project folder, copy `.env.example` to create a new `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and replace the placeholder values with your Firebase credentials:
   ```env
   REACT_APP_FIREBASE_API_KEY=AIzaSyC...
   REACT_APP_FIREBASE_AUTH_DOMAIN=my-app.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=my-app
   REACT_APP_FIREBASE_STORAGE_BUCKET=my-app.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
   REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

3. **IMPORTANT**: Add `.env` to your `.gitignore` file to keep credentials secure:
   ```
   .env
   .env.local
   ```

## 🔐 Step 4: Enable Authentication Methods

1. In Firebase Console, go to **Build → Authentication**
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the authentication methods you want:
   - **Email/Password**: Click on it → Toggle "Enable" → Save
   - **Google**: Click on it → Toggle "Enable" → Select support email → Save

## 📦 Step 5: Install Firebase in Your Project

Open the integrated terminal in VS Code (`Ctrl+`` or `View → Terminal`) and run:

```bash
npm install firebase
```

## 🛠️ Step 6: Install Recommended VS Code Extensions

When you open the project in VS Code, you'll be prompted to install recommended extensions. Click "Install All" or install them individually:

- **ESLint**: Code quality and error checking
- **Prettier**: Code formatting
- **ES7+ React/Redux Snippets**: React code snippets
- **Firebase Explorer**: Manage Firebase directly from VS Code

Or install via command palette (`Ctrl+Shift+P`):
```
ext install dbaeumer.vscode-eslint
ext install esbenp.prettier-vscode
ext install dsznajder.es7-react-js-snippets
ext install firebaseextended.firebase-explorer
```

## 📁 Step 7: Project Structure

Your Firebase files are organized as follows:

```
your-project/
├── .vscode/                    # VS Code configuration
│   ├── extensions.json         # Recommended extensions
│   ├── settings.json           # Workspace settings
│   └── launch.json             # Debug configurations
├── firebase-config.js          # Firebase initialization
├── authService.js              # Authentication functions
├── AuthContext.jsx             # React Auth Context
├── Login.jsx                   # Login component
├── Signup.jsx                  # Signup component
├── auth-styles.css             # Styles for auth components
├── .env.example                # Environment template
└── .env                        # Your actual credentials (create this!)
```

## 💻 Step 8: Using the Authentication Components

### Option A: Basic Usage in App.js

```jsx
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import Signup from './Signup';
import './auth-styles.css';

function AuthWrapper() {
  const [showSignup, setShowSignup] = useState(false);
  const { currentUser, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <div>
        <h1>Welcome, {currentUser.displayName || currentUser.email}!</h1>
        <p>You are logged in!</p>
      </div>
    );
  }

  return showSignup ? (
    <Signup onSwitchToLogin={() => setShowSignup(false)} />
  ) : (
    <Login onSwitchToSignup={() => setShowSignup(true)} />
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}

export default App;
```

### Option B: Using Auth Functions Directly

```jsx
import { signIn, signUp, logOut } from './authService';

// Sign in
const handleLogin = async () => {
  const result = await signIn('user@example.com', 'password123');
  if (result.success) {
    console.log('Logged in!', result.user);
  } else {
    console.error(result.message);
  }
};

// Sign up
const handleSignup = async () => {
  const result = await signUp('user@example.com', 'password123', 'John Doe');
  if (result.success) {
    console.log('Account created!', result.user);
  }
};

// Log out
const handleLogout = async () => {
  await logOut();
};
```

## 🐛 Step 9: Debugging in VS Code

1. Press `F5` or go to `Run → Start Debugging`
2. Select "Launch Chrome for React App"
3. This will start your React app and attach the debugger
4. Set breakpoints by clicking to the left of line numbers
5. Use the Debug Console to inspect variables

## 🔍 Testing Your Setup

1. Start your development server:
   ```bash
   npm start
   ```

2. Try these test scenarios:
   - ✅ Create a new account with email/password
   - ✅ Sign in with the created account
   - ✅ Sign in with Google
   - ✅ Sign out
   - ✅ Try invalid credentials (should show error)

## 🎨 Customizing Styles

The `auth-styles.css` file contains all the styles for the authentication components. You can:

- Change colors (search for color hex codes like `#667eea`)
- Modify the gradient background
- Adjust spacing and sizing
- Add your own branding

## 📚 Available Auth Functions

In `authService.js`, you have access to:

- `signUp(email, password, displayName)` - Create new account
- `signIn(email, password)` - Sign in with email
- `signInWithGoogle()` - Sign in with Google popup
- `logOut()` - Sign out current user
- `resetPassword(email)` - Send password reset email
- `getCurrentUser()` - Get current user object
- `onAuthChange(callback)` - Listen to auth state changes

## 🔐 Security Best Practices

1. ✅ **Never commit `.env` file** - Keep credentials secure
2. ✅ **Set up Firebase Security Rules** in Console
3. ✅ **Use HTTPS in production**
4. ✅ **Validate user input** on both client and server
5. ✅ **Add Firebase Security Rules**:

   ```javascript
   // Firestore rules example
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

## 🚨 Common Issues & Solutions

### Issue: "Firebase: Error (auth/api-key-not-valid)"
**Solution**: Check that your `.env` file has the correct API key and that you've restarted the dev server after creating `.env`

### Issue: Google sign-in popup blocked
**Solution**: Allow popups in your browser for localhost

### Issue: "Module not found: Can't resolve 'firebase'"
**Solution**: Run `npm install firebase` and restart the dev server

### Issue: Changes to .env not taking effect
**Solution**: Restart your development server (stop with Ctrl+C and run `npm start` again)

## 📖 Next Steps

- Add protected routes using React Router
- Store user data in Firestore
- Add password reset functionality
- Implement email verification
- Add profile picture upload to Firebase Storage
- Set up Firebase Security Rules

## 🆘 Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth Reference](https://firebase.google.com/docs/auth/web/start)
- [React Firebase Hooks](https://github.com/CSFrequency/react-firebase-hooks)

---

Happy coding! 🚀
