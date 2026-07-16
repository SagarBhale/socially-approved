const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const videosRouter = require('./routes/videos');
const likesRouter = require('./routes/likes');
const sharesRouter = require('./routes/shares');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const corsOptions = {
  origin:
    NODE_ENV === 'production'
      ? true
      : ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/videos', videosRouter);
app.use('/api/like', likesRouter);
app.use('/api/share', sharesRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', env: NODE_ENV, timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({
    name: 'Socially Approved API',
    version: '1.0.0',
    endpoints: [
      'GET  /api/videos',
      'GET  /api/videos/:id',
      'POST /api/like',
      'POST /api/share',
      'GET  /api/health',
    ],
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API running on port ${PORT}`);
});
