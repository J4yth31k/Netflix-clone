const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export const tmdbService = {
  getTrending: async (apiKey) => {
    const res = await fetch(`${TMDB_BASE_URL}/trending/all/week?api_key=${apiKey}`);
    return res.json();
  },
  getGenreMovies: async (apiKey, genreId) => {
    const res = await fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${apiKey}&with_genres=${genreId}`);
    return res.json();
  },
  searchContent: async (apiKey, query) => {
    const res = await fetch(`${TMDB_BASE_URL}/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
    return res.json();
  }
};
