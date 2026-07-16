const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/videos.json');

let videosData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));

router.get('/', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = videosData.slice(start, end);
    res.json({
      success: true,
      total: videosData.length,
      page,
      limit,
      data: paginated,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:id', (req, res) => {
  const video = videosData.find((v) => v.id === req.params.id);
  if (!video) {
    return res.status(404).json({ success: false, error: 'Video not found' });
  }
  res.json({ success: true, data: video });
});

module.exports = router;
module.exports.getVideos = () => videosData;
module.exports.updateVideo = (id, updates) => {
  const idx = videosData.findIndex((v) => v.id === id);
  if (idx !== -1) {
    videosData[idx] = { ...videosData[idx], ...updates };
    return videosData[idx];
  }
  return null;
};
