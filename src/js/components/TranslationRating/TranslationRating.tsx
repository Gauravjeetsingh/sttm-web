import React, { useState } from 'react';
import RatingPopup from './RatingPopup';
import { useGetUser } from '@/hooks/use-get-user';

interface TranslationRatingProps {
  translationId: string;
  translationLanguage: string;
  translationSource: string;
  translationTextEl: React.JSX.Element;
}

const TranslationRating: React.FC<TranslationRatingProps> = ({
  translationId,
  translationTextEl,
  translationLanguage,
  translationSource,
}) => {
  const { user } = useGetUser();
  
  if (!user) {
    return null;
  }

  const currentRating = 0;
  const [isVisible, setIsVisible] = useState(true);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [clickedRating, setClickedRating] = useState(0);

  const handleStarClick = (rating: number) => {
    setClickedRating(rating);
    setIsVisible(false);
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsVisible(true);
    setHoveredRating(0);
    setIsPopupOpen(false);
  };

  const handleStarHover = (rating: number) => {
    setHoveredRating(rating);
  };

  return (
    <>
      {isVisible && (
      <div
        className="translation-rating"
        data-translation-id={translationId}
        onMouseLeave={() =>  setHoveredRating(0)}
      >
        <div className="translation-rating__stars">
          {[1, 2, 3, 4, 5].map((star) => {
            const isActive =
              hoveredRating >= star ||
              (!hoveredRating && currentRating >= star);
            return (
              <button
                key={star}
                className={`translation-rating__star ${
                  isActive ? 'active' : ''
                }`}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                type="button"
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                ★
              </button>
            );
          })}
        </div>
        <div className="translation-rating__label">Rate this translation</div>
      </div>
      )}

      <RatingPopup
        isOpen={isPopupOpen}
        onClose={handlePopupClose}
        translationTextEl={translationTextEl}
        currentRating={clickedRating}
        metadata={{
          verseId: translationId,
          translationLanguage,
          translationSource,
        }}
      />
    </>
  );
};

export default TranslationRating;
