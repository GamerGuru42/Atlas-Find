'use client';
import React, { useState, useEffect } from 'react';
import { X, Search, Plus, Check } from 'lucide-react';
import styles from './Modal.module.css';

interface AddToTrackerModalProps {
  isOpen: boolean;
  initialStatus?: string;
  onClose: () => void;
  onAdded: (newItem: any) => void;
  onLimitReached: () => void;
}

export const AddToTrackerModal: React.FC<AddToTrackerModalProps> = ({
  isOpen,
  initialStatus = 'saved',
  onClose,
  onAdded,
  onLimitReached,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<any | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchOpportunities();
    }
  }, [isOpen]);

  const fetchOpportunities = async () => {
    try {
      const res = await fetch('/api/discover?limit=30');
      const data = await res.json();
      if (data.opportunities) {
        setOpportunities(data.opportunities);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  const filtered = opportunities.filter((o) =>
    o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.sponsor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = async () => {
    if (!selectedOpp) return;
    setLoading(true);

    try {
      const res = await fetch('/api/tracker/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunityId: selectedOpp.id,
          status: selectedStatus,
        }),
      });

      const data = await res.json();

      if (res.status === 403 && data.error === 'limit_reached') {
        onClose();
        onLimitReached();
        return;
      }

      if (data.success) {
        onAdded(data.savedRecord);
        onClose();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const stages = [
    { id: 'saved', label: 'Saved' },
    { id: 'researching', label: 'Researching' },
    { id: 'applying', label: 'Applying' },
    { id: 'submitted', label: 'Submitted' },
    { id: 'interview', label: 'Interview' },
    { id: 'accepted', label: 'Accepted ✓' },
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Add Opportunity to Tracker</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search opportunities by title or organization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className={styles.oppList}>
            {filtered.slice(0, 10).map((opp) => (
              <div
                key={opp.id}
                className={`${styles.oppItem} ${selectedOpp?.id === opp.id ? styles.oppSelected : ''}`}
                onClick={() => setSelectedOpp(opp)}
              >
                <div>
                  <div className={styles.oppTitle}>{opp.title}</div>
                  <div className={styles.oppSponsor}>{opp.sponsor} • {opp.hostCountry}</div>
                </div>
                {selectedOpp?.id === opp.id && <Check size={18} style={{ color: '#2563eb' }} />}
              </div>
            ))}
          </div>

          <div className={styles.stageSelection}>
            <div className={styles.stageLabel}>Select Application Stage:</div>
            <div className={styles.stageGrid}>
              {stages.map((stage) => (
                <div
                  key={stage.id}
                  className={`${styles.stageRadio} ${selectedStatus === stage.id ? styles.stageRadioSelected : ''}`}
                  onClick={() => setSelectedStatus(stage.id)}
                >
                  {stage.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.submitBtn}
            disabled={!selectedOpp || loading}
            onClick={handleAdd}
          >
            {loading ? 'Adding...' : 'Add to Tracker'}
          </button>
        </div>
      </div>
    </div>
  );
};
