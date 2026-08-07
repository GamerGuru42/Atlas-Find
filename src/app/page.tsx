import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        {/* Animated glow orbs */}
        <div className={styles.glowOrb1} />
        <div className={styles.glowOrb2} />
        <div className={styles.gridOverlay} />

        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            AI-Powered · Verified · Nigeria-First
          </div>

          <h1 className={styles.title}>
            More than a search engine.
            <br />
            <span className={styles.titleGradient}>Your AI application strategist.</span>
          </h1>

          <p className={styles.subtitle}>
            AtlasFind doesn&apos;t just list scholarships. It acts as your personal research agent—finding verified pathways, providing real application links, and tailoring strategies to your specific profile and background.
          </p>

          <div className={styles.actions}>
            <Link href="/chat">
              <Button variant="primary" size="lg">
                Start Talking →
              </Button>
            </Link>
            <Link href="/discover">
              <Button variant="secondary" size="lg">
                Browse Opportunities
              </Button>
            </Link>
          </div>

          <div className={styles.trustBar}>
            <span className={styles.trustIcon}>✓</span>
            Every opportunity verified against its original source · Last checked 2 hours ago
          </div>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>50+</span>
            <span className={styles.statLabel}>Verified Listings</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statValue}>6 hrs</span>
            <span className={styles.statLabel}>Re-verification Cycle</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statValue}>100%</span>
            <span className={styles.statLabel}>Free Forever</span>
          </div>
        </div>
      </section>

      {/* Logos / Trusted Sources */}
      <section className={styles.logosSection}>
        <p className={styles.logosTitle}>Verified sources from</p>
        <div className={styles.logosRow}>
          <span className={styles.logoItem}>DAAD</span>
          <span className={styles.logoItem}>Chevening</span>
          <span className={styles.logoItem}>Fulbright</span>
          <span className={styles.logoItem}>Erasmus+</span>
          <span className={styles.logoItem}>Commonwealth</span>
          <span className={styles.logoItem}>Gates Cambridge</span>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>How It Works</span>
          <h2 className={styles.sectionTitle}>
            One conversation.
            <br />
            <span className={styles.titleGradient}>Every opportunity.</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            No more filtering through 20 fields. Tell AtlasFind what you need, and our 7-agent AI system does the rest.
          </p>
        </div>

        <div className={styles.grid}>
          <Card className={styles.featureCard}>
            <div className={styles.featureNumber}>01</div>
            <h3 className={styles.featureTitle}>Conversational Discovery</h3>
            <p className={styles.featureText}>
              Just tell AtlasFind who you are and what you want in natural language. Our AI understands context, asks clarifying questions, and learns your profile.
            </p>
          </Card>
          <Card className={styles.featureCard}>
            <div className={styles.featureNumber}>02</div>
            <h3 className={styles.featureTitle}>Verification Guard</h3>
            <p className={styles.featureText}>
              Every link is checked. Domains are whitelisted. Scam patterns are auto-detected. We bring you only real, verified opportunities.
            </p>
          </Card>
          <Card className={styles.featureCard}>
            <div className={styles.featureNumber}>03</div>
            <h3 className={styles.featureTitle}>Strategic Advice</h3>
            <p className={styles.featureText}>
              Don&apos;t just get a list. Get told which scholarships you have the highest probability of winning — and exactly why.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaGlow} />
        <h2 className={styles.ctaTitle}>
          Ready to find your pathway?
        </h2>
        <p className={styles.ctaSubtitle}>
          Join thousands of students who are discovering verified opportunities with AI.
        </p>
        <Link href="/chat">
          <Button variant="primary" size="lg">
            Talk to AtlasFind →
          </Button>
        </Link>
      </section>
    </>
  );
}
