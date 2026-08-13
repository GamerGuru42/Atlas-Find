'use client';
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Sparkles, Check, X } from 'lucide-react';
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
        </div>
        <span className={styles.countBadge}>{items.length}</span>
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

        {/* Regular Column Items */}
        {!column.isResult ? (
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
            {/* Accepted Sub Column */}
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

            {/* Rejected Sub Column */}
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
      <button className={styles.addCardBtn} onClick={() => onOpenAddModal(column.id)}>
        <Plus size={14} />
        <span>Add opportunity</span>
      </button>
    </div>
  );
};
