import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { tmdbService } from '../services/tmdbService';

const SettingsModal = ({ isOpen, onClose }) => {
  const { tmdbApiKey, saveTmdbKey } = useAuth();
  const [apiKey, setApiKey] = useState(tmdbApiKey);
  const [testStatus, setTestStatus] = useState('');

  const handleSave = () => {
    saveTmdbKey(apiKey);
    setTestStatus('');
    onClose();
  };

  const testApiKey = async () => {
    if (!apiKey) {
      setTestStatus('56abe8c88c0cdb674e099cc2f4b7b7cc');
      return;
    }
    
    try {
      const response = await tmdbService.getTrending(apiKey);
      if (response.results && response.results.length > 0) {
        setTestStatus('✓ API key is valid!');
      } else {
        setTestStatus('✗ Invalid API key');
      }
    } catch (error) {
      setTestStatus('✗ Failed to connect to TMDB');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg max-w-2xl w-full p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">TMDB API Configuration</h3>
            <p className="text-sm text-gray-400 mb-4">
              Enter your TMDB API key to fetch real movie and TV show data. Get your free API key at{' '}
              <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                themoviedb.org/settings/api
              </a>
            </p>
            
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter your TMDB API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white"
              />
              
              {testStatus && (
                <div className={`text-sm ${testStatus.includes('✓') ? 'text-green-400' : 'text-red-400'}`}>
                  {testStatus}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={testApiKey}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
                >
                  Test API Key
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <h4 className="font-semibold mb-2">How to get your TMDB API key:</h4>
            <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
              <li>Create a free account at themoviedb.org</li>
              <li>Go to Settings → API</li>
              <li>Request an API key (choose "Developer" option)</li>
              <li>Copy the API Key (v3 auth) and paste it above</li>
            </ol>
          </div>

          <div className="bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded p-4">
            <p className="text-sm text-yellow-200">
              <strong>Note:</strong> Without a TMDB API key, the app will use mock data. Add your API key to fetch real movies and TV shows!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;