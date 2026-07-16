import React, { useRef, useState, useCallback } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import VideoCard from '../VideoCard/VideoCard';
import './OuterCarousel.css';

const SCROLL_AMOUNT = 700;

const OuterCarousel = ({ videos = [], loading = false, onVideoClick }) => {
  const trackRef = useRef(null);

  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartLeft = useRef(0);
  const [isDragActive, setIsDragActive] = useState(false);

  const scrollLeft = useCallback(() => {
    trackRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
  }, []);

  const scrollRight = useCallback(() => {
    trackRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
  }, []);

  const onMouseDown = useCallback((e) => {
    isDragging.current = true;
    dragStartX.current = e.pageX - trackRef.current.offsetLeft;
    scrollStartLeft.current = trackRef.current.scrollLeft;
    setIsDragActive(true);
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - dragStartX.current) * 1.5;
    trackRef.current.scrollLeft = scrollStartLeft.current - walk;
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    setIsDragActive(false);
  }, []);

  const onMouseLeave = useCallback(() => {
    isDragging.current = false;
    setIsDragActive(false);
  }, []);

  const touchStartX = useRef(0);
  const touchScrollLeft = useRef(0);

  const onTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].pageX;
    touchScrollLeft.current = trackRef.current.scrollLeft;
  }, []);

  const onTouchMove = useCallback((e) => {
    const x = e.touches[0].pageX;
    const walk = touchStartX.current - x;
    trackRef.current.scrollLeft = touchScrollLeft.current + walk;
  }, []);

  return (
    <section className="outer-carousel" aria-label="Socially Approved Videos">
      <div className="outer-carousel__header">
        <div className="outer-carousel__title">
          Socially Approved
          <span className="outer-carousel__title-badge">LIVE</span>
          {!loading && (
            <span className="outer-carousel__count">{videos.length} videos</span>
          )}
        </div>
        <div className="outer-carousel__nav" aria-label="Carousel navigation">
          <button className="outer-carousel__nav-btn" onClick={scrollLeft} aria-label="Scroll left">
            <ChevronLeftIcon fontSize="small" />
          </button>
          <button className="outer-carousel__nav-btn" onClick={scrollRight} aria-label="Scroll right">
            <ChevronRightIcon fontSize="small" />
          </button>
        </div>
      </div>

      <div className="outer-carousel__track-wrapper">
        {loading ? (
          <div className="outer-carousel__loading" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="outer-carousel__skeleton-card" />
            ))}
          </div>
        ) : (
          <div
            ref={trackRef}
            className="outer-carousel__track"
            role="list"
            aria-label="Video thumbnails"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            style={{ userSelect: isDragActive ? 'none' : 'auto' }}
          >
            {videos.map((video, index) => (
              <div key={video.id} role="listitem">
                <VideoCard video={video} index={index} onClick={onVideoClick} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OuterCarousel;
