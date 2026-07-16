import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { fetchVideos } from './services/api';
import OuterCarousel from './components/OuterCarousel/OuterCarousel';
import InnerCarousel from './components/InnerCarousel/InnerCarousel';
import './App.css';

const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7c3aed' },
    secondary: { main: '#ec4899' },
    background: {
      default: '#0a0a0f',
      paper: '#16161f',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Outfit', sans-serif",
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: { backgroundImage: 'none' },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: { backgroundImage: 'none' },
      },
    },
  },
});

const App = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchVideos(1, 30);
        setVideos(res.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load videos');
        setToast({ open: true, message: 'Failed to load videos from server', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    loadVideos();
  }, []);

  const handleVideoClick = useCallback((index) => {
    setActiveVideoIndex(index);
    setModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleToastClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setToast((t) => ({ ...t, open: false }));
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div className="app-wrapper">
        <header className="app-header">
          <p className="app-header__eyebrow">✦ Trending Now</p>
          <h1 className="app-header__title">
            <span className="gradient-text">Socially Approved</span>
          </h1>
          <p className="app-header__subtitle">
            Discover the most-loved videos curated from around the world. Click any card to dive in.
          </p>
        </header>

        <main className="app-main" id="main-content">
          {error && !loading && (
            <div className="app-error" role="alert">
              <div className="app-error__icon">⚠️</div>
              <h2 className="app-error__title">Something went wrong</h2>
              <p className="app-error__message">{error}</p>
            </div>
          )}

          {loading && (
            <div className="app-loading" aria-live="polite" aria-busy="true">
              <CircularProgress size={40} sx={{ color: 'var(--color-accent-1)' }} />
              <span>Loading videos...</span>
            </div>
          )}

          {!error && (
            <OuterCarousel videos={videos} loading={loading} onVideoClick={handleVideoClick} />
          )}
        </main>

        <InnerCarousel
          open={modalOpen}
          videos={videos}
          initialIndex={activeVideoIndex}
          onClose={handleModalClose}
        />

        <Snackbar
          open={toast.open}
          autoHideDuration={4000}
          onClose={handleToastClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          className="app-toast"
        >
          <Alert onClose={handleToastClose} severity={toast.severity} sx={{ width: '100%', borderRadius: '12px' }}>
            {toast.message}
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
};

export default App;
