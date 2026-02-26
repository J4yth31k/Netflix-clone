import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const { login, signup } = useAuth();
  const handleSubmit = () => { isSignup ? signup(email, password) : login(email, password); };
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-red-600 mb-2">NETFLIX</h1>
          <p className="text-gray-400">Unlimited movies, TV shows, and more</p>
        </div>
        <div className="bg-black bg-opacity-70 border border-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">{isSignup ? 'Sign Up' : 'Sign In'}</h2>
          <div className="space-y-4">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSubmit()} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white" />
            <button onClick={handleSubmit} className="w-full py-3 bg-red-600 hover:bg-red-700 rounded font-semibold transition">{isSignup ? 'Sign Up' : 'Sign In'}</button>
            <button onClick={() => setIsSignup(!isSignup)} className="w-full py-3 bg-gray-800 hover:bg-gray-700 rounded font-semibold transition">{isSignup ? 'Already have an account? Sign In' : 'New to Netflix? Sign Up'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
