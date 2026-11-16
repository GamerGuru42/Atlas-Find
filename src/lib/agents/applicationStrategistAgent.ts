/**
 * Agent D: Application Strategist
 *
 * Builds personalized application roadmaps and milestone schedules
 * with backwards planning from authentic application deadlines.
 */

export interface ApplicationMilestone {
  week: number;
  phase: string;
  targetDate: string;
  tasks: string[];
  status: 'pending' | 'in_progress' | 'completed';
}

export interface ApplicationStrategyPlan {
  opportunityTitle: string;
  deadline: string;
  daysRemaining: number;
  urgencyLevel: 'URGENT' | 'HIGH' | 'MODERATE' | 'SUFFICIENT_TIME';
  milestones: ApplicationMilestone[];
  strategicAdvice: string[];
}

export function generateApplicationStrategy(
  opportunityTitle: string,
  deadlineDate: Date | string,
  userProfile?: { level?: string; fieldOfStudy?: string }
): ApplicationStrategyPlan {
  const deadline = new Date(deadlineDate);
  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  let urgencyLevel: 'URGENT' | 'HIGH' | 'MODERATE' | 'SUFFICIENT_TIME';
  if (daysRemaining <= 14) {
    urgencyLevel = 'URGENT';
  } else if (daysRemaining <= 30) {
    urgencyLevel = 'HIGH';
  } else if (daysRemaining <= 60) {
    urgencyLevel = 'MODERATE';
  } else {
    urgencyLevel = 'SUFFICIENT_TIME';
  }

  const milestones: ApplicationMilestone[] = [];

  if (daysRemaining > 45) {
    // 6-8 week timeline
    const week1Date = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const week3Date = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const week5Date = new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const finalDate = new Date(deadline.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    milestones.push({
      week: 1,
      phase: 'Eligibility Confirmation & Document Audit',
      targetDate: week1Date,
      tasks: [
        'Confirm degree and nationality alignment against official guidelines',
        'Request certified academic transcripts from your registrar',
        'Contact 2 prospective referees to request letters of recommendation',
      ],
      status: 'in_progress',
    });

    milestones.push({
      week: 3,
      phase: 'Drafting Core Narrative & CV Tailoring',
      targetDate: week3Date,
      tasks: [
        'Tailor your CV to emphasize relevant coursework and achievements',
        'Draft first version of Statement of Purpose addressing sponsor mission',
        'Follow up with referees regarding recommendation letters',
      ],
      status: 'pending',
    });

    milestones.push({
      week: 5,
      phase: 'Critique, Proofreading & Review',
      targetDate: week5Date,
      tasks: [
        'Review application essays for clarity, conciseness, and evidence',
        'Verify document formatting and size requirements',
        'Prepare institutional portal account and fill profile forms',
      ],
      status: 'pending',
    });

    milestones.push({
      week: 7,
      phase: 'Buffer & Early Submission',
      targetDate: finalDate,
      tasks: [
        'Complete final proofread of all uploaded documents',
        'Submit application at least 72 hours before the deadline to avoid server congestion',
        'Save confirmation receipt and tracking reference number',
      ],
      status: 'pending',
    });
  } else {
    // Accelerated timeline (under 4 weeks)
    const midDate = new Date(now.getTime() + Math.floor(diffMs / 2)).toISOString().split('T')[0];
    const finalDate = new Date(deadline.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    milestones.push({
      week: 1,
      phase: 'Immediate Document Gathering & Direct Drafting',
      targetDate: midDate,
      tasks: [
        'Secure existing copies of official transcripts and degree certificates',
        'Draft a focused, concise Statement of Purpose tailored directly to selection criteria',
        'Urgent outreach to recommenders with your CV and key highlights',
      ],
      status: 'in_progress',
    });

    milestones.push({
      week: 2,
      phase: 'Final Polish & Immediate Submission',
      targetDate: finalDate,
      tasks: [
        'Assemble all PDF files according to sponsor file naming rules',
        'Complete submission directly on official portal',
      ],
      status: 'pending',
    });
  }

  const advice: string[] = [
    'Always submit at least 48 to 72 hours prior to the stated deadline to guard against portal downtime.',
    'Anchor every claim in your application in verifiable evidence (specific project metrics, dates, and outcomes).',
    'Keep your application tracker updated in your AtlasFind dashboard to monitor submission milestones.',
  ];

  return {
    opportunityTitle,
    deadline: deadline.toISOString().split('T')[0],
    daysRemaining,
    urgencyLevel,
    milestones,
    strategicAdvice: advice,
  };
}

