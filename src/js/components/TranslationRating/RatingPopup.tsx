import React, { useState, useEffect } from 'react';

interface RatingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  translationTextEl: React.JSX.Element;
  currentRating: number;
  metadata: {
    verseId: string;
    translationLanguage: string;
    translationSource: string;
  };
}

const RatingPopup: React.FC<RatingPopupProps> = ({
  isOpen,
  onClose,
  translationTextEl,
  currentRating,
  metadata,
}) => {
  const [rating, setRating] = useState(currentRating);
  const [comment, setComment] = useState('');

  useEffect(() => {
    setRating(currentRating);
  }, [currentRating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(translationTextEl.props.children, rating, comment, metadata);
    onClose();
  };

  const handleCancel = () => {
    setComment('');
    setRating(currentRating);
    onClose();
  };

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  if (!isOpen) return null;

  return (
    <div className="rating-popup-overlay" onClick={onClose}>
      <div className="rating-popup" onClick={(e) => e.stopPropagation()}>
        <div className="rating-popup__header">
          <h3>Rate Translation</h3>
        </div>

        <div className="rating-popup__content">
          <div className="rating-popup__translation">
            <h4>Translation:</h4>
            {translationTextEl}
          </div>

          <div className="rating-popup__rating">
            <h4>Your Rating:</h4>
            <div className="rating-popup__stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`rating-popup__star ${
                    rating >= star ? 'active' : ''
                  }`}
                  onClick={() => handleStarClick(star)}
                  type="button"
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rating-popup__form">
            <div className="rating-popup__comment">
              <label htmlFor="comment">Comment (optional):</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Any additional comments or feedback..."
                rows={3}
                maxLength={500}
              />
              <p className="rating-popup__char-count">
                {comment.length}/500
              </p>
            </div>

            <div className="rating-popup__actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={rating === 0}
              >
                Submit Rating
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RatingPopup;
