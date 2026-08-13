import React from 'react';
import styles from './Pricing.module.css';

export function FeatureComparison() {
  return (
    <div className={styles.tableSection}>
      <h3 className={styles.tableTitle}>Compare Features</h3>
      <table className={styles.comparisonTable}>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Free</th>
            <th>Pro</th>
            <th>Elite</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>AI Chat</td>
            <td className={styles.tableCheck}>✓</td>
            <td className={styles.tableCheck}>✓</td>
            <td className={styles.tableCheck}>✓</td>
          </tr>
          <tr>
            <td>Browse & Search</td>
            <td className={styles.tableCheck}>✓</td>
            <td className={styles.tableCheck}>✓</td>
            <td className={styles.tableCheck}>✓</td>
          </tr>
          <tr>
            <td>Save Opportunities</td>
            <td className={styles.tableCheck}>✓ (20 max)</td>
            <td className={styles.tableCheck}>✓</td>
            <td className={styles.tableCheck}>✓</td>
          </tr>
          <tr>
            <td>Application Tracker</td>
            <td className={styles.tableCheck}>✓</td>
            <td className={styles.tableCheck}>✓</td>
            <td className={styles.tableCheck}>✓</td>
          </tr>
          <tr>
            <td>Deadline Alerts</td>
            <td className={styles.tableCheck}>✓ (Email)</td>
            <td className={styles.tableCheck}>✓ (Email + SMS)</td>
            <td className={styles.tableCheck}>✓ (Email + SMS)</td>
          </tr>
          <tr>
            <td>Document Vault</td>
            <td className={styles.tableDash}>—</td>
            <td className={styles.tableCheck}>✓ (5 files)</td>
            <td className={styles.tableCheck}>✓ (Unlimited)</td>
          </tr>
          <tr>
            <td>AI Essay Drafting</td>
            <td className={styles.tableDash}>—</td>
            <td className={styles.tableCheck}>✓</td>
            <td className={styles.tableCheck}>✓</td>
          </tr>
          <tr>
            <td>AI Essay Review</td>
            <td className={styles.tableDash}>—</td>
            <td className={styles.tableCheck}>✓</td>
            <td className={styles.tableCheck}>✓</td>
          </tr>
          <tr>
            <td>Human Essay Review</td>
            <td className={styles.tableDash}>—</td>
            <td className={styles.tableDash}>—</td>
            <td className={styles.tableCheck}>✓ (2/month)</td>
          </tr>
          <tr>
            <td>Mentor Calls</td>
            <td className={styles.tableDash}>—</td>
            <td className={styles.tableDash}>—</td>
            <td className={styles.tableCheck}>✓ (1/month)</td>
          </tr>
          <tr>
            <td>Mock Interviews</td>
            <td className={styles.tableDash}>—</td>
            <td className={styles.tableDash}>—</td>
            <td className={styles.tableCheck}>✓</td>
          </tr>
          <tr>
            <td>Resume Builder</td>
            <td className={styles.tableDash}>—</td>
            <td className={styles.tableDash}>—</td>
            <td className={styles.tableCheck}>✓</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
