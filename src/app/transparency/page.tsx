import React from 'react';
import Link from 'next/link';

export default function TransparencyPage() {
  return (
    <div style={{ minHeight: 'calc(100vh - 72px)', padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Transparency
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
          AtlasFind is built on trust. Here&apos;s exactly how we find, verify, and present opportunities to you.
        </p>
      </div>

      {/* How Verification Works */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>
          🔍 How Our Verification Works
        </h2>
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>Tier 1 — Government & Foundation Sources</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Programs from official government bodies (Chevening, Fulbright, DAAD, Commonwealth, Erasmus+, Australia Awards) and major foundations (Mastercard, Gates, World Bank). These are auto-trusted and linked directly to their official .gov or .org domains.
          </p>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent-secondary)' }}>Tier 2 — Cross-Referenced Sources</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Opportunities from reputable education news sites, university press releases, and established scholarship databases. These are cross-referenced against at least one Tier 1 source before listing.
          </p>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--status-warning)' }}>Tier 3 — Flagged / Unconfirmed</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Opportunities from blogs, social media, or WhatsApp forwards. These are <strong>never</strong> listed in our database. If our AI encounters them, it will explicitly warn you and suggest verified alternatives.
          </p>
        </div>
      </section>

      {/* Scam Detection */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>
          🛡️ Scam Detection
        </h2>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
            Our AI agent runs every opportunity through a mental scam checklist before mentioning it:
          </p>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: 2, paddingLeft: '1.5rem', margin: 0 }}>
            <li><span style={{ color: 'var(--status-danger)' }}>🚩</span> Payment required to apply? — <strong>Red flag</strong></li>
            <li><span style={{ color: 'var(--status-danger)' }}>🚩</span> Contact is a Gmail/Yahoo for an &ldquo;official&rdquo; program? — <strong>Red flag</strong></li>
            <li><span style={{ color: 'var(--status-warning)' }}>⚠️</span> Vague eligibility with no clear sponsor? — <strong>Yellow flag</strong></li>
            <li><span style={{ color: 'var(--status-danger)' }}>🚩</span> &ldquo;Guaranteed admission&rdquo; or &ldquo;100% success rate&rdquo;? — <strong>Red flag</strong></li>
            <li><span style={{ color: 'var(--status-danger)' }}>🚩</span> No verifiable sponsoring organization? — <strong>Red flag</strong></li>
          </ul>
        </div>
      </section>

      {/* What We Never Do */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>
          🚫 What We Never Do
        </h2>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: 2, paddingLeft: '1.5rem', margin: 0 }}>
            <li>We <strong>never invent</strong> or hallucinate opportunities. If we don&apos;t know, we say so.</li>
            <li>We <strong>never guarantee</strong> acceptance. We calculate probability, not destiny.</li>
            <li>We <strong>never write</strong> your essays, SOPs, or recommendation letters for you.</li>
            <li>We <strong>never share</strong> your personal data between users.</li>
            <li>We <strong>never recommend</strong> diploma mills or unaccredited programs.</li>
            <li>We <strong>never give</strong> visa legal advice — only general timelines and official links.</li>
          </ul>
        </div>
      </section>

      {/* Data Practices */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>
          📊 Our Data Practices
        </h2>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: 2, paddingLeft: '1.5rem', margin: 0 }}>
            <li><strong>Re-verification cycle:</strong> Every 6 hours, our system checks that listed URLs, deadlines, and eligibility criteria are still accurate.</li>
            <li><strong>Deadline honesty:</strong> If we&apos;re unsure about a specific deadline, we use language like &ldquo;typically opens in...&rdquo; and always urge you to verify on the official website.</li>
            <li><strong>Source linking:</strong> Every opportunity card links to both the official application page and the source where we found/verified the listing.</li>
            <li><strong>Open database:</strong> Our full verified database is browsable on the <Link href="/discover" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Discover page</Link>.</li>
          </ul>
        </div>
      </section>

      {/* AI Limitations */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>
          🤖 AI Limitations
        </h2>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            AtlasFind is powered by AI (Google Gemini). While we&apos;ve built extensive guardrails and verification systems, AI can occasionally make mistakes. We encourage you to always:
          </p>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: 2, paddingLeft: '1.5rem', marginTop: '0.75rem', marginBottom: 0 }}>
            <li>Verify deadlines and eligibility on the official program website before applying.</li>
            <li>Double-check any specific requirements mentioned by the AI.</li>
            <li>Report any inaccuracies you find so we can improve.</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Have questions about our process?</p>
        <Link href="/chat" style={{
          display: 'inline-block',
          background: 'var(--accent-primary)',
          color: 'var(--bg-base)',
          padding: '0.75rem 2rem',
          borderRadius: 'var(--radius-full)',
          fontWeight: 700,
          textDecoration: 'none',
        }}>
          Talk to Atlas →
        </Link>
      </div>
    </div>
  );
}
