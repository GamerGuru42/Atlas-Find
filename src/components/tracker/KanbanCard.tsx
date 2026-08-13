'use client';
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, Edit3, Trash2, Clock, CheckSquare } from 'lucide-react';
import styles from './Kanban.module.css';

export interface TrackerItem {
  id: string; // SavedOpportunity ID
  opportunityId: string;
  status: string;
  notes?: string | null;
  checklistProgress?: any;
  documents?: any;
  opportunity: {
    id: string;
    title: string;
    sponsor: string;
    type: string;
    hostCountry: string;
    deadline?: string | Date | null;
    trustTier?: number;
    applyUrl: string;
    description?: string;
    eligibility?: string;
  };
  activities?: any[];
}

interface KanbanCardProps {
  item: TrackerItem;
  onSelect: (item: TrackerItem) => void;
  onDelete: (id: string) => void;
  onEditNotes: (item: TrackerItem) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ item, onSelect, onDelete, onEditNotes }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const opp = item.opportunity;

  // Calculate deadline days
  const getDeadlineInfo = () => {
    if (!opp.deadline) return { text: 'No deadline', colorClass: styles.dlGray };
    const diffDays = Math.ceil((new Date(opp.deadline).getTime() - Date.now()) / (1000 * 3600 * 24));
    if (diffDays < 0) return { text: 'Passed', colorClass: styles.dlGray };
    if (diffDays <= 7) return { text: `⏰ ${diffDays} days`, colorClass: styles.dlRed };
    if (diffDays <= 30) return { text: `⏰ ${diffDays} days`, colorClass: styles.dlYellow };
    return { text: `⏰ ${diffDays} days`, colorClass: styles.dlGreen };
  };

  const dlInfo = getDeadlineInfo();

  // Mock / calculated Atlas score (85-98 for high trust tier)
  const atlasScore = opp.trustTier === 1 ? 95 : opp.trustTier === 2 ? 88 : 78;
  const scoreClass = atlasScore >= 90 ? styles.scoreHigh : atlasScore >= 70 ? styles.scoreMid : styles.scoreLow;

  // Checklist count
  const checklistData = item.checklistProgress || { completed: 2, total: 5 };
  const completedCount = checklistData.completed || 0;
  const totalCount = checklistData.total || 5;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.card} ${isDragging ? styles.cardDragging : ''}`}
      onClick={() => onSelect(item)}
    >
      {/* Top row: logo, org, drag handle */}
      <div className={styles.cardTop}>
        <div className={styles.orgInfo}>
          <div className={styles.logo}>
            {opp.sponsor ? opp.sponsor.charAt(0).toUpperCase() : 'O'}
          </div>
          <span className={styles.orgName}>{opp.sponsor || 'Organization'}</span>
        </div>
        <div className={styles.dragHandle} {...attributes} {...listeners} onClick={(e) => e.stopPropagation()}>
          <GripVertical size={16} />
        </div>
      </div>

      {/* Title */}
      <h4 className={styles.cardTitle}>{opp.title}</h4>

      {/* Badges row */}
      <div className={styles.badgeRow}>
        <span className={styles.pill}>{opp.type}</span>
        <span className={`${styles.scoreBadge} ${scoreClass}`}>{atlasScore} Score</span>
      </div>

      {/* Footer info: deadline & checklist */}
      <div className={styles.cardFooter}>
        <span className={`${styles.deadline} ${dlInfo.colorClass}`}>
          <Clock size={12} />
          {dlInfo.text}
        </span>

        <div className={styles.checklist}>
          <CheckSquare size={12} />
          <span>{completedCount}/{totalCount}</span>
          <div className={styles.miniProgressBar}>
            <div className={styles.miniProgressFill} style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      {/* Hover action buttons */}
      <div className={styles.hoverActions}>
        <button
          className={styles.actionIconBtn}
          title="View Details"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item);
          }}
        >
          <Eye size={13} />
        </button>
        <button
          className={styles.actionIconBtn}
          title="Edit Notes"
          onClick={(e) => {
            e.stopPropagation();
            onEditNotes(item);
          }}
        >
          <Edit3 size={13} />
        </button>
        <button
          className={styles.actionIconBtn}
          title="Delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
};
