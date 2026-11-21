"use client";

import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Calendar, MapPin, Briefcase, GraduationCap, DollarSign, CheckCircle2, AlertTriangle, Link as LinkIcon, Share2 } from 'lucide-react';
import Link from 'next/link';
import styles from './OpportunityModal.module.css';
import { evaluateOpportunityLifecycle } from '@/lib/opportunity/lifecycle';

export function OpportunityModal({ id, onClose }: { id: string, onClose: () => void }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);
        const res = await fetch(`/api/opportunities/${id}`);
        const json = await res.json();
        if (res.ok) {
          setData(json);
        } else {
          setError(json.error || 'Failed to load details');
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  if (loading) return (
    <div className={styles.overlay}>
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading details...</p>
      </div>
    </div>
  );

  if (error || !data?.opportunity) return (
    <div className={styles.overlay}>
      <div className={styles.errorContainer}>
        <button onClick={onClose} className={`${styles.iconBtn} ${styles.closeBtn}`} style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
          <X size={20} />
        </button>
        <h2 className={styles.errorTitle}><AlertTriangle /> Error</h2>
        <p className={styles.errorText}>{error || 'Opportunity not found.'}</p>
      </div>
    </div>
  );

  const opp = data.opportunity;
  const related = data.related || [];

  const lifecycle = evaluateOpportunityLifecycle({
    id: opp.id,
    deadline: opp.deadline,
    opensDate: opp.opensDate,
    startDate: opp.startDate,
    status: opp.verificationStatus,
  });

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        {/* Header Bar */}
        <div className={styles.headerBar}>
          <div className={styles.badges}>
            <span className={styles.typeBadge}>
              {opp.type.replace('_', ' ')}
            </span>
            {lifecycle.isClosed && (
              <span style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                Closed
              </span>
            )}
            {lifecycle.isClosingSoon && (
              <span style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                {lifecycle.badgeText}
              </span>
            )}
            {lifecycle.status === 'ROLLING_INTAKE' && (
              <span style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                Rolling Intake
              </span>
            )}
            {lifecycle.status === 'UNCONFIRMED' && (
              <span style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                ⚠️ Unconfirmed Deadline
              </span>
            )}
            {opp.trustTier === 1 && (
              <span className={styles.verifiedBadge}>
                <CheckCircle2 size={12} /> Verified Source
              </span>
            )}
          </div>
          <div className={styles.actions}>
            <button className={styles.iconBtn} title="Share">
              <Share2 size={18} />
            </button>
            <button className={styles.iconBtn} title="Report Dead Link">
              <AlertTriangle size={18} />
            </button>
            <button onClick={onClose} className={`${styles.iconBtn} ${styles.closeBtn}`}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className={styles.content}>
          <h1 className={styles.title}>{opp.title}</h1>
          <p className={styles.sponsor}>
            <Briefcase size={18} /> {opp.sponsor}
          </p>

          <div className={styles.metricsGrid}>
            <div className={styles.metricBox}>
              <div className={styles.metricLabel}><MapPin size={14} /> Location</div>
              <div className={styles.metricValue}>{opp.hostCountry}</div>
            </div>
            <div className={styles.metricBox} title="Verified Application Deadline">
              <div className={styles.metricLabel}><Calendar size={14} /> Application Deadline</div>
              <div className={styles.metricValue}>
                {lifecycle.formattedDeadline}
                {lifecycle.isClosed ? (
                  <div style={{ marginTop: '4px', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }} />
                    Closed
                  </div>
                ) : lifecycle.isUpcoming ? (
                  <div style={{ marginTop: '4px', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }} />
                    {lifecycle.badgeText}
                  </div>
                ) : lifecycle.isClosingSoon ? (
                  <div style={{ marginTop: '4px', color: '#d97706', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d97706', display: 'inline-block' }} />
                    {lifecycle.badgeText}
                  </div>
                ) : (
                  <div style={{ marginTop: '4px', color: '#10b981', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                    Applications Open (Real-time)
                  </div>
                )}
              </div>
            </div>
            {opp.startDate && (
              <div className={styles.metricBox} title="Programme / Intake Start Date">
                <div className={styles.metricLabel}><Calendar size={14} /> Programme Start</div>
                <div className={styles.metricValue}>
                  {new Date(opp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            )}
            <div className={styles.metricBox}>
              <div className={styles.metricLabel}><GraduationCap size={14} /> Degree Level</div>
              <div className={styles.metricValue}>{opp.degreeLevel.join(', ') || 'Any'}</div>
            </div>
            <div className={styles.metricBox}>
              <div className={styles.metricLabel}><DollarSign size={14} /> Funding</div>
              <div className={styles.metricValue}>{opp.fundingType?.replace('_', ' ')}</div>
            </div>
          </div>

          <div className={styles.mainColumns}>
            <div className={styles.detailsCol}>

              <section>
                <h3 className={styles.sectionTitle}>Description</h3>
                <p className={styles.sectionText}>
                  {opp.description || 'No detailed description provided.'}
                </p>
              </section>

              <section>
                <h3 className={styles.sectionTitle}>Eligibility Checklist</h3>
                <div className={styles.eligibilityBox}>
                  <p className={styles.sectionText}>
                    {opp.eligibility || 'Check official website for full eligibility criteria.'}
                  </p>
                </div>
              </section>

              <section>
                <h3 className={styles.sectionTitle}>Coverage Details</h3>
                <div className={styles.coverageTags}>
                  {Object.entries(opp.coverageDetails || {}).map(([key, val]) => {
                    if (val === true) {
                      return <span key={key} className={styles.coverageTag}><CheckCircle2 size={14} /> {key} Included</span>
                    } else if (typeof val === 'string') {
                      return <span key={key} className={styles.coverageTagAlt}><DollarSign size={14} /> {key}: {val}</span>
                    }
                    return null;
                  })}
                </div>
              </section>

              {opp.intakes && opp.intakes.length > 0 && (
                <section>
                  <h3 className={styles.sectionTitle}>Intake Cycles & Start Windows</h3>
                  <div className={styles.coverageTags}>
                    {opp.intakes.map((intake: any, idx: number) => (
                      <span key={idx} className={styles.coverageTag}>
                        <Calendar size={14} /> {intake.intakeName || 'Intake'}: Starts {intake.startDate ? new Date(intake.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'TBA'}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h3 className={styles.sectionTitle}>Verification & Source Authority</h3>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.85rem 1rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span>Domain: <strong style={{ color: '#f8fafc' }}>{opp.sourceDomain || 'Official Portal'}</strong></span>
                    <span style={{ color: opp.trustTier === 1 ? '#10b981' : '#60a5fa', fontWeight: 600 }}>
                      {opp.trustTier === 1 ? 'Tier 1 Accredited Authority' : 'Tier 2 Reputable Publisher'}
                    </span>
                  </div>
                  <div>Audit Status: <span style={{ textTransform: 'capitalize', color: opp.verificationStatus === 'verified' ? '#10b981' : '#f59e0b', fontWeight: 600 }}>{opp.verificationStatus || 'Verified'}</span></div>
                </div>
              </section>

            </div>

            <div className={styles.actionCol}>
              <div className={styles.applyBox}>
                <h3 className={styles.applyTitle}>
                  {lifecycle.isClosed ? 'Applications Closed' : lifecycle.isUpcoming ? 'Applications Upcoming' : lifecycle.isRolling ? 'Rolling Admissions' : lifecycle.isUnconfirmed ? 'Date Unconfirmed' : 'Ready to apply?'}
                </h3>
                <p className={styles.applyDesc}>
                  {lifecycle.notice || 'Make sure you have reviewed all eligibility criteria on the official website before starting your application.'}
                </p>
                {lifecycle.canApply ? (
                  <a
                    href={opp.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.applyBtn}
                    style={lifecycle.isClosingSoon ? { background: '#d97706', borderColor: '#b45309' } : {}}
                  >
                    {lifecycle.applyButton.label} <ExternalLink size={18} />
                  </a>
                ) : lifecycle.isUnconfirmed ? (
                  <a
                    href={opp.sourceUrl || opp.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.applyBtn}
                    style={{ background: '#475569', borderColor: '#334155' }}
                  >
                    {lifecycle.applyButton.label} <ExternalLink size={18} />
                  </a>
                ) : (
                  <button
                    disabled
                    className={styles.applyBtn}
                    style={{ opacity: 0.6, cursor: 'not-allowed', background: '#94a3b8', borderColor: '#64748b' }}
                  >
                    {lifecycle.applyButton.label}
                  </button>
                )}
                <a
                  href={opp.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.sourceBtn}
                >
                  {lifecycle.isClosed ? 'View Archived Official Source' : 'View Official Source'} <LinkIcon size={16} />
                </a>
              </div>

              {related.length > 0 && (
                <div className={styles.relatedSection}>
                  <h4 className={styles.relatedTitle}>Similar Opportunities</h4>
                  <div className={styles.relatedList}>
                    {related.map((ro: any) => (
                      <Link
                        key={ro.id}
                        href={`/discover?modal=${ro.id}`}
                        className={styles.relatedItem}
                      >
                        <h5 className={styles.relatedItemTitle}>{ro.title}</h5>
                        <p className={styles.relatedItemCountry}>{ro.hostCountry}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
