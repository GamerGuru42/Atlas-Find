"use client";

import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Calendar, MapPin, Briefcase, GraduationCap, DollarSign, CheckCircle2, AlertTriangle, Link as LinkIcon, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[var(--bg-surface-elevated)] p-8 rounded-xl flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin" />
        <p>Loading details...</p>
      </div>
    </div>
  );

  if (error || !data?.opportunity) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[var(--bg-surface-elevated)] p-8 rounded-xl max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-[var(--text-secondary)] hover:text-white rounded-full hover:bg-white/10 transition">
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><AlertTriangle className="text-red-500" /> Error</h2>
        <p className="text-[var(--text-secondary)]">{error || 'Opportunity not found.'}</p>
      </div>
    </div>
  );

  const opp = data.opportunity;
  const related = data.related || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 md:p-8" onClick={onClose}>
      <div 
        className="bg-[var(--bg-surface)] border border-[var(--border-default)] w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex justify-between items-center p-4 border-b border-[var(--border-default)] bg-[var(--bg-surface-elevated)]">
          <div className="flex gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[rgba(0,255,135,0.1)] text-[var(--accent-primary)] border border-[rgba(0,255,135,0.2)]">
              {opp.type.replace('_', ' ')}
            </span>
            {opp.trustTier === 1 && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                <CheckCircle2 size={12} /> Verified Source
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-[var(--text-secondary)] hover:text-white rounded-full hover:bg-white/10 transition" title="Share">
              <Share2 size={18} />
            </button>
            <button className="p-2 text-[var(--text-secondary)] hover:text-white rounded-full hover:bg-white/10 transition" title="Report Dead Link">
              <AlertTriangle size={18} />
            </button>
            <button onClick={onClose} className="p-2 text-[var(--text-secondary)] hover:text-white rounded-full hover:bg-white/10 transition ml-2 bg-black/20">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 md:p-8 flex-1 custom-scrollbar">
          
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{opp.title}</h1>
          <p className="text-lg text-[var(--text-secondary)] mb-6 flex items-center gap-2">
            <Briefcase size={18} /> {opp.sponsor}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-3 bg-[var(--bg-surface-elevated)] rounded-lg border border-[var(--border-default)]">
              <div className="text-[var(--text-secondary)] text-xs mb-1 flex items-center gap-1"><MapPin size={14}/> Location</div>
              <div className="font-semibold text-sm">{opp.hostCountry}</div>
            </div>
            <div className="p-3 bg-[var(--bg-surface-elevated)] rounded-lg border border-[var(--border-default)]">
              <div className="text-[var(--text-secondary)] text-xs mb-1 flex items-center gap-1"><Calendar size={14}/> Deadline</div>
              <div className="font-semibold text-sm">{new Date(opp.deadline).toLocaleDateString()}</div>
            </div>
            <div className="p-3 bg-[var(--bg-surface-elevated)] rounded-lg border border-[var(--border-default)]">
              <div className="text-[var(--text-secondary)] text-xs mb-1 flex items-center gap-1"><GraduationCap size={14}/> Degree Level</div>
              <div className="font-semibold text-sm capitalize">{opp.degreeLevel.join(', ') || 'Any'}</div>
            </div>
            <div className="p-3 bg-[var(--bg-surface-elevated)] rounded-lg border border-[var(--border-default)]">
              <div className="text-[var(--text-secondary)] text-xs mb-1 flex items-center gap-1"><DollarSign size={14}/> Funding</div>
              <div className="font-semibold text-sm capitalize">{opp.fundingType?.replace('_', ' ')}</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              
              <section>
                <h3 className="text-lg font-bold mb-3 border-b border-[var(--border-default)] pb-2">Description</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap text-sm">
                  {opp.description || 'No detailed description provided.'}
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-3 border-b border-[var(--border-default)] pb-2">Eligibility Checklist</h3>
                <div className="bg-[var(--bg-surface-elevated)] p-4 rounded-xl border border-[var(--border-default)]">
                  <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap text-sm">
                    {opp.eligibility || 'Check official website for full eligibility criteria.'}
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-3 border-b border-[var(--border-default)] pb-2">Coverage Details</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(opp.coverageDetails || {}).map(([key, val]) => {
                    if (val === true) {
                      return <span key={key} className="px-3 py-1.5 bg-[rgba(0,255,135,0.05)] text-[var(--accent-primary)] border border-[rgba(0,255,135,0.2)] rounded-lg text-sm flex items-center gap-2 capitalize"><CheckCircle2 size={14} /> {key} Included</span>
                    } else if (typeof val === 'string') {
                      return <span key={key} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm flex items-center gap-2"><DollarSign size={14}/> {key}: {val}</span>
                    }
                    return null;
                  })}
                </div>
              </section>

            </div>

            <div className="space-y-6">
              <div className="bg-[var(--bg-surface-elevated)] p-5 rounded-xl border border-[var(--border-default)] sticky top-0">
                <h3 className="font-bold mb-2">Ready to apply?</h3>
                <p className="text-xs text-[var(--text-secondary)] mb-4">
                  Make sure you have reviewed all eligibility criteria on the official website before starting your application.
                </p>
                <a 
                  href={opp.applyUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[var(--accent-primary)] text-black font-bold py-3 px-4 rounded-xl hover:bg-[#00e67a] transition shadow-[0_0_20px_rgba(0,255,135,0.3)] hover:shadow-[0_0_30px_rgba(0,255,135,0.5)] mb-3"
                >
                  Apply Now <ExternalLink size={18} />
                </a>
                <a 
                  href={opp.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-transparent text-white border border-[var(--border-default)] font-semibold py-2.5 px-4 rounded-xl hover:bg-white/5 transition text-sm"
                >
                  View Official Source <LinkIcon size={16} />
                </a>
              </div>

              {related.length > 0 && (
                <div>
                  <h4 className="font-bold text-sm mb-3 text-[var(--text-secondary)] uppercase tracking-wider">Similar Opportunities</h4>
                  <div className="space-y-3">
                    {related.map((ro: any) => (
                      <Link 
                        key={ro.id} 
                        href={`/discover?modal=${ro.id}`}
                        className="block p-3 bg-[var(--bg-surface-elevated)] rounded-lg border border-[var(--border-default)] hover:border-[var(--accent-primary)] transition group"
                      >
                        <h5 className="font-semibold text-sm group-hover:text-[var(--accent-primary)] transition line-clamp-2">{ro.title}</h5>
                        <p className="text-xs text-[var(--text-secondary)] mt-1 truncate">{ro.hostCountry}</p>
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
