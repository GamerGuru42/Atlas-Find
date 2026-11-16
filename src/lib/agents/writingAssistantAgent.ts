/**
 * Agent E: Writing Assistant
 *
 * Provides structural feedback, content outlines, and editorial critiques
 * for CVs, cover letters, and statements of purpose.
 *
 * STRICT GOVERNANCE RULE:
 * Ghostwriting is prohibited. The writing assistant NEVER invents academic achievements,
 * employment history, grades, publications, or credentials. It guides the candidate
 * to articulate their authentic background effectively.
 */

export interface DocumentReviewFeedback {
  documentType: 'CV' | 'STATEMENT_OF_PURPOSE' | 'COVER_LETTER' | 'SCHOLARSHIP_ESSAY' | 'COLD_EMAIL';
  strengths: string[];
  areasForImprovement: string[];
  actionableRecommendations: string[];
  authenticityNotice: string;
}

export function reviewApplicationDraft(
  draftText: string,
  documentType: DocumentReviewFeedback['documentType'],
  targetOpportunity?: { title: string; sponsor: string }
): DocumentReviewFeedback {
  const text = draftText.trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  const strengths: string[] = [];
  const areasForImprovement: string[] = [];
  const actionableRecommendations: string[] = [];

  // 1. Length & Conciseness Audit
  if (documentType === 'STATEMENT_OF_PURPOSE') {
    if (wordCount >= 500 && wordCount <= 1000) {
      strengths.push(`Appropriate length (${wordCount} words) conforming to standard academic norms.`);
    } else if (wordCount < 500) {
      areasForImprovement.push(`Length (${wordCount} words) is brief; committees typically expect 600-900 words explaining research interests and intellectual journey.`);
      actionableRecommendations.push('Elaborate on specific coursework, projects, or research questions you aim to pursue.');
    } else {
      areasForImprovement.push(`Draft (${wordCount} words) exceeds standard 1,000-word limit and risks committee fatigue.`);
      actionableRecommendations.push('Prune conversational filler and focus on your most impactful achievements.');
    }
  }

  // 2. Evidence and Specificity Analysis
  const hasNumbers = /\d+/.test(text);
  if (hasNumbers) {
    strengths.push('Includes quantitative metrics/specific numbers to substantiate accomplishments.');
  } else {
    areasForImprovement.push('Lacks quantitative evidence (e.g. project metrics, team size, percentage improvements).');
    actionableRecommendations.push('Add tangible metrics where applicable (e.g., "Led a team of 4 engineers", "Improved model accuracy by 12%").');
  }

  // 3. Target Alignment
  if (targetOpportunity) {
    const mentionsSponsor = text.toLowerCase().includes(targetOpportunity.sponsor.toLowerCase()) ||
                            text.toLowerCase().includes(targetOpportunity.title.toLowerCase());
    if (mentionsSponsor) {
      strengths.push(`Explicitly references ${targetOpportunity.sponsor}, demonstrating customized preparation.`);
    } else {
      areasForImprovement.push(`Does not mention ${targetOpportunity.sponsor} or specific faculty/program attributes.`);
      actionableRecommendations.push(`Explicitly explain why ${targetOpportunity.sponsor} is the ideal venue for your goals.`);
    }
  }

  // 4. Tone and Cliché Check
  const cliches = ['since childhood', 'passion for', 'always dreamt of', 'hard worker', 'thinking outside the box'];
  const detectedCliches = cliches.filter(c => text.toLowerCase().includes(c));
  if (detectedCliches.length > 0) {
    areasForImprovement.push(`Contains generic openings/phrases: "${detectedCliches.join('", "')}".`);
    actionableRecommendations.push('Replace generic interest statements with a concrete turning-point anecdote or technical problem that sparked your work.');
  } else {
    strengths.push('Avoids common admissions essay clichés and maintains professional tone.');
  }

  return {
    documentType,
    strengths,
    areasForImprovement,
    actionableRecommendations,
    authenticityNotice: 'AtlasFind does not ghostwrite or fabricate qualifications. All statements must reflect your truthful academic and professional experiences.',
  };
}

