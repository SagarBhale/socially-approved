import { useState, useRef, useCallback, useEffect } from 'react';

export function useVideoControls({ autoPlay = false, muted = true } = {}) {
  const videoRef = useRef(null);
  const progressAnimRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [isBuffering, setIsBuffering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const updateProgress = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const pct = video.duration ? (video.currentTime / video.duration) * 100 : 0;
    setProgress(pct);
    setCurrentTime(video.currentTime);
    if (!video.paused && !video.ended) {
      progressAnimRef.current = requestAnimationFrame(updateProgress);
    }
  }, []);

  const play = useCallback(async () => {
    const video = videoRef.current;
    if (!video || hasError) return;
    try {
      await video.play();
      setIsPlaying(true);
      progressAnimRef.current = requestAnimationFrame(updateProgress);
    } catch (err) {
      console.warn('[VideoControls] play() blocked:', err.message);
    }
  }, [hasError, updateProgress]);

  const pause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    setIsPlaying(false);
    cancelAnimationFrame(progressAnimRef.current);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const seek = useCallback((pct) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    video.currentTime = (pct / 100) * video.duration;
    setProgress(pct);
  }, []);

  const reset = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    cancelAnimationFrame(progressAnimRef.current);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoaded(true);
      if (autoPlay) play();
    };
    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => { setIsBuffering(false); setIsPlaying(true); };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(100);
      cancelAnimationFrame(progressAnimRef.current);
    };
    const onError = () => { setHasError(true); setIsBuffering(false); };
    const onCanPlay = () => setIsBuffering(false);

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);
    video.addEventListener('error', onError);
    video.addEventListener('canplay', onCanPlay);

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('error', onError);
      video.removeEventListener('canplay', onCanPlay);
      cancelAnimationFrame(progressAnimRef.current);
    };
  }, [autoPlay, play]);

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return {
    videoRef, isPlaying, isMuted, isBuffering, progress,
    duration, currentTime, hasError, isLoaded,
    play, pause, togglePlay, toggleMute, seek, reset, formatTime,
  };
}
