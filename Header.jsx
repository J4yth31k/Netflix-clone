import React from 'react';
import { Search, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ searchQuery, setSearchQuery, onOpenSettings }) => {
  const { logout } = useAuth();
  return (
    <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-black to-transparent">
      <div className="flex items-center justify-between px-4 md:px-12 py-4">
        <div className="flex items-center gap-8">
          <h1 className="text-3xl font-bold text-red-600">NETFLIX</h1>
          <nav className="hidden md:flex gap-6 text-sm">
            <button className="hover:text-gray-300">Home</button>
            <button className="hover:text-gray-300">TV Shows</button>
            <button className="hover:text-gray-300">Movies</button>
            <button className="hover:text-gray-300">My List</button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded text-sm focus:outline-none focus:border-white" />
          </div>
          <button onClick={onOpenSettings} className="p-2 hover:bg-gray-800 rounded transition" title="Settings">
            <Settings className="w-5 h-5" />
          </button>
          <button onClick={logout} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition">Logout</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
