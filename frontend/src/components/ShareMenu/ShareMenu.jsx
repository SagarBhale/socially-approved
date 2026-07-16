import React, { useState, useCallback } from 'react';
import Popover from '@mui/material/Popover';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { shareVideo } from '../../services/api';
import './ShareMenu.css';

const PLATFORMS = [
  {
    key: 'copy',
    label: 'Copy Link',
    icon: <ContentCopyIcon fontSize="small" />,
    iconClass: 'share-menu__item-icon--copy',
  },
  {
    key: 'twitter',
    label: 'Twitter / X',
    icon: '𝕏',
    iconClass: 'share-menu__item-icon--twitter',
    getUrl: (url, title) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    icon: '💬',
    iconClass: 'share-menu__item-icon--whatsapp',
    getUrl: (url, title) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    key: 'facebook',
    label: 'Facebook',
    icon: 'f',
    iconClass: 'share-menu__item-icon--facebook',
    getUrl: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    key: 'instagram',
    label: 'Instagram',
    icon: '📷',
    iconClass: 'share-menu__item-icon--instagram',
  },
];

const ShareMenu = ({ videoId, title }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [copied, setCopied] = useState(false);

  const open = Boolean(anchorEl);
  const shareUrl = `${window.location.origin}?v=${videoId}`;

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => {
    setAnchorEl(null);
    setCopied(false);
  };

  const handleShare = useCallback(
    async (platform) => {
      try {
        shareVideo(videoId, platform).catch(() => {});
        if (platform === 'copy') {
          await navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } else {
          const p = PLATFORMS.find((pl) => pl.key === platform);
          if (p?.getUrl) {
            window.open(p.getUrl(shareUrl, title), '_blank', 'noopener,noreferrer');
            handleClose();
          }
        }
      } catch (err) {
        console.error('[ShareMenu]', err);
      }
    },
    [videoId, title, shareUrl]
  );

  return (
    <>
      <button
        className="share-menu__trigger"
        onClick={handleOpen}
        aria-label="Share video"
        aria-haspopup="true"
        aria-expanded={open}
        id={`share-trigger-${videoId}`}
      >
        <ShareIcon className="share-menu__trigger-icon" />
        <span>Share</span>
      </button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        PaperProps={{ className: 'share-menu__paper' }}
      >
        <p className="share-menu__header">Share to</p>
        <div className="share-menu__list" role="menu">
          {PLATFORMS.map((platform) => (
            <button
              key={platform.key}
              className={`share-menu__item ${platform.key === 'copy' && copied ? 'share-menu__item--copied' : ''}`}
              role="menuitem"
              onClick={() => handleShare(platform.key)}
              id={`share-${platform.key}-${videoId}`}
            >
              <span className={`share-menu__item-icon ${platform.iconClass}`}>
                {platform.key === 'copy' && copied ? (
                  <CheckIcon fontSize="small" />
                ) : (
                  platform.icon
                )}
              </span>
              {platform.key === 'copy' && copied ? 'Link Copied!' : platform.label}
            </button>
          ))}
        </div>
      </Popover>
    </>
  );
};

export default ShareMenu;
