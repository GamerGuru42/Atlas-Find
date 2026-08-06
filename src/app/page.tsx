import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.glow}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            We don't list scholarships. <br />
            We verify pathways.
          </h1>
          <div className={styles.trustBar}>
            <span className={styles.trustIcon}>✓</span>
            Every opportunity verified against its original source · Last checked 2 hours ago
          </div>
          <p className={styles.subtitle}>
            AtlasFind is your AI-powered research agent. It learns your profile, 
            finds verified opportunities, and guides you through the entire 
            application journey — from discovery to submission.
          </p>
          
          <div className={styles.actions}>
            <Link href="/chat">
              <Button variant="primary" size="lg">Talk to AtlasFind</Button>
            </Link>
            <Link href="/discover">
              <Button variant="secondary" size="lg">Browse Opportunities</Button>
            </Link>
          </div>
          
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>50+</span>
              <span className={styles.statLabel}>Verified Listings</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>6 hrs</span>
              <span className={styles.statLabel}>Re-verification</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>100%</span>
              <span className={styles.statLabel}>Free Forever</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Why AtlasFind is Different</h2>
        <div className={styles.grid}>
          <Card className={styles.featureCard}>
            <div className={styles.featureIcon}>💬</div>
            <h3 className={styles.featureTitle}>Conversational Discovery</h3>
            <p className={styles.featureText}>
              Stop filling out 20-field forms. Just tell AtlasFind who you are and what you want in natural language.
            </p>
          </Card>
          <Card className={styles.featureCard}>
            <div className={styles.featureIcon}>🛡️</div>
            <h3 className={styles.featureTitle}>Verification Guard</h3>
            <p className={styles.featureText}>
              Every link is checked. Domains are whitelisted. Scams are flagged. We bring you only real, verified opportunities.
            </p>
          </Card>
          <Card className={styles.featureCard}>
            <div className={styles.featureIcon}>🎯</div>
            <h3 className={styles.featureTitle}>Strategic Advice</h3>
            <p className={styles.featureText}>
              Don't just get a list. Get told which ones you have the highest probability of winning, and why.
            </p>
          </Card>
        </div>
      </section>
    </>
  );
}
