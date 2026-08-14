'use client';
import React, { useState, useEffect } from 'react';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { Plus, Sparkles, LayoutGrid } from 'lucide-react';
import { KanbanColumn, ColumnConfig } from './KanbanColumn';
import { TrackerItem } from './KanbanCard';
import { CardDetailSidebar } from './CardDetailSidebar';
import { AddToTrackerModal } from './AddToTrackerModal';
import styles from './Kanban.module.css';

const COLUMNS: ColumnConfig[] = [
  { id: 'saved', name: 'Saved', color: '#9ca3af' },
  { id: 'researching', name: 'Researching', color: '#3b82f6' },
  { id: 'applying', name: 'Applying', color: '#eab308' },
  { id: 'submitted', name: 'Submitted', color: '#22c55e' },
  { id: 'interview', name: 'Interview', color: '#a855f7' },
  { id: 'result', name: 'Result', color: '#10b981', isResult: true },
];

export const KanbanBoard: React.FC = () => {
  const [items, setItems] = useState<TrackerItem[]>([]);
  const [userTier, setUserTier] = useState<string>('free');
  const [selectedCard, setSelectedCard] = useState<TrackerItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalStatus, setAddModalStatus] = useState('saved');
  const [activeMobileTab, setActiveMobileTab] = useState('saved');
  const [inlineUpsellColumn, setInlineUpsellColumn] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 8 } })
  );

  const [showCelebrationBanner, setShowCelebrationBanner] = useState(false);

  useEffect(() => {
    // Check URL search params for ?upgraded=true
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('upgraded') === 'true') {
        setShowCelebrationBanner(true);
      }
      
      // Cookie fail-safe check
      const match = document.cookie.match(/(?:^|; )atlas_user_tier=([^;]*)/);
      if (match && (match[1] === 'pro' || match[1] === 'elite')) {
        setUserTier(match[1]);
      }
    }
    fetchTrackerData();
  }, []);

  const fetchTrackerData = async () => {
    try {
      const res = await fetch('/api/tracker?t=' + Date.now());
      const data = await res.json();
      if (data.trackedItems) {
        setItems(data.trackedItems);
        // Only set userTier from API if not already overridden by cookie
        if (data.userTier) {
          setUserTier(data.userTier);
        }
      }
    } catch (e) {
      console.error('Error loading tracker items:', e);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (userTier === 'free') {
      // Free users cannot move cards across columns — prompt upgrade
      setInlineUpsellColumn('saved');
      setTimeout(() => setInlineUpsellColumn(null), 10000);
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    let targetColumn = overId;
    const overItem = items.find((i) => i.id === overId);
    if (overItem) {
      targetColumn = overItem.status;
    }

    const currentItem = items.find((i) => i.id === activeId);
    if (!currentItem || currentItem.status === targetColumn) return;

    const originalStatus = currentItem.status;

    setItems((prev) =>
      prev.map((item) => (item.id === activeId ? { ...item, status: targetColumn } : item))
    );

    try {
      const res = await fetch('/api/tracker/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          savedOpportunityId: activeId,
          fromColumn: originalStatus,
          toColumn: targetColumn,
        }),
      });

      if (!res.ok) {
        throw new Error('API move failed');
      }
    } catch (err) {
      setItems((prev) =>
        prev.map((item) => (item.id === activeId ? { ...item, status: originalStatus } : item))
      );
      alert('Failed to update card status. Snapping back to original column.');
    }
  };

  const handleOpenAddModal = (status: string) => {
    if (userTier === 'free' && items.length >= 20) {
      setInlineUpsellColumn(status);
      setTimeout(() => setInlineUpsellColumn(null), 10000);
      return;
    }
    setAddModalStatus(status);
    setIsAddModalOpen(true);
  };

  const handleCardAdded = (newItem: any) => {
    setItems((prev) => [newItem, ...prev]);
  };

  const handleCardDeleted = async (id: string) => {
    if (typeof window !== 'undefined' && !window.confirm('Remove from tracker? This won\'t delete the opportunity from AtlasFind.')) {
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await fetch('/api/tracker/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ savedOpportunityId: id }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.trackerContainer}>
      {showCelebrationBanner && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(168,85,247,0.2))',
          border: '1px solid rgba(168,85,247,0.4)',
          borderRadius: '12px',
          padding: '1rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Sparkles size={24} style={{ color: '#fbbf24' }} />
            <div>
              <strong style={{ fontSize: '1.05rem' }}>🎉 Congratulations! Your Atlas Pro Membership is Active!</strong>
              <p style={{ color: '#cbd5e1', fontSize: '0.875rem', margin: 0 }}>
                All 6 application tracking stages are unlocked with unlimited saves.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowCelebrationBanner(false)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className={styles.trackerHeader}>
        <div className={styles.titleArea}>
          <h1>
            <LayoutGrid size={22} style={{ color: '#2563eb' }} />
            Application Tracker
          </h1>
          <p>Organize, track, and win your scholarships, internships, and opportunities.</p>
        </div>

        <div className={styles.headerActions}>
          <span className={`${styles.tierBadge} ${userTier === 'elite' ? styles.tierElite : userTier === 'pro' ? styles.tierPro : styles.tierFree}`}>
            {userTier === 'elite' ? '👑 Elite' : userTier === 'pro' ? '⭐ Pro' : `🎓 Free Tier (${items.length}/20 Saved)`}
          </span>
          <button className={styles.addButton} onClick={() => handleOpenAddModal('saved')}>
            <Plus size={16} />
            <span>Add Opportunity</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Nav */}
      <div className={styles.mobileTabNav}>
        {COLUMNS.map((col) => (
          <button
            key={col.id}
            className={`${styles.mobileTab} ${activeMobileTab === col.id ? styles.mobileTabActive : ''}`}
            onClick={() => setActiveMobileTab(col.id)}
          >
            {col.name} ({items.filter((i) => i.status === col.id || (col.isResult && ['accepted', 'rejected'].includes(i.status))).length})
          </button>
        ))}
      </div>

      {/* DndContext & Board */}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className={styles.board}>
          {COLUMNS.map((col) => {
            const columnItems = items.filter((item) => {
              if (col.isResult) {
                return item.status === 'accepted' || item.status === 'rejected';
              }
              return item.status === col.id;
            });

            return (
              <KanbanColumn
                key={col.id}
                column={col}
                items={columnItems}
                userTier={userTier}
                showInlineUpsell={inlineUpsellColumn === col.id}
                onOpenAddModal={handleOpenAddModal}
                onSelectCard={(item) => setSelectedCard(item)}
                onDeleteCard={handleCardDeleted}
                onEditNotes={(item) => setSelectedCard(item)}
                onUpgradeClick={() => window.location.href = '/pricing'}
                onDismissUpsell={() => setInlineUpsellColumn(null)}
              />
            );
          })}
        </div>
      </DndContext>

      {/* Card Detail Sidebar */}
      <CardDetailSidebar
        item={selectedCard}
        onClose={() => setSelectedCard(null)}
        onUpdateDetails={(updated) => {
          setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
        }}
        onRemove={handleCardDeleted}
      />

      {/* Add Opportunity Modal */}
      <AddToTrackerModal
        isOpen={isAddModalOpen}
        initialStatus={addModalStatus}
        onClose={() => setIsAddModalOpen(false)}
        onAdded={handleCardAdded}
        onLimitReached={() => {
          setInlineUpsellColumn(addModalStatus);
          setTimeout(() => setInlineUpsellColumn(null), 10000);
        }}
      />
    </div>
  );
};
