'use client';
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Sparkles, Check, X, Lock } from 'lucide-react';
import { KanbanCard, TrackerItem } from './KanbanCard';
import styles from './Kanban.module.css';

export interface ColumnConfig {
  id: string;
  name: string;
  color: string;
  isResult?: boolean;
}

interface KanbanColumnProps {
  column: ColumnConfig;
  items: TrackerItem[];
  userTier: string;
  showInlineUpsell: boolean;
  onOpenAddModal: (status: string) => void;
  onSelectCard: (item: TrackerItem) => void;
  onDeleteCard: (id: string) => void;
  onEditNotes: (item: TrackerItem) => void;
  onUpgradeClick: () => void;
  onDismissUpsell: () => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  items,
  userTier,
  showInlineUpsell,
  onOpenAddModal,
  onSelectCard,
  onDeleteCard,
  onEditNotes,
  onUpgradeClick,
  onDismissUpsell,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const isFree = userTier === 'free';
  const isLockedColumn = isFree && column.id !== 'saved';

  // Handle Result column split sub-items
  const acceptedItems = items.filter((i) => i.status === 'accepted');
  const rejectedItems = items.filter((i) => i.status === 'rejected');
  const normalItems = column.isResult ? [] : items;

  return (
    <div
      ref={setNodeRef}
      className={`${styles.column} ${isOver ? styles.columnHighlight : ''}`}
    >
      {/* Column Header */}
      <div className={styles.columnHeader}>
        <div className={styles.columnTitle}>
          <span className={styles.colorBar} style={{ backgroundColor: column.color }} />
          <span>{column.name}</span>
          {isLockedColumn && <Lock size={13} style={{ color: '#eab308', marginLeft: '4px' }} />}
        </div>
        <span className={styles.countBadge}>{isLockedColumn ? 'Pro' : items.length}</span>
      </div>

      {/* Column Body */}
      <div className={styles.columnBody}>
        {/* Inline Upsell Banner for Free Tier limit teaser */}
        {showInlineUpsell && (
          <div className={styles.inlineUpsell}>
            <div className={styles.inlineUpsellTitle}>
              <Sparkles size={14} />
              <span>Unlock Unlimited Tracking</span>
            </div>
            <p className={styles.inlineUpsellText}>
              Track unlimited applications, auto-save document checklists, and receive deadline SMS alerts with Atlas Pro.
            </p>
            <div className={styles.inlineUpsellBtns}>
              <button className={styles.upsellBtnPro} onClick={onUpgradeClick}>
                See Pro Plans ⭐
              </button>
              <button className={styles.upsellBtnDismiss} onClick={onDismissUpsell}>
                Later
              </button>
            </div>
          </div>
        )}

        {/* Free Tier Teaser Card for non-Saved columns */}
        {isLockedColumn ? (
          <div 
            className={styles.lockedTeaserCard}
            onClick={onUpgradeClick}
            style={{
              padding: '16px',
              borderRadius: '10px',
              border: '1.5px dashed #e2e8f0',
              backgroundColor: '#f8fafc',
              textAlign: 'center',
              cursor: 'pointer',
              marginTop: '8px'
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#854d0e', backgroundColor: '#fef9c3', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', marginBottom: '8px' }}>
              <Sparkles size={12} />
              <span>Pro Feature</span>
            </div>
            <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
              Unlock {column.name} Stage
            </h4>
            <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4', marginBottom: '10px' }}>
              Drag & drop applications, set stage milestones, and track progress visual pipeline.
            </p>
            <button 
              style={{
                width: '100%',
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Upgrade to Pro ⭐
            </button>
          </div>
        ) : !column.isResult ? (
          /* Regular Column Items for Saved / Unlocked */
          <SortableContext items={normalItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            {normalItems.length === 0 && !showInlineUpsell ? (
              <div className={styles.placeholderCard}>
                Your next opportunity goes here
              </div>
            ) : (
              normalItems.map((item) => (
                <KanbanCard
                  key={item.id}
                  item={item}
                  onSelect={onSelectCard}
                  onDelete={onDeleteCard}
                  onEditNotes={onEditNotes}
                />
              ))
            )}
          </SortableContext>
        ) : (
          /* Result Split Sub-Columns */
          <div className={styles.resultSubColumns}>
            <div className={styles.subColumn}>
              <div className={`${styles.subHeader} ${styles.subAccepted}`}>
                <span>Accepted</span>
                <Check size={14} />
              </div>
              <SortableContext items={acceptedItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                {acceptedItems.map((item) => (
                  <KanbanCard
                    key={item.id}
                    item={item}
                    onSelect={onSelectCard}
                    onDelete={onDeleteCard}
                    onEditNotes={onEditNotes}
                  />
                ))}
              </SortableContext>
            </div>

            <div className={styles.subColumn}>
              <div className={`${styles.subHeader} ${styles.subRejected}`}>
                <span>Rejected</span>
                <X size={14} />
              </div>
              <SortableContext items={rejectedItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                {rejectedItems.map((item) => (
                  <KanbanCard
                    key={item.id}
                    item={item}
                    onSelect={onSelectCard}
                    onDelete={onDeleteCard}
                    onEditNotes={onEditNotes}
                  />
                ))}
              </SortableContext>
            </div>
          </div>
        )}
      </div>

      {/* Add Opportunity Button */}
      {!isLockedColumn && (
        <button className={styles.addCardBtn} onClick={() => onOpenAddModal(column.id)}>
          <Plus size={14} />
          <span>Add opportunity</span>
        </button>
      )}
    </div>
  );
};
