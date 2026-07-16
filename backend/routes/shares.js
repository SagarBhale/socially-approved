const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/videos.json');

const shareLog = [];

let videosData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));

const VALID_PLATFORMS = ['copy', 'twitter', 'whatsapp', 'facebook', 'instagram', 'other'];

router.post('/', (req, res) => {
  const { videoId, platform } = req.body;

  if (!videoId) {
    return res.status(400).json({ success: false, error: 'videoId is required' });
  }

  const normalizedPlatform = (platform || 'other').toLowerCase();

  if (!VALID_PLATFORMS.includes(normalizedPlatform)) {
    return res.status(400).json({ success: false, error: `Invalid platform. Valid: ${VALID_PLATFORMS.join(', ')}` });
  }

  const video = videosData.find((v) => v.id === videoId);

  if (!video) {
    return res.status(404).json({ success: false, error: 'Video not found' });
  }

  video.shares += 1;

  const shareEvent = {
    videoId,
    platform: normalizedPlatform,
    timestamp: new Date().toISOString(),
    userIP: req.headers['x-forwarded-for'] || req.ip,
  };
  shareLog.push(shareEvent);

  res.json({
    success: true,
    videoId,
    platform: normalizedPlatform,
    shares: video.shares,
  });
});

router.get('/log', (req, res) => {
  res.json({ success: true, total: shareLog.length, data: shareLog.slice(-50) });
});

module.exports = router;
