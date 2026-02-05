import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ContentRow from '../components/ContentRow';
import ContentModal from '../components/ContentModal';
import SettingsModal from '../components/SettingsModal';
import { mockContentData } from '../data/mockContent';
import { tmdbService, TMDB_IMAGE_BASE } from '../services/tmdbService';

const Home = () => {
  const { tmdbApiKey } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [contentData, setContentData] = useState(mockContentData);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const MOCK_WATCHLIST_KEY = 'netflix_watchlist';

  useEffect(() => {
    const savedWatchlist = localStorage.getItem(MOCK_WATCHLIST_KEY);
    if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
  }, []);

  useEffect(() => {
    localStorage.setItem(MOCK_WATCHLIST_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    if (tmdbApiKey) {
      loadTmdbContent();
    }
  }, [tmdbApiKey]);

  const loadTmdbContent = async () => {
    setIsLoadingContent(true);
    try {
      const [trending, action, comedy] = await Promise.all([
        tmdbService.getTrending(tmdbApiKey),
        tmdbService.getGenreMovies(tmdbApiKey, 28),
        tmdbService.getGenreMovies(tmdbApiKey, 35)
      ]);

      const formatContent = (items) => items.results.slice(0, 10).map(item => ({
        id: item.id,
        title: item.title || item.name,
        genre: item.media_type || 'movie',
        rating: `${Math.round(item.vote_average * 10)}%`,
        image: item.backdrop_path ? `${TMDB_IMAGE_BASE}${item.backdrop_path}` : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=225&fit=crop',
        description: item.overview || 'No description available.'
      }));

      setContentData({
        trending: formatContent(trending),
        action: formatContent(action),
        comedy: formatContent(comedy)
      });
    } catch (error) {
      console.error('Failed to load TMDB content:', error);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const addToWatchlist = (content) => {
    if (!watchlist.find(item => item.id === content.id)) {
      setWatchlist([...watchlist, content]);
    }
  };

  const removeFromWatchlist = (contentId) => {
    setWatchlist(watchlist.filter(item => item.id !== contentId));
  };

  const isInWatchlist = (contentId) => {
    return watchlist.some(item => item.id === contentId);
  };

  const allContent = [...contentData.trending, ...contentData.action, ...contentData.comedy];
  const filteredContent = searchQuery
    ? allContent.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.genre.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      
      <Hero content={contentData.trending[0]} onAddToList={addToWatchlist} />

      <div className="relative -mt-32 z-10">
        {!tmdbApiKey && (
          <div className="mx-4 md:mx-12 mb-6 bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-yellow-200 font-semibold">Using mock data</p>
              <p className="text-sm text-yellow-300">Add your TMDB API key to fetch real movies and TV shows</p>
            </div>
            <button
              onClick={() => setSettingsOpen(true)}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded transition"
            >
              Add API Key
            </button>
          </div>
        )}

        {isLoadingContent && (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading content from TMDB...</p>
          </div>
        )}

        {searchQuery ? (
          <div className="px-4 md:px-12 py-8">
            <h3 className="text-2xl font-semibold mb-6">Search Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredContent.map(item => (
                <div
                  key={item.id}
                  className="cursor-pointer group"
                  onClick={() => setSelectedContent(item)}
                >
                  <div className="relative rounded overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-48 object-cover group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity flex items-center justify-center">
                      <Play className="w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity" fill="white" />
                    </div>
                  </div>
                  <h4 className="mt-2 font-semibold">{item.title}</h4>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <ContentRow title="Trending Now" items={contentData.trending} onSelectContent={setSelectedContent} />
            <ContentRow title="My List" items={watchlist} onSelectContent={setSelectedContent} />
            <ContentRow title="Action & Adventure" items={contentData.action} onSelectContent={setSelectedContent} />
            <ContentRow title="Comedy" items={contentData.comedy} onSelectContent={setSelectedContent} />
          </>
        )}
      </div>

      <ContentModal
        content={selectedContent}
        onClose={() => setSelectedContent(null)}
        isInWatchlist={selectedContent ? isInWatchlist(selectedContent.id) : false}
        onAddToList={addToWatchlist}
        onRemoveFromList={removeFromWatchlist}
      />

      <SettingsModal 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
      />
    </div>
  );
};

export default Home;