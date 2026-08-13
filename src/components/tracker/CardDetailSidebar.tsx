'use client';
import React, { useState, useEffect } from 'react';
import { X, ExternalLink, CheckSquare, FileText, Activity, Clock, Bell, Archive, Trash2, Sparkles, Upload } from 'lucide-react';
import { TrackerItem } from './KanbanCard';
import styles from './Sidebar.module.css';

interface CardDetailSidebarProps {
  item: TrackerItem | null;
  onClose: () => void;
  onUpdateDetails: (updatedItem: TrackerItem) => void;
  onRemove: (savedOpportunityId: string) => void;
}

export const CardDetailSidebar: React.FC<CardDetailSidebarProps> = ({
  item,
  onClose,
  onUpdateDetails,
  onRemove,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'documents' | 'notes' | 'activity'>('details');
  const [notesText, setNotesText] = useState('');
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [checklist, setChecklist] = useState<Array<{ id: string; label: string; completed: boolean }>>([
    { id: '1', label: 'Academic Transcript', completed: true },
    { id: '2', label: 'CV / Resume', completed: true },
    { id: '3', label: 'Reference Letters (2)', completed: false },
    { id: '4', label: 'Personal Statement', completed: false },
    { id: '5', label: 'Proof of Citizenship / Passport', completed: false },
    { id: '6', label: 'English Test Scores (IELTS / TOEFL)', completed: false },
  ]);

  useEffect(() => {
    if (item) {
      setNotesText(item.notes || '');
      if (item.checklistProgress?.items) {
        setChecklist(item.checklistProgress.items);
      }
    }
  }, [item]);

  // Auto-save notes every 5 seconds
  useEffect(() => {
    if (!item) return;
    const timer = setTimeout(async () => {
      if (notesText !== (item.notes || '')) {
        setSaveStatus('Saving...');
        try {
          await fetch('/api/tracker/update-details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ savedOpportunityId: item.id, notes: notesText }),
          });
          setSaveStatus('Last saved just now');
        } catch {
          setSaveStatus('Failed to save notes');
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [notesText, item]);

  if (!item) return null;

  const opp = item.opportunity;
  const completedCount = checklist.filter((c) => c.completed).length;
  const totalCount = checklist.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  const toggleChecklistItem = async (id: string) => {
    const updated = checklist.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c));
    setChecklist(updated);

    try {
      await fetch('/api/tracker/update-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          savedOpportunityId: item.id,
          checklistProgress: { items: updated, completed: updated.filter((c) => c.completed).length, total: updated.length },
        }),
      });
      onUpdateDetails({
        ...item,
        checklistProgress: { items: updated, completed: updated.filter((c) => c.completed).length, total: updated.length },
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.sidebarOverlay} onClick={onClose}>
      <div className={styles.sidebar} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
          
          <div className={styles.headerTop}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
              {opp.sponsor}
            </span>
          </div>

          <h2 className={styles.title}>{opp.title}</h2>

          <div className={styles.headerBadges}>
            <a
              href={opp.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.openAppBtn}
            >
              <span>Open Official Portal</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabNav}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'details' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'documents' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            Documents ({completedCount}/{totalCount})
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'notes' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            Notes
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'activity' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            Activity
          </button>
        </div>

        {/* Tab Body */}
        <div className={styles.contentBody}>
          {activeTab === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Overview & Description
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                  {opp.description || 'No detailed description available.'}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Eligibility & Criteria
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                  {opp.eligibility || 'Open to eligible international applicants.'}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Host Country & Location
                </h4>
                <span style={{ fontSize: '0.85rem', background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', color: '#334155', fontWeight: 600 }}>
                  🌍 {opp.hostCountry}
                </span>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className={styles.docChecklist}>
              {/* Progress bar */}
              <div className={styles.progressBarContainer}>
                <div className={styles.progressBarHeader}>
                  <span>Checklist Progress</span>
                  <span>{progressPct}% ({completedCount}/{totalCount})</span>
                </div>
                <div className={styles.progressBarTrack}>
                  <div className={styles.progressBarFill} style={{ width: `${progressPct}%` }} />
                </div>
              </div>

              {/* Items */}
              {checklist.map((item) => (
                <div key={item.id} className={styles.checkItem}>
                  <label className={styles.checkLabel}>
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleChecklistItem(item.id)}
                      style={{ accentColor: '#2563eb', width: '16px', height: '16px' }}
                    />
                    <span className={item.completed ? styles.checkCompleted : ''}>{item.label}</span>
                  </label>
                  <button className={styles.uploadBtn}>
                    <Upload size={11} style={{ marginRight: '3px' }} />
                    Upload
                  </button>
                </div>
              ))}

              {/* AI Suggestion Box */}
              <div className={styles.aiSuggestionBox}>
                <Sparkles size={16} style={{ color: '#0284c7', flexShrink: 0 }} />
                <div>
                  <strong>Atlas AI Advisor Suggestion (Pro+):</strong>
                  <p style={{ margin: '4px 0 0 0', lineHeight: 1.4 }}>
                    Based on {opp.sponsor}'s strict evaluation guidelines, make sure your Personal Statement explicitly highlights your post-graduation career goals.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div>
              <textarea
                className={styles.notesArea}
                placeholder="Write your research notes, essay outlines, contact info, or interview prep questions here..."
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
              />
              <div className={styles.saveStatus}>
                <Clock size={12} />
                <span>{saveStatus || 'Auto-saves as you type'}</span>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className={styles.activityTimeline}>
              {item.activities && item.activities.length > 0 ? (
                item.activities.map((act, idx) => (
                  <div key={idx} className={styles.activityItem}>
                    <div className={styles.activityDot} />
                    <div className={styles.activityText}>
                      {act.action === 'added' ? 'Added opportunity to tracker' : `Moved to ${act.toStatus}`}
                    </div>
                    <div className={styles.activityTime}>
                      {new Date(act.createdAt).toLocaleDateString()} at {new Date(act.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.activityItem}>
                  <div className={styles.activityDot} />
                  <div className={styles.activityText}>Added to tracker board</div>
                  <div className={styles.activityTime}>Recently</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.footerBtn} onClick={() => alert('Reminder set for 7 days before deadline!')}>
            <Bell size={14} />
            <span>Set Reminder</span>
          </button>
          <button
            className={`${styles.footerBtn} ${styles.footerBtnDanger}`}
            onClick={() => {
              if (confirm('Are you sure you want to remove this opportunity from your tracker?')) {
                onRemove(item.id);
                onClose();
              }
            }}
          >
            <Trash2 size={14} />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
};
