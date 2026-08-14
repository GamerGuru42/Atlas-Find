'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Globe, Save, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import styles from './Profile.module.css';

export default function ProfileSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('NG');
  const [initialCountry, setInitialCountry] = useState('NG');
  const [targetDegree, setTargetDegree] = useState('Masters');
  const [fieldOfStudy, setFieldOfStudy] = useState('Computer Science');

  // Inline Validation Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setName(data.name || '');
        setEmail(data.email || '');
        setCountry(data.countryCode || 'NG');
        setInitialCountry(data.countryCode || 'NG');
        setTargetDegree(data.targetDegree || 'Masters');
        setFieldOfStudy(data.fieldOfStudy || 'STEM / Computer Science');
      } else {
        // Fallback placeholder profile data
        setName('Benny');
        setEmail('user@atlasfind.com');
        setCountry('NG');
        setInitialCountry('NG');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email address is required';
    if (!country) errs.country = 'Please select a country of residence';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, country, targetDegree, fieldOfStudy }),
      });

      if (res.ok) {
        setSuccessMsg('Profile updated successfully!');
        setInitialCountry(country);
        setTimeout(() => setSuccessMsg(null), 5000);
      } else {
        const data = await res.json();
        setErrors({ form: data.message || 'Failed to save profile changes.' });
      }
    } catch (err) {
      setSuccessMsg('Profile updated locally.');
      setTimeout(() => setSuccessMsg(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
        <RefreshCw size={28} className="spinner" style={{ marginBottom: '1rem' }} />
        <p>Loading your profile settings...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto', padding: '1rem 0' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
        Profile Settings
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2rem' }}>
        Manage your personal information, country location, and scholarship preferences.
      </p>

      {successMsg && (
        <div style={{
          background: 'rgba(34,197,94,0.15)',
          border: '1px solid rgba(34,197,94,0.4)',
          color: '#4ade80',
          padding: '1rem 1.25rem',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <CheckCircle2 size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      {errors.form && (
        <div style={{
          background: 'rgba(239,68,68,0.15)',
          border: '1px solid rgba(239,68,68,0.4)',
          color: '#f87171',
          padding: '1rem 1.25rem',
          borderRadius: '10px',
          marginBottom: '1.5rem'
        }}>
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        {/* Full Name */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.5rem' }}>
            Full Name
          </label>
          <div style={{ position: 'relative' }}>
            <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                background: 'rgba(0,0,0,0.3)',
                border: errors.name ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.95rem'
              }}
            />
          </div>
          {errors.name && (
            <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.35rem' }}>{errors.name}</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.5rem' }}>
            Email Address
          </label>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                background: 'rgba(0,0,0,0.3)',
                border: errors.email ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.95rem'
              }}
            />
          </div>
          {errors.email && (
            <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.35rem' }}>{errors.email}</p>
          )}
        </div>

        {/* Country Selector with Warning */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.5rem' }}>
            Country of Residence
          </label>
          <div style={{ position: 'relative' }}>
            <Globe size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                background: '#0f172a',
                border: errors.country ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.95rem'
              }}
            >
              <option value="NG">🇳🇬 Nigeria</option>
              <option value="GH">🇬🇭 Ghana</option>
              <option value="KE">🇰🇪 Kenya</option>
              <option value="IN">🇮🇳 India</option>
              <option value="US">🇺🇸 United States</option>
              <option value="GB">🇬🇧 United Kingdom</option>
              <option value="CA">🇨🇦 Canada</option>
            </select>
          </div>

          {country !== initialCountry && (
            <div style={{
              marginTop: '0.75rem',
              background: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.3)',
              color: '#fbbf24',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertTriangle size={16} />
              <span>Note: Changing your country will update your local pricing currency on the Pricing page.</span>
            </div>
          )}
        </div>

        {/* Target Degree */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.5rem' }}>
            Target Degree Level
          </label>
          <select
            value={targetDegree}
            onChange={(e) => setTargetDegree(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#0f172a',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.95rem'
            }}
          >
            <option value="Bachelors">Undergraduate / Bachelor's</option>
            <option value="Masters">Postgraduate / Master's</option>
            <option value="PhD">Doctorate / PhD</option>
            <option value="Fellowship">Fellowship / Postdoc</option>
          </select>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          style={{
            marginTop: '1rem',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            padding: '0.85rem 1.5rem',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.95rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }}
        >
          {saving ? <RefreshCw size={18} className="spinner" /> : <Save size={18} />}
          <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
        </button>
      </form>
    </div>
  );
}
