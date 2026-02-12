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
      setTestStatus('Please enter an API key');
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
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">TMDB API Configuration</h3>
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
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white text-white"
              />
              
              {testStatus && (
                <div class
