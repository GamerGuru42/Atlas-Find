"use client";

import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import styles from './PartnerInquiryModal.module.css';

interface PartnerInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: string;
}

export function PartnerInquiryModal({ isOpen, onClose, initialType = 'University' }: PartnerInquiryModalProps) {
  const [formData, setFormData] = useState({
    orgName: '',
    contactEmail: '',
    orgType: initialType,
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Partner Inquiry Submitted:', formData);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({ orgName: '', contactEmail: '', orgType: 'University', message: '' });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleReset}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={handleReset} aria-label="Close modal">
          <X size={20} />
        </button>

        {submitted ? (
          <div className={styles.successState}>
            <CheckCircle2 size={48} className={styles.successIcon} />
            <h3 className={styles.successTitle}>Thank you! We'll be in touch.</h3>
            <p className={styles.successDesc}>
              We have received your partner inquiry and will get back to your team shortly.
            </p>
            <button className={styles.submitBtn} onClick={handleReset}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <h3 className={styles.modalTitle}>Partner with AtlasFind</h3>
            <p className={styles.modalSub}>
              Tell us about your organization and how you'd like to collaborate.
            </p>

            <div className={styles.field}>
              <label className={styles.label}>Organization Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Stanford University, Gates Foundation"
                className={styles.input}
                value={formData.orgName}
                onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Contact Email</label>
              <input
                type="email"
                required
                placeholder="partnerships@organization.org"
                className={styles.input}
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Organization Type</label>
              <select
                className={styles.input}
                value={formData.orgType}
                onChange={(e) => setFormData({ ...formData, orgType: e.target.value })}
              >
                <option value="University">University</option>
                <option value="Foundation">Foundation</option>
                <option value="Corporate">Corporate Sponsor</option>
                <option value="NGO">NGO / Non-profit</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Message</label>
              <textarea
                rows={4}
                required
                placeholder="How would you like to partner with AtlasFind?"
                className={styles.textarea}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Submit Inquiry
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
