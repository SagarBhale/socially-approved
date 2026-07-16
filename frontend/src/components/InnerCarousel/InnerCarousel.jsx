import React, { useState, useEffect, useCallback, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import CommentIcon from '@mui/icons-material/Comment';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import './InnerCarousel.css';

const DUMMY_COMMENTS = [
  { id: 1, author: 'Alex M.', text: 'This is absolutely stunning! 🔥', avatar: 'https://i.pravatar.cc/30?img=1' },
  { id: 2, author: 'Priya K.', text: 'Loved every second of this video!', avatar: 'https://i.pravatar.cc/30?img=2' },
  { id: 3, author: 'Sam W.', text: "The lighting in this is chef's kiss 👌", avatar: 'https://i.pravatar.cc/30?img=3' },
  { id: 4, author: 'Jordan L.', text: "Can't stop watching this on repeat 😍", avatar: 'https://i.pravatar.cc/30?img=4' },
];

const InnerCarousel = ({ open, videos = [], initialIndex = 0, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [showComments, setShowComments] = useState(false);
  const [localComments, setLocalComments] = useState(DUMMY_COMMENTS);
  const [commentText, setCommentText] = useState('');

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (open) setActiveIndex(initialIndex);
  }, [open, initialIndex]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => Math.min(i + 1, videos.length - 1));
  }, [videos.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => Math.max(i - 1, 0));
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, goNext, goPrev, onClose]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setLocalComments((prev) => [
      ...prev,
      { id: Date.now(), author: 'You', text: commentText.trim(), avatar: 'https://i.pravatar.cc/30?img=10' },
    ]);
    setCommentText('');
  };

  const getSlideClass = (index) => {
    if (index === activeIndex) return 'inner-carousel__slide--center';
    if (index === activeIndex - 1) return 'inner-carousel__slide--left';
    if (index === activeIndex + 1) return 'inner-carousel__slide--right';
    return '';
  };

  const trackOffset = Math.max(0, activeIndex - 1) * (100 / 3);
  const totalDots = videos.length;
  const visibleDots = Math.min(totalDots, 7);
  const dotStart = Math.max(0, Math.min(activeIndex - 3, totalDots - visibleDots));

  if (!videos.length) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{ className: 'inner-carousel__dialog-paper' }}
      aria-label="Video carousel modal"
      aria-modal="true"
    >
      <div className="inner-carousel" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <header className="inner-carousel__topbar">
          <div className="inner-carousel__topbar-left">
            <button
              className="inner-carousel__back-btn"
              onClick={onClose}
              aria-label="Close video modal"
              id="inner-carousel-close-btn"
            >
              <CloseIcon fontSize="small" />
              Close
            </button>
            <h2 className="inner-carousel__title">{videos[activeIndex]?.title}</h2>
          </div>
          <div className="inner-carousel__indicator" aria-live="polite">
            {activeIndex + 1} / {videos.length}
          </div>
        </header>

        <main className="inner-carousel__stage">
          <button
            className="inner-carousel__arrow inner-carousel__arrow--left"
            onClick={goPrev}
            disabled={activeIndex === 0}
            aria-label="Previous video"
            id="inner-carousel-prev-btn"
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </button>

          <div
            className="inner-carousel__track"
            style={{ transform: `translateX(-${trackOffset * (100 / 3)}%)` }}
          >
            {videos.map((video, index) => {
              const isNear = Math.abs(index - activeIndex) <= 2;
              if (!isNear) {
                return (
                  <div
                    key={video.id}
                    className={`inner-carousel__slide ${getSlideClass(index)}`}
                    aria-hidden="true"
                  />
                );
              }
              return (
                <div
                  key={video.id}
                  className={`inner-carousel__slide ${getSlideClass(index)}`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                  onClick={() => setActiveIndex(index)}
                  style={{ cursor: index !== activeIndex ? 'pointer' : 'default' }}
                >
                  <VideoPlayer video={video} isCenter={index === activeIndex} isActive={open} />
                </div>
              );
            })}
          </div>

          <button
            className="inner-carousel__arrow inner-carousel__arrow--right"
            onClick={goNext}
            disabled={activeIndex === videos.length - 1}
            aria-label="Next video"
            id="inner-carousel-next-btn"
          >
            <ArrowForwardIosIcon fontSize="small" />
          </button>
        </main>

        <nav className="inner-carousel__dots" aria-label="Video navigation" role="tablist">
          {Array.from({ length: visibleDots }).map((_, i) => {
            const realIndex = dotStart + i;
            return (
              <button
                key={realIndex}
                className={`inner-carousel__dot ${realIndex === activeIndex ? 'inner-carousel__dot--active' : ''}`}
                onClick={() => setActiveIndex(realIndex)}
                role="tab"
                aria-selected={realIndex === activeIndex}
                aria-label={`Go to video ${realIndex + 1}`}
                id={`dot-${realIndex}`}
              />
            );
          })}
        </nav>

        <section className="inner-carousel__comments" aria-label="Comments">
          <button
            className="inner-carousel__comments-toggle"
            onClick={() => setShowComments((s) => !s)}
            aria-expanded={showComments}
            id="comments-toggle-btn"
          >
            <CommentIcon fontSize="small" />
            Comments ({localComments.length})
            {showComments ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowUpIcon fontSize="small" />}
          </button>

          {showComments && (
            <>
              <div className="inner-carousel__comments-body" role="list">
                {localComments.map((c) => (
                  <div key={c.id} className="inner-carousel__comment" role="listitem">
                    <img className="inner-carousel__comment-avatar" src={c.avatar} alt={c.author} loading="lazy" />
                    <div className="inner-carousel__comment-content">
                      <p className="inner-carousel__comment-author">{c.author}</p>
                      <p className="inner-carousel__comment-text">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form className="inner-carousel__comment-form" onSubmit={handleCommentSubmit} aria-label="Add comment">
                <input
                  className="inner-carousel__comment-input"
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  maxLength={200}
                  id="comment-input"
                  aria-label="Comment text"
                />
                <button type="submit" className="inner-carousel__comment-submit" id="comment-submit-btn">
                  Post
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </Dialog>
  );
};

export default InnerCarousel;
