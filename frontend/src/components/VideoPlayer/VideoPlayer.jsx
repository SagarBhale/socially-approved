import React, { useCallback, useEffect, useRef, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import { useVideoControls } from '../../hooks/useVideoControls';
import { likeVideo } from '../../services/api';
import ShareMenu from '../ShareMenu/ShareMenu';
import './VideoPlayer.css';

const VideoPlayer = ({ video, isCenter, isActive }) => {
  const {
    videoRef, isPlaying, isMuted, isBuffering, progress,
    currentTime, duration, hasError, play, pause,
    togglePlay, toggleMute, seek, reset, formatTime,
  } = useVideoControls({ autoPlay: false, muted: true });

  const containerRef = useRef(null);
  const [srcLoaded, setSrcLoaded] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showBigPlay, setShowBigPlay] = useState(false);
  const bigPlayTimer = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSrcLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px', threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (!entry.isIntersecting) pause(); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [pause]);

  useEffect(() => {
    if (!srcLoaded) return;
    if (isCenter && isActive) play();
    else pause();
  }, [isCenter, isActive, srcLoaded, play, pause]);

  useEffect(() => {
    if (!isActive) reset();
  }, [isActive, reset]);

  const handleProgressClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    seek(Math.max(0, Math.min(100, pct)));
  }, [seek]);

  const handleLike = useCallback(async () => {
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikeCount((c) => c + (nextLiked ? 1 : -1));
    try {
      const res = await likeVideo(video.id);
      if (res?.data) {
        setLikeCount(res.data.likes);
        setIsLiked(res.data.liked);
      }
    } catch {
      setIsLiked(!nextLiked);
      setLikeCount((c) => c + (nextLiked ? -1 : 1));
    }
  }, [isLiked, video.id]);

  const handleVideoClick = useCallback(() => {
    togglePlay();
    setShowBigPlay(true);
    clearTimeout(bigPlayTimer.current);
    bigPlayTimer.current = setTimeout(() => setShowBigPlay(false), 600);
  }, [togglePlay]);

  const formatLikes = (n) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
  };

  return (
    <div
      ref={containerRef}
      className={`video-player ${showBigPlay ? 'video-player--show-big-play' : ''}`}
      id={`video-player-${video.id}`}
    >
      {srcLoaded && (
        <video
          ref={videoRef}
          className="video-player__video"
          src={video.url}
          muted={isMuted}
          playsInline
          loop
          preload="metadata"
          onClick={handleVideoClick}
          aria-label={`Video: ${video.title}`}
        />
      )}

      <div className="video-player__big-play" aria-hidden="true">
        {isPlaying ? <PauseIcon sx={{ color: '#fff', fontSize: 32 }} /> : <PlayArrowIcon sx={{ color: '#fff', fontSize: 32 }} />}
      </div>

      {isBuffering && (
        <div className="video-player__spinner" aria-label="Loading video">
          <CircularProgress size={44} sx={{ color: 'var(--color-accent-1)' }} />
        </div>
      )}

      {hasError && (
        <div className="video-player__error">
          <BrokenImageIcon className="video-player__error-icon" />
          <span className="video-player__error-text">Unable to load video</span>
        </div>
      )}

      <div className="video-player__meta" aria-hidden="true">
        <p className="video-player__meta-title">{video.title}</p>
        <p className="video-player__meta-desc">{video.description}</p>
      </div>

      <div className="video-player__controls">
        <div
          className="video-player__progress-wrapper"
          role="slider"
          aria-label="Video progress"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onClick={handleProgressClick}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') seek(Math.min(100, progress + 5));
            if (e.key === 'ArrowLeft') seek(Math.max(0, progress - 5));
          }}
        >
          <div className="video-player__progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="video-player__controls-row">
          <button
            className="video-player__btn video-player__btn--play"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            id={`play-btn-${video.id}`}
          >
            {isPlaying ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
          </button>

          <button
            className="video-player__btn"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            id={`mute-btn-${video.id}`}
          >
            {isMuted ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
          </button>

          <span className="video-player__time">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="video-player__controls-right">
            <button
              className={`video-player__like-btn ${isLiked ? 'video-player__like-btn--active' : ''}`}
              onClick={handleLike}
              aria-label={isLiked ? 'Unlike video' : 'Like video'}
              aria-pressed={isLiked}
              id={`like-btn-${video.id}`}
            >
              {isLiked
                ? <FavoriteIcon className="video-player__like-icon" />
                : <FavoriteBorderIcon className="video-player__like-icon" />}
              <span>{formatLikes(likeCount)}</span>
            </button>

            <ShareMenu videoId={video.id} title={video.title} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
