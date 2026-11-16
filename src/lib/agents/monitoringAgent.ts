/**
 * Agent F: Opportunity Monitoring Assistant
 *
 * Monitors opportunities for deadline urgency, lifecycle transitions
 * (active -> closing soon -> expired), link integrity, and updates.
 */

export interface OpportunityStatusHealth {
  opportunityId: string;
  lifecycleStatus: 'ACTIVE' | 'CLOSING_SOON' | 'EXPIRED' | 'UPCOMING';
  daysUntilDeadline: number;
  isUrgent: boolean;
  actionRequired: string;
}

export function assessOpportunityDeadlineHealth(
  opportunityId: string,
  deadline: string | Date,
  opensDate?: string | Date | null
): OpportunityStatusHealth {
  const now = new Date();
  const dDate = new Date(deadline);
  const diffDays = Math.ceil((dDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      opportunityId,
      lifecycleStatus: 'EXPIRED',
      daysUntilDeadline: diffDays,
      isUrgent: false,
      actionRequired: 'Applications closed. Check historical cycle for next intake window.',
    };
  }

  if (opensDate) {
    const oDate = new Date(opensDate);
    if (now < oDate) {
      return {
        opportunityId,
        lifecycleStatus: 'UPCOMING',
        daysUntilDeadline: diffDays,
        isUrgent: false,
        actionRequired: `Applications open on ${oDate.toISOString().split('T')[0]}. Prepare your materials in advance.`,
      };
    }
  }

  if (diffDays <= 14) {
    return {
      opportunityId,
      lifecycleStatus: 'CLOSING_SOON',
      daysUntilDeadline: diffDays,
      isUrgent: true,
      actionRequired: `Deadline in ${diffDays} day(s). Finalize recommendations and submit immediately.`,
    };
  }

  return {
    opportunityId,
    lifecycleStatus: 'ACTIVE',
    daysUntilDeadline: diffDays,
    isUrgent: false,
    actionRequired: `Accepting applications until ${dDate.toISOString().split('T')[0]}.`,
  };
}

