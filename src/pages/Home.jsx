import React, { useState, useEffect, useCallback } from 'react';
import { Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ContentRow from '../components/ContentRow';
import ContentModal from '../components/ContentModal';
import SettingsModal from '../components/SettingsModal';
import { mockContentData } from '../data/mockContent';
import { tmdbService, TMDB_IMAGE_BASE } from '../services/tmdbService';

const fmt = (items, type) =>
  (items?.results || []).slice(0, 20).filter(i => i.backdrop_path).map(item => ({
    id: item.id,
    title: item.title || item.name,
    genre: type || item.media_type || 'movie',
    rating: `${Math.round((item.vote_average || 0) * 10)}%`,
    image: `${TMDB_IMAGE_BASE}${item.backdrop_path}`,
    poster: item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : null,
    description: item.overview || 'No description available.',
    year: (item.release_date || item.first_air_date || '').slice(0, 4),
  }));

const Home = () => {
  const { tmdbApiKey } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [contentData, setContentData] = useState({
    trending: mockContentData.trending,
    popularMovies: [],
    topRatedMovies: [],
    popularTV: [],
    topRatedTV: [],
    action: mockContentData.action,
    comedy: mockContentData.comedy,
    horror: [],
    scifi: [],
    nowPlaying: [],
  });

  useEffect(() => {
    const saved = localStorage.getItem('netflix_watchlist');
    if (saved) setWatchlist(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('netflix_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    if (tmdbApiKey) loadTmdbContent();
  }, [tmdbApiKey]);

  // Auto-rotate hero every 6 seconds
  useEffect(() => {
    if (!contentData.trending.length) return;
    const timer = setInterval(() => {
      setHeroIndex(i => (i + 1) % Math.min(contentData.trending.length, 5));
    }, 6000);
    return () => clearInterval(timer);
  }, [contentData.trending]);

  // Debounced TMDB search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      if (tmdbApiKey) {
        setIsSearching(true);
        try {
          const res = await tmdbService.searchContent(tmdbApiKey, searchQuery);
          setSearchResults(fmt(res, null).filter(i => i.image));
        } catch (e) { console.error(e); }
        finally { setIsSearching(false); }
      } else {
        const all = [...contentData.trending, ...contentData.action, ...contentData.comedy];
        setSearchResults(all.filter(i =>
          i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.genre.toLowerCase().includes(searchQuery.toLowerCase())
        ));
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, tmdbApiKey]);

  const loadTmdbContent = async () => {
    setIsLoadingContent(true);
    try {
      const [trending, popularMovies, topRatedMovies, popularTV, topRatedTV, action, comedy, horror, scifi, nowPlaying] = await Promise.all([
        tmdbService.getTrending(tmdbApiKey),
        tmdbService.getPopularMovies(tmdbApiKey),
        tmdbService.getTopRatedMovies(tmdbApiKey),
        tmdbService.getPopularTV(tmdbApiKey),
        tmdbService.getTopRatedTV(tmdbApiKey),
        tmdbService.getGenreMovies(tmdbApiKey, 28),
        tmdbService.getGenreMovies(tmdbApiKey, 35),
        tmdbService.getGenreMovies(tmdbApiKey, 27),
        tmdbService.getGenreTV(tmdbApiKey, 10765),
        tmdbService.getNowPlaying(tmdbApiKey),
      ]);
      setContentData({
        trending: fmt(trending, null),
        popularMovies: fmt(popularMovies, 'movie'),
        topRatedMovies: fmt(topRatedMovies, 'movie'),
        popularTV: fmt(popularTV, 'tv'),
        topRatedTV: fmt(topRatedTV, 'tv'),
        action: fmt(action, 'movie'),
        comedy: fmt(comedy, 'movie'),
        horror: fmt(horror, 'movie'),
        scifi: fmt(scifi, 'tv'),
        nowPlaying: fmt(nowPlaying, 'movie'),
      });
    } catch (e) {
      console.error('Failed to load TMDB content:', e);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const addToWatchlist = (content) => {
    if (!watchlist.find(i => i.id === content.id)) setWatchlist([...watchlist, content]);
  };
  const removeFromWatchlist = (id) => setWatchlist(watchlist.filter(i => i.id !== id));
  const isInWatchlist = (id) => watchlist.some(i => i.id === id);

  const heroContent = contentData.trending[heroIndex];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} onOpenSettings={() => setSettingsOpen(true)} />

      {!searchQuery && heroContent && (
        <Hero content={heroContent} onAddToList={addToWatchlist} />
      )}

      <div className={`relative z-10 ${!searchQuery ? '-mt-32' : 'pt-24'}`}>
        {!tmdbApiKey && (
          <div className="mx-4 md:mx-12 mb-6 bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-yellow-200 font-semibold">Using mock data</p>
              <p className="text-sm text-yellow-300">Add your TMDB API key in Settings to load real content</p>
            </div>
            <button onClick={() => setSettingsOpen(true)} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded transition">Add API Key</button>
          </div>
        )}

        {isLoadingContent && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-gray-400">Loading content...</p>
          </div>
        )}

        {searchQuery ? (
          <div className="px-4 md:px-12 py-8">
            <h3 className="text-2xl font-semibold mb-6">
              {isSearching ? 'Searching...' : `Results for "${searchQuery}"`}
            </h3>
            {!isSearching && searchResults.length === 0 ? (
              <p className="text-gray-400">No results found.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {searchResults.map(item => (
                  <div key={item.id} className="cursor-pointer group" onClick={() => setSelectedContent(item)}>
                    <div className="relative rounded overflow-hidden aspect-video">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity flex items-center justify-center">
                        <Play className="w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity" fill="white" />
                      </div>
                    </div>
                    <h4 className="mt-2 text-sm font-semibold truncate">{item.title}</h4>
                    <p className="text-xs text-gray-400">{item.year} • {item.genre}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <ContentRow title="Trending Now" items={contentData.trending} onSelectContent={setSelectedContent} />
            {watchlist.length > 0 && <ContentRow title="My List" items={watchlist} onSelectContent={setSelectedContent} />}
            <ContentRow title="Now Playing in Theaters" items={contentData.nowPlaying} onSelectContent={setSelectedContent} />
            <ContentRow title="Popular Movies" items={contentData.popularMovies} onSelectContent={setSelectedContent} />
            <ContentRow title="Top Rated Movies" items={contentData.topRatedMovies} onSelectContent={setSelectedContent} />
            <ContentRow title="Popular TV Shows" items={contentData.popularTV} onSelectContent={setSelectedContent} />
            <ContentRow title="Top Rated TV Shows" items={contentData.topRatedTV} onSelectContent={setSelectedContent} />
            <ContentRow title="Action & Adventure" items={contentData.action} onSelectContent={setSelectedContent} />
            <ContentRow title="Comedy" items={contentData.comedy} onSelectContent={setSelectedContent} />
            <ContentRow title="Horror" items={contentData.horror} onSelectContent={setSelectedContent} />
            <ContentRow title="Sci-Fi & Fantasy" items={contentData.scifi} onSelectContent={setSelectedContent} />
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
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

export default Home;
