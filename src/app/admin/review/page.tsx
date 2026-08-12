'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

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
  continent: string | null;
}

export default function AdminReviewPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const [aiExtracting, setAiExtracting] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/review', {
        headers: { 'Authorization': `Bearer ${password}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOpportunities(data.opportunities || []);
        setIsAuthenticated(true);
      } else {
        alert('Invalid password');
      }
    } catch (err) {
      console.error(err);
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function fetchPending() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/review', {
        headers: { 'Authorization': `Bearer ${password}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOpportunities(data.opportunities || []);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id: string, action: 'approve' | 'reject') {
    try {
      const res = await fetch('/api/admin/review', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        setOpportunities(opportunities.filter(opp => opp.id !== id));
      } else {
        alert('Action failed');
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to completely delete this record?')) return;
    try {
      const res = await fetch(`/api/admin/review?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${password}` },
      });
      if (res.ok) {
        setOpportunities(opportunities.filter(opp => opp.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingOpp) return;
    try {
      const res = await fetch('/api/admin/review', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({
          id: editingOpp.id,
          action: 'update',
          data: {
            title: editingOpp.title,
            type: editingOpp.type,
            sponsor: editingOpp.sponsor,
            hostCountry: editingOpp.hostCountry,
            continent: editingOpp.continent,
            applyUrl: editingOpp.applyUrl,
            description: editingOpp.description,
            eligibility: editingOpp.eligibility,
            deadline: editingOpp.deadline ? new Date(editingOpp.deadline).toISOString() : null,
          },
        }),
      });

      if (res.ok) {
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
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}` 
        },
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
          continent: extracted.continent || editingOpp.continent,
        });
      } else {
        alert('AI extraction failed: ' + (await res.json()).error);
      }
    } catch (err) {
      console.error('AI Extraction failed', err);
      alert('AI extraction failed. See console.');
    } finally {
      setAiExtracting(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.loginCard}>
          <h1 className={styles.title}>Admin Access</h1>
          <p className={styles.subtitle}>Enter the admin password to review submissions.</p>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className={styles.input}
              placeholder="Password..."
            />
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Authenticating...' : 'Enter Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.title}>Review Submissions ({opportunities.length})</h1>
        <button onClick={fetchPending} className={styles.secondaryBtn} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title & URL</th>
              <th>Type / Location</th>
              <th>Submitter</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyState}>No pending submissions!</td>
              </tr>
            ) : opportunities.map(opp => (
              <tr key={opp.id}>
                <td>
                  <strong>{opp.title}</strong><br/>
                  <a href={opp.applyUrl} target="_blank" rel="noreferrer" style={{color: '#94a3b8', fontSize: '0.875rem'}}>
                    {new URL(opp.applyUrl).hostname}
                  </a>
                </td>
                <td>
                  {opp.type}<br/>
                  <span style={{color: '#94a3b8', fontSize: '0.875rem'}}>{opp.hostCountry} {opp.continent ? `(${opp.continent})` : ''}</span>
                </td>
                <td>{opp.submittedBy || 'Anonymous'}</td>
                <td>{new Date(opp.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={`${styles.actionBtn} ${styles.aiBtn}`} onClick={() => setEditingOpp(opp)}>
                      Edit / AI
                    </button>
                    <button className={`${styles.actionBtn} ${styles.approveBtn}`} onClick={() => handleAction(opp.id, 'approve')}>
                      Approve
                    </button>
                    <button className={`${styles.actionBtn} ${styles.rejectBtn}`} onClick={() => handleAction(opp.id, 'reject')}>
                      Reject
                    </button>
                    <button className={`${styles.actionBtn} ${styles.rejectBtn}`} onClick={() => handleDelete(opp.id)} title="Delete completely">
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
          <div className={styles.modal}>
            <h2>Edit Opportunity</h2>
            
            <div style={{ margin: '1rem 0' }}>
              <button 
                type="button" 
                onClick={() => handleAiExtract(editingOpp.applyUrl)}
                className={`${styles.actionBtn} ${styles.aiBtn}`}
                style={{ width: '100%', padding: '1rem' }}
                disabled={aiExtracting}
              >
                {aiExtracting ? 'Extracting...' : '✨ Auto-Fill Missing Fields with AI (Gemini)'}
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Title</label>
                  <input 
                    className={styles.input}
                    value={editingOpp.title} 
                    onChange={e => setEditingOpp({...editingOpp, title: e.target.value})}
                    required 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>URL</label>
                  <input 
                    className={styles.input}
                    value={editingOpp.applyUrl} 
                    onChange={e => setEditingOpp({...editingOpp, applyUrl: e.target.value})}
                    required 
                    type="url"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Type</label>
                  <select 
                    className={styles.input}
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
                <div className={styles.formGroup}>
                  <label>Sponsor</label>
                  <input 
                    className={styles.input}
                    value={editingOpp.sponsor || ''} 
                    onChange={e => setEditingOpp({...editingOpp, sponsor: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Host Country</label>
                  <input 
                    className={styles.input}
                    value={editingOpp.hostCountry || ''} 
                    onChange={e => setEditingOpp({...editingOpp, hostCountry: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Continent</label>
                  <input 
                    className={styles.input}
                    value={editingOpp.continent || ''} 
                    onChange={e => setEditingOpp({...editingOpp, continent: e.target.value})}
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Description</label>
                  <textarea 
                    className={styles.input}
                    value={editingOpp.description || ''} 
                    onChange={e => setEditingOpp({...editingOpp, description: e.target.value})}
                    rows={4}
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Eligibility</label>
                  <textarea 
                    className={styles.input}
                    value={editingOpp.eligibility || ''} 
                    onChange={e => setEditingOpp({...editingOpp, eligibility: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setEditingOpp(null)} className={styles.secondaryBtn}>
                  Cancel
                </button>
                <button type="submit" className={styles.button} style={{ width: 'auto' }}>
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
