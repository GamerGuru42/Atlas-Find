"use client";

import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Calendar, MapPin, Briefcase, GraduationCap, DollarSign, CheckCircle2, AlertTriangle, Link as LinkIcon, Share2 } from 'lucide-react';
import Link from 'next/link';
import styles from './OpportunityModal.module.css';

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

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        
        {/* Header Bar */}
        <div className={styles.headerBar}>
          <div className={styles.badges}>
            <span className={styles.typeBadge}>
              {opp.type.replace('_', ' ')}
            </span>
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
              <div className={styles.metricLabel}><MapPin size={14}/> Location</div>
              <div className={styles.metricValue}>{opp.hostCountry}</div>
            </div>
            <div className={styles.metricBox} title="Verified Application Deadline">
              <div className={styles.metricLabel}><Calendar size={14}/> Application Deadline</div>
              <div className={styles.metricValue}>
                {new Date(opp.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                {new Date(opp.deadline) > new Date() && (
                  <div style={{ marginTop: '4px', color: '#10b981', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                    Applications Open (Real-time)
                  </div>
                )}
              </div>
            </div>
            <div className={styles.metricBox}>
              <div className={styles.metricLabel}><GraduationCap size={14}/> Degree Level</div>
              <div className={styles.metricValue}>{opp.degreeLevel.join(', ') || 'Any'}</div>
            </div>
            <div className={styles.metricBox}>
              <div className={styles.metricLabel}><DollarSign size={14}/> Funding</div>
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
                      return <span key={key} className={styles.coverageTagAlt}><DollarSign size={14}/> {key}: {val}</span>
                    }
                    return null;
                  })}
                </div>
              </section>

            </div>

            <div className={styles.actionCol}>
              <div className={styles.applyBox}>
                <h3 className={styles.applyTitle}>Ready to apply?</h3>
                <p className={styles.applyDesc}>
                  Make sure you have reviewed all eligibility criteria on the official website before starting your application.
                </p>
                <a 
                  href={opp.applyUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.applyBtn}
                >
                  Apply Now <ExternalLink size={18} />
                </a>
                <a 
                  href={opp.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.sourceBtn}
                >
                  View Official Source <LinkIcon size={16} />
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
