import React from 'react';
import Link from 'next/link';
import { Building2, Compass, ExternalLink, ShieldCheck, ArrowLeft, Heart, Calendar, MapPin } from 'lucide-react';
import prisma from '@/lib/db/prisma';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function OrganizationPage({ params }: Props) {
  const { slug } = await params;

  // Query organization from DB or fallback static dictionary
  let org: any = null;
  let opportunities: any[] = [];

  try {
    const dbOpportunities = await prisma.opportunity.findMany({
      where: {
        sponsor: {
          contains: slug.replace(/-/g, ' '),
          mode: 'insensitive',
        },
      },
      take: 20,
    });

    if (dbOpportunities.length > 0) {
      org = {
        name: dbOpportunities[0].sponsor || slug.replace(/-/g, ' '),
        description: `Official provider of global scholarships, grants, and academic opportunities listed on AtlasFind.`,
        verified: true,
        slug,
        followersCount: 1420,
      };
      opportunities = dbOpportunities;
    }
  } catch (e) {
    console.error('Org query error:', e);
  }

  // Fallback demo org data for common slugs
  if (!org && ['chevening', 'rhodes', 'fulbright', 'erasmus', 'gates-cambridge'].includes(slug.toLowerCase())) {
    const formattedName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    org = {
      name: formattedName,
      description: `World-renowned scholarship program offering fully funded master's and doctoral opportunities for global leaders.`,
      verified: true,
      slug,
      followersCount: 3890,
    };
  }

  // 404 / NOT FOUND STATE (Invalid slug)
  if (!org) {
    return (
      <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '3.5rem 2rem'
        }}>
          <Building2 size={56} style={{ color: '#64748b', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem', color: '#f8fafc' }}>
            Organization Not Found
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
            We couldn't find an organization matching "<strong style={{ color: '#cbd5e1' }}>{slug}</strong>". Browse our verified database of top funding providers.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link
              href="/discover"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#2563eb',
                color: '#fff',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <Compass size={18} /> Explore All Opportunities
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // FOUND / SUCCESS STATE
  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <Link
        href="/discover"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#94a3b8',
          textDecoration: 'none',
          marginBottom: '1.5rem',
          fontSize: '0.9rem'
        }}
      >
        <ArrowLeft size={16} /> Back to Discover
      </Link>

      {/* Org Header Card */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>{org.name}</h1>
              {org.verified && <ShieldCheck size={22} style={{ color: '#2563eb' }} />}
            </div>
            <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '700px', lineHeight: '1.6' }}>
              {org.description}
            </p>
          </div>

          <button style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(37,99,235,0.15)',
            border: '1px solid rgba(37,99,235,0.4)',
            color: '#60a5fa',
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            <Heart size={16} /> Follow Organization ({org.followersCount})
          </button>
        </div>
      </div>

      {/* Opportunities List */}
      <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.25rem' }}>
        Active Opportunities ({opportunities.length})
      </h2>

      {opportunities.length === 0 ? (
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px dashed rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          color: '#94a3b8'
        }}>
          <p>No open funding calls listed for {org.name} right now.</p>
          <Link href="/discover" style={{ color: '#60a5fa', marginTop: '0.5rem', display: 'inline-block' }}>
            Explore other matching opportunities &rarr;
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {opportunities.map((opp) => (
            <div key={opp.id} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {opp.opportunityType || 'Scholarship'}
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', margin: '0.5rem 0' }}>
                  {opp.title}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={14} /> {opp.hostCountry || 'Global'}
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={14} /> {opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'Rolling'}
                </span>
                <Link
                  href={`/discover?modal=${opp.id}`}
                  style={{ fontSize: '0.875rem', fontWeight: 600, color: '#3b82f6', textDecoration: 'none' }}
                >
                  View Details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
