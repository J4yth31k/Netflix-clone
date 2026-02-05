// ContentRow Component - Horizontal scrolling row of movies/shows
import React, { useState, useEffect, useRef } from 'react';
import { getPosterUrl, getBackdropUrl } from './tmdb';
import './ContentRow.css';

const ContentRow = ({ title, fetchData, isLargeRow = false, onContentClick }) => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const rowRef = useRef(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const data = await fetchData();
        setContent(data);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [fetchData]);

  const scroll = (direction) => {
    const container = rowRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -container.offsetWidth : container.offsetWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleContentClick = (item) => {
    if (onContentClick) {
      onContentClick(item);
    }
  };

  if (loading) {
    return (
      <div className="content-row">
        <h2 className="row-title">{title}</h2>
        <div className="row-loading">Loading...</div>
      </div>
    );
  }

  if (!content || content.length === 0) {
    return null;
  }

  return (
    <div className="content-row">
      <h2 className="row-title">{title}</h2>
      <div className="row-container">
        <button
          className="scroll-button scroll-button-left"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          ‹
        </button>

        <div className="row-posters" ref={rowRef}>
          {content.map((item) => {
            const imageUrl = isLargeRow
              ? getPosterUrl(item.poster_path, 'w500')
              : getBackdropUrl(item.backdrop_path, 'w300');

            if (!imageUrl) return null;

            return (
              <div
                key={item.id}
                className={`row-poster ${isLargeRow ? 'row-poster-large' : ''}`}
                onClick={() => handleContentClick(item)}
              >
                <img
                  src={imageUrl}
                  alt={item.title || item.name || 'Content'}
                  loading="lazy"
                />
                <div className="poster-info">
                  <h3>{item.title || item.name}</h3>
                  <div className="poster-details">
                    <span className="rating">
                      ⭐ {item.vote_average?.toFixed(1) || 'N/A'}
                    </span>
                    <span className="year">
                      {item.release_date?.substring(0, 4) ||
                        item.first_air_date?.substring(0, 4) ||
                        ''}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          className="scroll-button scroll-button-right"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default ContentRow;
