// Banner Component - Featured content at the top of the page
import React, { useState, useEffect } from 'react';
import { getBackdropUrl } from './tmdb';
import './Banner.css';

const Banner = ({ fetchData, onPlayClick, onMoreInfoClick }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBannerContent = async () => {
      try {
        setLoading(true);
        const data = await fetchData();

        // Select a random item from the results
        const randomIndex = Math.floor(Math.random() * data.length);
        setContent(data[randomIndex]);
      } catch (error) {
        console.error('Error loading banner content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBannerContent();
  }, [fetchData]);

  const truncate = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength - 1) + '...' : text;
  };

  if (loading || !content) {
    return (
      <header className="banner banner-loading">
        <div className="banner-loading-text">Loading...</div>
      </header>
    );
  }

  const title = content.title || content.name || content.original_name;
  const backgroundUrl = getBackdropUrl(content.backdrop_path);

  return (
    <header
      className="banner"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
      }}
    >
      <div className="banner-contents">
        <h1 className="banner-title">{title}</h1>

        <div className="banner-buttons">
          <button
            className="banner-button banner-play"
            onClick={() => onPlayClick && onPlayClick(content)}
          >
            <span className="play-icon">▶</span>
            Play
          </button>
          <button
            className="banner-button banner-info"
            onClick={() => onMoreInfoClick && onMoreInfoClick(content)}
          >
            <span className="info-icon">ⓘ</span>
            More Info
          </button>
        </div>

        <div className="banner-description">
          {truncate(content.overview, 200)}
        </div>

        {content.vote_average && (
          <div className="banner-meta">
            <span className="banner-rating">
              ⭐ {content.vote_average.toFixed(1)}
            </span>
            {(content.release_date || content.first_air_date) && (
              <span className="banner-year">
                {(content.release_date || content.first_air_date).substring(0, 4)}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="banner-fade-bottom" />
    </header>
  );
};

export default Banner;
