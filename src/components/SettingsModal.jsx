import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { tmdbService } from '../services/tmdbService';
const SettingsModal = ({ isOpen, onClose }) => {
  const { tmdbApiKey, saveTmdbKey } = useAuth();
  const [apiKey, setApiKey] = useState(tmdbApiKey || '');
  const [testStatus, setTestStatus] = useState('');
  if (!isOpen) return null;
  const handleSave = () => { saveTmdbKey(apiKey); setTestStatus(''); onClose(); };
  const testApiKey = async () => {
    if (!apiKey) { setTestStatus('Please enter an API key'); return; }
    try { const res = await tmdbService.getTrending(apiKey); setTestStatus(res.results?.length > 0 ? '✓ API key is valid!' : '✗ Invalid API key'); }
    catch { setTestStatus('✗ Failed to connect to TMDB'); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg max-w-2xl w-full p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">TMDB API Configuration</h3>
            <p className="text-sm text-gray-400 mb-4">Get your free API key at <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">themoviedb.org/settings/api</a></p>
            <div className="space-y-3">
              <input type="text" placeholder="Enter your TMDB API key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white text-white" />
              {testStatus && <div className="p-3 rounded bg-gray-800 border border-gray-700 text-sm">{testStatus}</div>}
              <button onClick={testApiKey} className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition font-semibold">Test API Key</button>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <button onClick={handleSave} className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 rounded transition font-semibold">Save Settings</button>
            <button onClick={onClose} className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded transition font-semibold">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsModal;
