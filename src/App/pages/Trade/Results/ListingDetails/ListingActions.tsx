import React from 'react';
import { FiHeart, FiTool } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

interface ListingActionsProps {
  isLiked: boolean;
  likeCount: number;
  handleLikeToggle: () => void;
  handleManageClick: () => void;
  isManageMode: boolean;
}

const ListingActions: React.FC<ListingActionsProps> = ({
  isLiked,
  likeCount,
  handleLikeToggle,
  handleManageClick,
  isManageMode
}) => {
  const { t } = useTranslation();

  return (
    <div className="actions">
      <button onClick={handleLikeToggle} className={`like-button ${isLiked ? 'liked' : ''}`}>
        <FiHeart /> {likeCount}
      </button>
      <button onClick={handleManageClick} className={`manage-button ${isManageMode ? 'active' : ''}`}>
        <FiTool /> {isManageMode ? t('exitManage') : t('manage')}
      </button>
    </div>
  );
};

export default ListingActions; 