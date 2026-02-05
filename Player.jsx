// Player Component - Video player with controls
import React, { useState, useRef, useEffect } from 'react';
import './Player.css';

const Player = ({ content, trailer, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const title = content?.title || content?.name || 'Video Player';
  const videoUrl = trailer
    ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&controls=0&showinfo=0&rel=0&modestbranding=1`
    : null;

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (showControls) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    }

    return () => clearTimeout(controlsTimeoutRef.current);
  }, [showControls, isPlaying]);

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume || 0.5;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const skipTime = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`player-container ${isFullscreen ? 'fullscreen' : ''}`}
      ref={playerRef}
      onMouseMove={handleMouseMove}
    >
      <button className="player-close" onClick={onClose} aria-label="Close player">
        ✕
      </button>

      <div className="player-content">
        {videoUrl ? (
          <iframe
            src={videoUrl}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="player-iframe"
          />
        ) : (
          <div className="player-video-wrapper">
            <video
              ref={videoRef}
              className="player-video"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onClick={togglePlay}
            >
              <source src="/sample-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <div className="player-placeholder">
              <h2>{title}</h2>
              <p>Video playback would appear here</p>
              <button className="btn-play-large" onClick={togglePlay}>
                {isPlaying ? '⏸' : '▶'} {isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={`player-controls ${showControls ? 'visible' : ''}`}>
        <div className="controls-top">
          <h3 className="player-title">{title}</h3>
        </div>

        <div className="controls-bottom">
          <div className="progress-container">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="progress-bar"
              style={{
                background: `linear-gradient(to right, #e50914 0%, #e50914 ${progress}%, #555 ${progress}%, #555 100%)`,
              }}
            />
          </div>

          <div className="controls-actions">
            <div className="controls-left">
              <button
                className="control-btn"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>

              <button
                className="control-btn"
                onClick={() => skipTime(-10)}
                aria-label="Rewind 10 seconds"
              >
                ⏪
              </button>

              <button
                className="control-btn"
                onClick={() => skipTime(10)}
                aria-label="Forward 10 seconds"
              >
                ⏩
              </button>

              <div className="volume-control">
                <button
                  className="control-btn"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
              </div>

              <span className="time-display">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="controls-right">
              <button
                className="control-btn"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? '⛶' : '⛶'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
