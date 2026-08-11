'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import styles from './page.module.css';

// Simple interface matching Prisma Opportunity for the client
interface Opportunity {
  id: string;
  title: string;
  applyUrl: string;
  type: string;
  hostCountry: string;
  deadline: string;
  sponsor: string;
  submittedBy: string;
  description: string;
  eligibility: string;
  createdAt: string;
}

export default function AdminReviewPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [fetching, setFetching] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const [aiExtracting, setAiExtracting] = useState(false);

  // Initialize Supabase client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.email) {
        // Simple admin check: In a real app, use roles in DB. 
        // Here we just allow specific emails or a generic pass for demo purposes.
        const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'admin@atlasfind.com').split(',');
        if (adminEmails.includes(session.user.email)) {
          setIsAdmin(true);
          fetchPending();
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    }
    
    checkAuth();
  }, [supabase.auth]);

  async function fetchPending() {
    setFetching(true);
    try {
      const res = await fetch('/api/admin/opportunities');
      if (res.ok) {
        const data = await res.json();
        setOpportunities(data.opportunities || []);
      }
    } catch (err) {
      console.error('Failed to fetch pending opportunities', err);
    } finally {
      setFetching(false);
    }
  }

  async function handleAction(id: string, action: 'approve' | 'reject') {
    try {
      const res = await fetch('/api/admin/opportunities', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        setOpportunities(opportunities.filter(opp => opp.id !== id));
      }
    } catch (err) {
      console.error(`Failed to ${action} opportunity`, err);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to completely delete this record?')) return;
    
    try {
      const res = await fetch(`/api/admin/opportunities?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setOpportunities(opportunities.filter(opp => opp.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete opportunity', err);
    }
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingOpp) return;

    try {
      const res = await fetch('/api/admin/opportunities', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingOpp.id,
          action: 'edit',
          data: {
            title: editingOpp.title,
            type: editingOpp.type,
            sponsor: editingOpp.sponsor,
            hostCountry: editingOpp.hostCountry,
            applyUrl: editingOpp.applyUrl,
            description: editingOpp.description,
            eligibility: editingOpp.eligibility,
            // Simple date handling for demo
            deadline: editingOpp.deadline ? new Date(editingOpp.deadline).toISOString() : null,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOpportunities(opportunities.map(o => o.id === editingOpp.id ? { ...o, ...editingOpp } : o));
        setEditingOpp(null);
      }
    } catch (err) {
      console.error('Failed to save edits', err);
    }
  }

  async function handleAiExtract(url: string) {
    if (!editingOpp) return;
    setAiExtracting(true);
    
    try {
      const res = await fetch('/api/admin/ai-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      
      if (res.ok) {
        const data = await res.json();
        const extracted = data.extracted || {};
        
        setEditingOpp({
          ...editingOpp,
          title: extracted.title || editingOpp.title,
          sponsor: extracted.sponsor || editingOpp.sponsor,
          description: extracted.description || editingOpp.description,
          eligibility: extracted.eligibility || editingOpp.eligibility,
          hostCountry: extracted.hostCountry || editingOpp.hostCountry,
        });
      }
    } catch (err) {
      console.error('AI Extraction failed', err);
      alert('AI extraction failed. See console.');
    } finally {
      setAiExtracting(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.adminContainer} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className={styles.authGate}>
        <div className={styles.authCard}>
          <span className={styles.authIcon}>🔒</span>
          <h1 className={styles.authTitle}>Access Denied</h1>
          <p className={styles.authSubtitle}>You do not have administrator privileges to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.headerIcon}>🛡️</span>
          <h1 className={styles.title}>Admin Review</h1>
          <span className={styles.badge}>{opportunities.length} Pending</span>
        </div>
        <button onClick={fetchPending} className={styles.refreshButton} disabled={fetching}>
          {fetching ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title / URL</th>
              <th>Type</th>
              <th>Country</th>
              <th>Submitter</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.length === 0 && !fetching && (
              <tr>
                <td colSpan={6}>
                  <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>✨</span>
                    <h3 className={styles.emptyTitle}>All caught up!</h3>
                    <p className={styles.emptySubtitle}>There are no pending submissions to review.</p>
                  </div>
                </td>
              </tr>
            )}
            
            {opportunities.map(opp => (
              <tr key={opp.id}>
                <td>
                  <div className={styles.titleCell}>{opp.title}</div>
                  <div className={styles.urlCell}>
                    <a href={opp.applyUrl} target="_blank" rel="noreferrer" className={styles.urlLink}>
                      {new URL(opp.applyUrl).hostname}
                    </a>
                  </div>
                </td>
                <td><span className={styles.typeBadge}>{opp.type}</span></td>
                <td>{opp.hostCountry}</td>
                <td>{opp.submittedBy || 'Anonymous'}</td>
                <td>{new Date(opp.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={`${styles.actionBtn} ${styles.aiBtn}`} onClick={() => setEditingOpp(opp)}>
                      Edit / AI Fill
                    </button>
                    <button className={`${styles.actionBtn} ${styles.approveBtn}`} onClick={() => handleAction(opp.id, 'approve')}>
                      Approve
                    </button>
                    <button className={`${styles.actionBtn} ${styles.rejectBtn}`} onClick={() => handleAction(opp.id, 'reject')}>
                      Reject
                    </button>
                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(opp.id)}>
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingOpp && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <h2 className={styles.modalTitle}>Edit Opportunity</h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <button 
                type="button" 
                onClick={() => handleAiExtract(editingOpp.applyUrl)}
                className={`${styles.actionBtn} ${styles.aiBtn}`}
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem' }}
                disabled={aiExtracting}
              >
                {aiExtracting ? 'Extracting via AI...' : '✨ Auto-Fill Missing Fields with AI (Gemini)'}
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className={styles.modalForm}>
              <div className={styles.modalFieldGroup}>
                <label className={styles.modalLabel}>Title</label>
                <input 
                  className={styles.modalInput}
                  value={editingOpp.title} 
                  onChange={e => setEditingOpp({...editingOpp, title: e.target.value})}
                  required 
                />
              </div>

              <div className={styles.modalFieldGroup}>
                <label className={styles.modalLabel}>URL</label>
                <input 
                  className={styles.modalInput}
                  value={editingOpp.applyUrl} 
                  onChange={e => setEditingOpp({...editingOpp, applyUrl: e.target.value})}
                  required 
                  type="url"
                />
              </div>

              <div className={styles.modalRow}>
                <div className={styles.modalFieldGroup}>
                  <label className={styles.modalLabel}>Type</label>
                  <select 
                    className={styles.modalSelect}
                    value={editingOpp.type} 
                    onChange={e => setEditingOpp({...editingOpp, type: e.target.value})}
                  >
                    <option value="SCHOLARSHIP">SCHOLARSHIP</option>
                    <option value="FELLOWSHIP">FELLOWSHIP</option>
                    <option value="GRANT">GRANT</option>
                    <option value="INTERNSHIP">INTERNSHIP</option>
                    <option value="RESEARCH_POSITION">RESEARCH_POSITION</option>
                    <option value="EXCHANGE">EXCHANGE</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>
                <div className={styles.modalFieldGroup}>
                  <label className={styles.modalLabel}>Host Country</label>
                  <input 
                    className={styles.modalInput}
                    value={editingOpp.hostCountry} 
                    onChange={e => setEditingOpp({...editingOpp, hostCountry: e.target.value})}
                  />
                </div>
              </div>

              <div className={styles.modalFieldGroup}>
                <label className={styles.modalLabel}>Sponsor</label>
                <input 
                  className={styles.modalInput}
                  value={editingOpp.sponsor} 
                  onChange={e => setEditingOpp({...editingOpp, sponsor: e.target.value})}
                />
              </div>

              <div className={styles.modalFieldGroup}>
                <label className={styles.modalLabel}>Description</label>
                <textarea 
                  className={styles.modalTextarea}
                  value={editingOpp.description} 
                  onChange={e => setEditingOpp({...editingOpp, description: e.target.value})}
                  rows={4}
                />
              </div>

              <div className={styles.modalFieldGroup}>
                <label className={styles.modalLabel}>Eligibility</label>
                <textarea 
                  className={styles.modalTextarea}
                  value={editingOpp.eligibility} 
                  onChange={e => setEditingOpp({...editingOpp, eligibility: e.target.value})}
                  rows={3}
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setEditingOpp(null)} className={styles.modalCancel}>
                  Cancel
                </button>
                <button type="submit" className={styles.modalSave}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
