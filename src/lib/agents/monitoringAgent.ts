/**
 * Agent F: Opportunity Monitoring Assistant
 *
 * Monitors opportunities for deadline urgency, lifecycle transitions
 * (active -> closing soon -> expired / closed), link integrity, and updates.
 */

import { evaluateOpportunityLifecycle, normalizeDeadlineDate, LifecycleStatus } from '../opportunity/lifecycle.ts';

export interface OpportunityStatusHealth {
  opportunityId: string;
  lifecycleStatus: 'ACTIVE' | 'CLOSING_SOON' | 'EXPIRED' | 'UPCOMING';
  status?: LifecycleStatus;
  daysUntilDeadline: number;
  isUrgent: boolean;
  actionRequired: string;
}

export function assessOpportunityDeadlineHealth(
  opportunityId: string,
  deadline: string | Date,
  opensDate?: string | Date | null
): OpportunityStatusHealth {
  const assessment = evaluateOpportunityLifecycle({
    id: opportunityId,
    deadline,
    opensDate,
  });

  return {
    opportunityId,
    lifecycleStatus: assessment.legacyStatus,
    status: assessment.status,
    daysUntilDeadline: assessment.daysRemaining ?? 0,
    isUrgent: assessment.isClosingSoon,
    actionRequired: assessment.notice || assessment.applyButton.label,
  };
}
