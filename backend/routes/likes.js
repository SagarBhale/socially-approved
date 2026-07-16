const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/videos.json');

const likeStore = new Map();

let videosData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));

function getUserIP(req) {
  return (
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.ip ||
    'anonymous'
  );
}

router.post('/', (req, res) => {
  const { videoId } = req.body;

  if (!videoId) {
    return res.status(400).json({ success: false, error: 'videoId is required' });
  }

  const userIP = getUserIP(req);
  const video = videosData.find((v) => v.id === videoId);

  if (!video) {
    return res.status(404).json({ success: false, error: 'Video not found' });
  }

  if (!likeStore.has(videoId)) {
    likeStore.set(videoId, new Set());
  }

  const likers = likeStore.get(videoId);
  let liked;

  if (likers.has(userIP)) {
    likers.delete(userIP);
    video.likes = Math.max(0, video.likes - 1);
    liked = false;
  } else {
    likers.add(userIP);
    video.likes += 1;
    liked = true;
  }

  res.json({
    success: true,
    videoId,
    liked,
    likes: video.likes,
  });
});

module.exports = router;
