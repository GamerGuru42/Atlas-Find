'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, ShieldAlert, LogIn, UserPlus, AlertTriangle } from 'lucide-react';
import styles from './Chat.module.css';

interface SaveProgressModalProps {
  onClose: () => void;
  onContinueAsGuest: () => void;
}

export function SaveProgressModal({ onClose, onContinueAsGuest }: SaveProgressModalProps) {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);

  const handleAction = (path: string) => {
    router.push(`${path}?returnUrl=/chat`);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalCloseBtn} onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        {!showWarning ? (
          <div className={styles.modalBody}>
            <div className={styles.modalIconWrapper}>
              <ShieldAlert size={28} className={styles.shieldIcon} />
            </div>
            <h3 className={styles.modalTitle}>Save Your Chat & Profile!</h3>
            <p className={styles.modalText}>
              We are compiling a customized matching profile for you based on this chat. 
              Sign up or log in to save your conversation history and opportunity matches permanently.
            </p>

            <div className={styles.modalActions}>
              <button 
                className={`${styles.modalBtn} ${styles.btnPrimary}`}
                onClick={() => handleAction('/signup')}
              >
                <UserPlus size={16} />
                <span>Create Free Account</span>
              </button>
              
              <button 
                className={`${styles.modalBtn} ${styles.btnSecondary}`}
                onClick={() => handleAction('/login')}
              >
                <LogIn size={16} />
                <span>Log In</span>
              </button>

              <button 
                className={styles.modalLinkBtn}
                onClick={() => setShowWarning(true)}
              >
                Continue as Guest
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.modalBody}>
            <div className={`${styles.modalIconWrapper} ${styles.warningIconWrapper}`}>
              <AlertTriangle size={28} className={styles.warningIcon} />
            </div>
            <h3 className={styles.modalTitle}>Temporary Session Warning</h3>
            <p className={styles.modalText}>
              If you continue as a guest, your profile metadata and chat history will **not** be saved. 
              Everything will be lost when you refresh or close this browser tab.
            </p>

            <div className={styles.modalActions}>
              <button 
                className={`${styles.modalBtn} ${styles.btnDanger}`}
                onClick={onContinueAsGuest}
              >
                Yes, Continue as Guest
              </button>

              <button 
                className={`${styles.modalBtn} ${styles.btnSecondary}`}
                onClick={() => setShowWarning(false)}
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
