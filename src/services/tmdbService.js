const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export const tmdbService = {
  getTrending: async (apiKey) => {
    const res = await fetch(`${TMDB_BASE_URL}/trending/all/week?api_key=${apiKey}`);
    return res.json();
  },
  getPopularMovies: async (apiKey) => {
    const res = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${apiKey}`);
    return res.json();
  },
  getTopRatedMovies: async (apiKey) => {
    const res = await fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${apiKey}`);
    return res.json();
  },
  getPopularTV: async (apiKey) => {
    const res = await fetch(`${TMDB_BASE_URL}/tv/popular?api_key=${apiKey}`);
    return res.json();
  },
  getTopRatedTV: async (apiKey) => {
    const res = await fetch(`${TMDB_BASE_URL}/tv/top_rated?api_key=${apiKey}`);
    return res.json();
  },
  getGenreMovies: async (apiKey, genreId) => {
    const res = await fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${apiKey}&with_genres=${genreId}&sort_by=popularity.desc`);
    return res.json();
  },
  getGenreTV: async (apiKey, genreId) => {
    const res = await fetch(`${TMDB_BASE_URL}/discover/tv?api_key=${apiKey}&with_genres=${genreId}&sort_by=popularity.desc`);
    return res.json();
  },
  getNowPlaying: async (apiKey) => {
    const res = await fetch(`${TMDB_BASE_URL}/movie/now_playing?api_key=${apiKey}`);
    return res.json();
  },
  searchContent: async (apiKey, query) => {
    const res = await fetch(`${TMDB_BASE_URL}/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
    return res.json();
  }
};
