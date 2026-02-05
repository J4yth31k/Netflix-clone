// ContentModal Component - Movie/Show details modal
import React, { useState, useEffect } from 'react';
import { getDetails, getBackdropUrl, getVideos } from './tmdb';
import './ContentModal.css';

const ContentModal = ({ content, onClose, onPlayClick }) => {
  const [details, setDetails] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!content) return;

    const loadDetails = async () => {
      try {
        setLoading(true);
        const mediaType = content.media_type || (content.title ? 'movie' : 'tv');

        // Fetch detailed information
        const detailsData = await getDetails(mediaType, content.id);
        setDetails(detailsData);

        // Fetch videos (trailers)
        const videosData = await getVideos(mediaType, content.id);
        const trailerVideo = videosData.find(
          (vid) => vid.type === 'Trailer' && vid.site === 'YouTube'
        );
        setTrailer(trailerVideo);
      } catch (error) {
        console.error('Error loading content details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [content]);

  if (!content) return null;

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      onClose();
    }
  };

  const handlePlayClick = () => {
    if (onPlayClick) {
      onPlayClick(content, trailer);
    }
  };

  const backdropUrl = getBackdropUrl(content.backdrop_path || content.poster_path);
  const title = content.title || content.name;
  const releaseDate = content.release_date || content.first_air_date;
  const year = releaseDate?.substring(0, 4);

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="modal-header">
          {backdropUrl && (
            <img
              src={backdropUrl}
              alt={title}
              className="modal-backdrop-image"
            />
          )}
          <div className="modal-header-overlay">
            <h2 className="modal-title">{title}</h2>
            <div className="modal-buttons">
              <button className="btn-play" onClick={handlePlayClick}>
                ▶ Play
              </button>
              <button className="btn-icon" title="Add to My List">
                +
              </button>
              <button className="btn-icon" title="Like">
                👍
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="modal-loading">Loading details...</div>
        ) : (
          <div className="modal-body">
            <div className="modal-main">
              <div className="modal-stats">
                <span className="match-score">
                  {content.vote_average ? `${Math.round(content.vote_average * 10)}% Match` : ''}
                </span>
                <span className="year">{year}</span>
                {details?.runtime && (
                  <span className="runtime">{details.runtime} min</span>
                )}
                {details?.number_of_seasons && (
                  <span className="seasons">{details.number_of_seasons} Seasons</span>
                )}
              </div>

              <p className="modal-overview">
                {content.overview || 'No description available.'}
              </p>
            </div>

            <div className="modal-sidebar">
              {details?.genres && details.genres.length > 0 && (
                <div className="modal-info-item">
                  <span className="info-label">Genres:</span>
                  <span className="info-value">
                    {details.genres.map((g) => g.name).join(', ')}
                  </span>
                </div>
              )}

              {details?.credits?.cast && details.credits.cast.length > 0 && (
                <div className="modal-info-item">
                  <span className="info-label">Cast:</span>
                  <span className="info-value">
                    {details.credits.cast
                      .slice(0, 4)
                      .map((c) => c.name)
                      .join(', ')}
                  </span>
                </div>
              )}

              {details?.created_by && details.created_by.length > 0 && (
                <div className="modal-info-item">
                  <span className="info-label">Creator:</span>
                  <span className="info-value">
                    {details.created_by.map((c) => c.name).join(', ')}
                  </span>
                </div>
              )}

              {content.vote_average && (
                <div className="modal-info-item">
                  <span className="info-label">Rating:</span>
                  <span className="info-value">
                    ⭐ {content.vote_average.toFixed(1)}/10
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {details?.similar && details.similar.results?.length > 0 && (
          <div className="modal-similar">
            <h3>More Like This</h3>
            <div className="similar-grid">
              {details.similar.results.slice(0, 6).map((item) => (
                <div key={item.id} className="similar-item">
                  {item.backdrop_path && (
                    <img
                      src={getBackdropUrl(item.backdrop_path, 'w300')}
                      alt={item.title || item.name}
                    />
                  )}
                  <div className="similar-info">
                    <h4>{item.title || item.name}</h4>
                    <span className="similar-rating">
                      ⭐ {item.vote_average?.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentModal;
