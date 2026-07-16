import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const fetchVideos = (page = 1, limit = 30) =>
  apiClient.get('/videos', { params: { page, limit } });

export const fetchVideoById = (videoId) =>
  apiClient.get(`/videos/${videoId}`);

export const likeVideo = (videoId) =>
  apiClient.post('/like', { videoId });

export const shareVideo = (videoId, platform = 'copy') =>
  apiClient.post('/share', { videoId, platform });

export default apiClient;
