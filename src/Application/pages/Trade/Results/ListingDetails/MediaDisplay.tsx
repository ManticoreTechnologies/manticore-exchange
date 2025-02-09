import React, { useRef, useState, useEffect } from 'react';
import { FiTool } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

interface MediaDisplayProps {
  mediaSrc: string;
  isManageMode: boolean;
  newIpfsHash: string | null;
  handleImageUpload: () => void;
  handleMediaError: () => void;
  handleMediaLoad: () => void;
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({
  mediaSrc,
  isManageMode,
  newIpfsHash,
  handleImageUpload,
  handleMediaError,
  handleMediaLoad
}) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isVideo, setIsVideo] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const [mediaError, setMediaError] = useState<string>('');

    useEffect(() => {
    const fetchFileMetadata = async () => {
      try {
        const response = await fetch(mediaSrc, { method: 'HEAD' });
                    const contentType = response.headers.get('Content-Type');
                    setIsVideo(contentType?.startsWith('video') || false);
        setIsMediaLoading(false);
      } catch (error) {
        console.error('Error fetching file metadata:', error);
        setMediaError(t('mediaLoadFailed'));
        setIsMediaLoading(false);
        }
    };

    fetchFileMetadata();
  }, [mediaSrc, t]);

    return (
        <div 
      className="media-container"
      onClick={() => isManageMode && handleImageUpload()}
      style={{ cursor: isManageMode ? 'pointer' : 'default' }}
        >
      {isMediaLoading ? (
        <div className="media-loader">{t('loading')}</div>
      ) : mediaError ? (
        <div className="media-error">{mediaError}</div>
      ) : isVideo ? (
        <div className="video-container">
                <video
            ref={videoRef}
            src={newIpfsHash || mediaSrc}
            className="trading-video"
            playsInline
                    autoPlay
                    muted
                    loop
            onError={handleMediaError}
            onLoadedData={handleMediaLoad}
            crossOrigin="anonymous"
                />
        </div>
            ) : (
                <img
          src={newIpfsHash || mediaSrc}
          alt="Media"
          className="trading-image"
          onError={handleMediaError}
          onLoad={handleMediaLoad}
                />
            )}
      {isManageMode && (
        <div className="media-overlay">
          <FiTool className="wrench-icon" /> {t('clickToChangeIpfs')}
                </div>
            )}
        </div>
    );
};

export default MediaDisplay; 