'use client';

import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

const OPPORTUNITY_TYPES = [
  'SCHOLARSHIP',
  'FELLOWSHIP',
  'GRANT',
  'INTERNSHIP',
  'RESEARCH_POSITION',
  'EXCHANGE',
  'CONFERENCE',
  'AWARD',
  'OTHER',
];

export default function SubmitOpportunityPage() {
  const searchParams = useSearchParams();
  const prefillDescription = searchParams.get('description') || '';

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [applyUrl, setApplyUrl] = useState('');
  const [type, setType] = useState('SCHOLARSHIP');
  const [hostCountry, setHostCountry] = useState('');
  const [hostContinent, setHostContinent] = useState('');
  const [deadline, setDeadline] = useState('');
  const [sponsor, setSponsor] = useState('');
  const [description, setDescription] = useState(prefillDescription);
  const [email, setEmail] = useState('');

  const descMaxLen = 300;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          applyUrl: applyUrl.trim(),
          type,
          hostCountry: hostCountry.trim(),
          hostContinent: hostContinent.trim(),
          deadline: deadline || null,
          sponsor: sponsor.trim(),
          description: description.trim(),
          submittedBy: email.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Submission failed');
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className={styles.submitContainer}>
        <div className={styles.glowOrb1} />
        <div className={styles.glowOrb2} />
        <div className={styles.gridOverlay} />
        <div className={styles.successCard}>
          <span className={styles.successIcon}>✅</span>
          <h1 className={styles.successTitle}>Opportunity Submitted!</h1>
          <p className={styles.successMessage}>
            Thank you! Our team will review this within 48 hours. Once verified, it will appear on the Discover page for everyone to find.
          </p>
          <div className={styles.successActions}>
            <Link href="/discover" className={styles.primaryLink}>
              Back to Discover
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setTitle('');
                setApplyUrl('');
                setType('SCHOLARSHIP');
                setHostCountry('');
                setHostContinent('');
                setDeadline('');
                setSponsor('');
                setDescription('');
                setEmail('');
              }}
              className={styles.secondaryLink}
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.submitContainer}>
      <div className={styles.glowOrb1} />
      <div className={styles.glowOrb2} />
      <div className={styles.gridOverlay} />

      <div className={styles.formCard}>
        <span className={styles.headerIcon}>🌍</span>
        <h1 className={styles.title}>Submit an Opportunity</h1>
        <p className={styles.subtitle}>
          Know of a scholarship, fellowship, or grant that others should find?
          Share it here and we&apos;ll verify and add it to our database.
        </p>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Title */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="submit-title">
              Opportunity Title <span className={styles.required}>*</span>
            </label>
            <input
              id="submit-title"
              className={styles.input}
              type="text"
              placeholder="e.g., Chevening Scholarship 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
            />
          </div>

          {/* Apply URL */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="submit-url">
              Application URL <span className={styles.required}>*</span>
            </label>
            <input
              id="submit-url"
              className={styles.input}
              type="url"
              placeholder="https://example.org/apply"
              value={applyUrl}
              onChange={(e) => setApplyUrl(e.target.value)}
              required
            />
          </div>

          {/* Type + Host Country row */}
          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="submit-type">
                Type
              </label>
              <select
                id="submit-type"
                className={styles.select}
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {OPPORTUNITY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="submit-country">
                Host Country
              </label>
              <input
                id="submit-country"
                className={styles.input}
                type="text"
                placeholder="e.g., United Kingdom"
                value={hostCountry}
                onChange={(e) => setHostCountry(e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="submit-continent">
                Host Continent
              </label>
              <select
                id="submit-continent"
                className={styles.select}
                value={hostContinent}
                onChange={(e) => setHostContinent(e.target.value)}
              >
                <option value="">Select Continent...</option>
                <option value="North America">North America</option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="Oceania">Oceania</option>
                <option value="South America">South America</option>
                <option value="Africa">Africa</option>
                <option value="Global/Online">Global/Online</option>
              </select>
            </div>
          </div>

          {/* Deadline + Sponsor row */}
          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="submit-deadline">
                Deadline
              </label>
              <input
                id="submit-deadline"
                className={styles.input}
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="submit-sponsor">
                Sponsor / Organization
              </label>
              <input
                id="submit-sponsor"
                className={styles.input}
                type="text"
                placeholder="e.g., UK Government"
                value={sponsor}
                onChange={(e) => setSponsor(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="submit-description">
              Description
            </label>
            <textarea
              id="submit-description"
              className={styles.textarea}
              placeholder="Brief overview of the opportunity..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value.slice(0, descMaxLen))
              }
              maxLength={descMaxLen}
              rows={3}
            />
            <span
              className={`${styles.charCount} ${description.length > descMaxLen - 30 ? styles.charCountWarn : ''}`}
            >
              {description.length}/{descMaxLen}
            </span>
          </div>

          {/* Email */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="submit-email">
              Your Email (optional)
            </label>
            <input
              id="submit-email"
              className={styles.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading || !title.trim() || !applyUrl.trim()}
          >
            {loading ? 'Submitting…' : 'Submit Opportunity'}
          </button>
        </form>
      </div>
    </div>
  );
}
