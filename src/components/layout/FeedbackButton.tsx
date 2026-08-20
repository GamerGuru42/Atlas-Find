'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Star, CheckCircle2, Loader2 } from 'lucide-react';
import styles from './Feedback.module.css';

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState<'Bug' | 'Feature' | 'Experience' | 'Other'>('Experience');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          category,
          comments,
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setComments('');
        setRating(0);
        setCategory('Experience');
      }
    } catch (err) {
      console.error('[Feedback Submission Error]', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsSuccess(false);
  };

  return (
    <div className={styles.floatingContainer}>
      {/* Floating Action Button */}
      <button 
        className={styles.feedbackBtn} 
        onClick={() => setIsOpen(true)}
        aria-label="Give feedback"
      >
        <MessageSquare size={16} />
        <span>Feedback</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className={styles.modalOverlay} onClick={handleClose}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={handleClose} aria-label="Close modal">
              <X size={18} />
            </button>

            {!isSuccess ? (
              <form onSubmit={handleSubmit} className={styles.modalBody}>
                <h3 className={styles.modalTitle}>
                  <MessageSquare size={20} style={{ color: 'var(--accent-primary)' }} />
                  <span>Give us your feedback</span>
                </h3>
                <p className={styles.modalText}>
                  Your feedback helps us make AtlasFind better. Let us know how your experience is going!
                </p>

                {/* Rating selection (Stars) */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Rate your experience</label>
                  <div className={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`${styles.starBtn} ${
                          (hoverRating || rating) >= star ? styles.starActive || styles.starBtnActive : ''
                        }`}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                      >
                        <Star size={28} fill={(hoverRating || rating) >= star ? '#f59e0b' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Selection */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Category</label>
                  <div className={styles.categoryGrid}>
                    {(['Bug', 'Feature', 'Experience', 'Other'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className={`${styles.categoryBtn} ${
                          category === cat ? styles.categoryBtnActive : ''
                        }`}
                        onClick={() => setCategory(cat)}
                      >
                        {cat === 'Bug' ? '🐞 Bug Report' : cat === 'Feature' ? '💡 Request' : cat === 'Experience' ? '✨ Experience' : '❓ Other'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comments Textarea */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Tell us more</label>
                  <textarea
                    className={styles.textarea}
                    placeholder="Describe your issue, suggestion, or positive thoughts..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    required
                  />
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={rating === 0 || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Feedback</span>
                  )}
                </button>
              </form>
            ) : (
              <div className={styles.successBody}>
                <div className={styles.successIconWrapper}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 className={styles.successTitle}>Thank You!</h3>
                <p className={styles.successText}>
                  Your feedback has been successfully submitted. We appreciate your support in making AtlasFind better!
                </p>
                <button className={styles.successCloseBtn} onClick={handleClose}>
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default FeedbackButton;
