import React, { useState, useRef, useEffect } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteIcon from '@mui/icons-material/Favorite';
import './VideoCard.css';

const VideoCard = ({ video, index, onClick }) => {
  const cardRef = useRef(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px', threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleClick = () => onClick(index);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(index);
    }
  };

  const formatLikes = (n) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
  };

  return (
    <article
      ref={cardRef}
      className="video-card"
      role="button"
      tabIndex={0}
      aria-label={`Play ${video.title}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
    >
      {!imgLoaded && <div className="video-card__skeleton" />}

      {isVisible && (
        <img
          className="video-card__thumbnail"
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgLoaded(true)}
          style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
        />
      )}

      <div className="video-card__overlay" />
      <span className="video-card__duration">{video.duration}</span>

      <div className="video-card__play-btn" aria-hidden="true">
        <PlayArrowIcon className="video-card__play-icon" />
      </div>

      <div className="video-card__info">
        <h3 className="video-card__title">{video.title}</h3>
        <div className="video-card__meta">
          <span className="video-card__likes">
            <FavoriteIcon className="video-card__likes-icon" />
            {formatLikes(video.likes)}
          </span>
        </div>
      </div>
    </article>
  );
};

export default VideoCard;
