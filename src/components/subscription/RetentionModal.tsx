"use client";

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import styles from './Subscription.module.css';

export function RetentionModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState(1);
  
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {step === 1 ? (
          <>
            <h3 className={styles.modalTitle}>We're sorry to see you go!</h3>
            <p className={styles.modalText}>
              Before you cancel, why not take a break? You can pause your subscription for 1 month or get 50% off your next 3 months.
            </p>
            <div className={styles.modalActions}>
              <Button variant="primary" onClick={onClose}>Keep My Plan</Button>
              <button onClick={() => {
                alert("Subscription Paused! (Mock)");
                onClose();
              }} className={styles.btnSecondary} style={{ padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
                Pause Instead
              </button>
              <button 
                className={`${styles.btnSecondary} ${styles.btnDanger}`} 
                onClick={() => setStep(2)}
                style={{ padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
              >
                Cancel Anyway
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className={styles.modalTitle}>Cancel Subscription</h3>
            <p className={styles.modalText}>
              Are you sure? Your Pro features and unlimited access will continue until <strong>Oct 14, 2026</strong>.
            </p>
            <div className={styles.modalActions}>
              <Button variant="primary" onClick={onClose}>Keep My Plan</Button>
              <button 
                className={`${styles.btnSecondary} ${styles.btnDanger}`}
                onClick={() => {
                  alert("Subscription canceled. Access continues until Oct 14, 2026.");
                  onClose();
                  setStep(1);
                }}
                style={{ padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
              >
                Confirm Cancellation
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
