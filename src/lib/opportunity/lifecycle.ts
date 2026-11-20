/**
 * AtlasFind - Centralized Opportunity Lifecycle & Deadline Management
 *
 * Provides authoritative lifecycle assessment, timezone-aware deadline normalization,
 * button state determination, and badge formatting across Discovery, Opportunity Details,
 * Search, Saved Opportunities, Kanban Tracker, and AI Chat.
 *
 * Canonical Lifecycle States:
 * - OPEN: Deadline is in the future (>14 days), accepting applications.
 * - CLOSING_SOON: Deadline in <= 14 days, urgent indicators active.
 * - CLOSED: Deadline has passed OR opportunity marked explicitly closed.
 * - UPCOMING: Applications not yet open (opensDate in future).
 * - UNCONFIRMED: Rolling deadline, predicted intake, or unconfirmed dates.
 */

export type LifecycleStatus = 'OPEN' | 'CLOSING_SOON' | 'CLOSED' | 'UPCOMING' | 'UNCONFIRMED';

export interface OpportunityLifecycleInput {
  id?: string;
  deadline?: string | Date | null;
  opensDate?: string | Date | null;
  startDate?: string | Date | null;
  isRolling?: boolean;
  status?: string | null; // e.g. 'open', 'closed', 'upcoming', 'rolling', 'archived'
  explicitlyClosed?: boolean;
}

export interface OpportunityLifecycleInfo {
  status: LifecycleStatus;
  legacyStatus: 'ACTIVE' | 'CLOSING_SOON' | 'EXPIRED' | 'UPCOMING';
  isClosed: boolean;
  isOpen: boolean;
  isClosingSoon: boolean;
  isUpcoming: boolean;
  isRolling: boolean;
  daysRemaining: number | null;
  normalizedDeadline: Date | null;
  formattedDeadline: string;
  badgeText: string;
  badgeStyle: 'open' | 'urgent' | 'closed' | 'upcoming' | 'neutral';
  canApply: boolean;
  applyButton: {
    label: string;
    disabled: boolean;
    style: 'primary' | 'urgent' | 'disabled' | 'secondary' | 'upcoming';
  };
  notice: string | null;
}

/**
 * Normalizes deadline strings and dates to handle timezone and date-only boundaries.
 * If a date is provided without explicit non-zero time (e.g. '2026-11-20' or '2026-11-20T00:00:00.000Z'),
 * it is evaluated as valid through the END OF THE DAY (23:59:59.999 UTC) so applicants
 * are not cut off at midnight on the day the deadline is scheduled.
 */
export function normalizeDeadlineDate(deadline: string | Date | null | undefined): Date | null {
  if (!deadline) return null;
  if (deadline instanceof Date) {
    if (isNaN(deadline.getTime())) return null;
    // If exact midnight UTC, adjust to end-of-day
    if (
      deadline.getUTCHours() === 0 &&
      deadline.getUTCMinutes() === 0 &&
      deadline.getUTCSeconds() === 0 &&
      deadline.getUTCMilliseconds() === 0
    ) {
      const d = new Date(deadline);
      d.setUTCHours(23, 59, 59, 999);
      return d;
    }
    return deadline;
  }

  const trimmed = String(deadline).trim();
  if (!trimmed) return null;

  // Check for date-only formats: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return new Date(`${trimmed}T23:59:59.999Z`);
  }

  // Check for ISO strings with midnight UTC
  if (trimmed.endsWith('T00:00:00.000Z') || trimmed.endsWith('T00:00:00Z')) {
    const datePart = trimmed.slice(0, 10);
    return new Date(`${datePart}T23:59:59.999Z`);
  }

  const parsed = new Date(trimmed);
  if (isNaN(parsed.getTime())) return null;

  if (
    parsed.getUTCHours() === 0 &&
    parsed.getUTCMinutes() === 0 &&
    parsed.getUTCSeconds() === 0 &&
    parsed.getUTCMilliseconds() === 0
  ) {
    parsed.setUTCHours(23, 59, 59, 999);
  }
  return parsed;
}

/**
 * Assesses complete lifecycle health for an opportunity.
 */
export function evaluateOpportunityLifecycle(
  input: OpportunityLifecycleInput,
  referenceDate: Date = new Date()
): OpportunityLifecycleInfo {
  const { isRolling, status, explicitlyClosed } = input;
  const now = referenceDate;

  // 1. Check for explicitly closed status
  if (explicitlyClosed || status?.toLowerCase() === 'closed') {
    return {
      status: 'CLOSED',
      legacyStatus: 'EXPIRED',
      isClosed: true,
      isOpen: false,
      isClosingSoon: false,
      isUpcoming: false,
      isRolling: false,
      daysRemaining: -1,
      normalizedDeadline: input.deadline ? new Date(input.deadline) : null,
      formattedDeadline: input.deadline ? new Date(input.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Closed',
      badgeText: 'Closed',
      badgeStyle: 'closed',
      canApply: false,
      applyButton: {
        label: 'Applications Closed',
        disabled: true,
        style: 'disabled',
      },
      notice: 'Applications have officially closed for this cycle.',
    };
  }

  // 2. Check for rolling or unspecified deadline
  if (isRolling || !input.deadline) {
    return {
      status: 'UNCONFIRMED',
      legacyStatus: 'ACTIVE',
      isClosed: false,
      isOpen: true,
      isClosingSoon: false,
      isUpcoming: false,
      isRolling: true,
      daysRemaining: null,
      normalizedDeadline: null,
      formattedDeadline: 'Rolling / Open',
      badgeText: 'Rolling Intake',
      badgeStyle: 'neutral',
      canApply: true,
      applyButton: {
        label: 'Apply Now (Rolling)',
        disabled: false,
        style: 'primary',
      },
      notice: 'Rolling admissions: applications reviewed on an ongoing basis until filled.',
    };
  }

  const deadlineDate = normalizeDeadlineDate(input.deadline);
  if (!deadlineDate) {
    return {
      status: 'UNCONFIRMED',
      legacyStatus: 'ACTIVE',
      isClosed: false,
      isOpen: true,
      isClosingSoon: false,
      isUpcoming: false,
      isRolling: false,
      daysRemaining: null,
      normalizedDeadline: null,
      formattedDeadline: 'Date Unconfirmed',
      badgeText: 'Unconfirmed',
      badgeStyle: 'neutral',
      canApply: true,
      applyButton: {
        label: 'Check Official Portal',
        disabled: false,
        style: 'secondary',
      },
      notice: 'Official deadline not yet announced. Check provider portal for updates.',
    };
  }

  const nowCalendar = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const deadlineCalendar = new Date(Date.UTC(deadlineDate.getUTCFullYear(), deadlineDate.getUTCMonth(), deadlineDate.getUTCDate()));
  const calendarDiffDays = Math.round((deadlineCalendar.getTime() - nowCalendar.getTime()) / (1000 * 60 * 60 * 24));
  const diffMs = deadlineDate.getTime() - now.getTime();

  const formattedDate = deadlineDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // 3. Deadline has passed
  if (diffMs <= 0 || calendarDiffDays < 0) {
    return {
      status: 'CLOSED',
      legacyStatus: 'EXPIRED',
      isClosed: true,
      isOpen: false,
      isClosingSoon: false,
      isUpcoming: false,
      isRolling: false,
      daysRemaining: calendarDiffDays < 0 ? calendarDiffDays : -1,
      normalizedDeadline: deadlineDate,
      formattedDeadline: formattedDate,
      badgeText: 'Closed',
      badgeStyle: 'closed',
      canApply: false,
      applyButton: {
        label: 'Applications Closed',
        disabled: true,
        style: 'disabled',
      },
      notice: `The application deadline for this cycle passed on ${formattedDate}. Check the official website for next intake cycles.`,
    };
  }

  // 4. Check if opensDate is in the future
  if (input.opensDate) {
    const opensDate = new Date(input.opensDate);
    if (!isNaN(opensDate.getTime()) && now < opensDate) {
      const formattedOpenDate = opensDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      return {
        status: 'UPCOMING',
        legacyStatus: 'UPCOMING',
        isClosed: false,
        isOpen: false,
        isClosingSoon: false,
        isUpcoming: true,
        isRolling: false,
        daysRemaining: calendarDiffDays,
        normalizedDeadline: deadlineDate,
        formattedDeadline: formattedDate,
        badgeText: `Opens ${formattedOpenDate}`,
        badgeStyle: 'upcoming',
        canApply: false,
        applyButton: {
          label: `Opens ${formattedOpenDate}`,
          disabled: true,
          style: 'upcoming',
        },
        notice: `Applications open on ${formattedOpenDate}. Prepare your application materials in advance.`,
      };
    }
  }

  // 5. Closing soon (<= 14 days)
  if (calendarDiffDays <= 14) {
    const dayLabel = calendarDiffDays === 0
      ? 'Closes Today'
      : calendarDiffDays === 1
      ? 'Closes in 1 day'
      : `Closes in ${calendarDiffDays} days`;

    return {
      status: 'CLOSING_SOON',
      legacyStatus: 'CLOSING_SOON',
      isClosed: false,
      isOpen: true,
      isClosingSoon: true,
      isUpcoming: false,
      isRolling: false,
      daysRemaining: calendarDiffDays,
      normalizedDeadline: deadlineDate,
      formattedDeadline: formattedDate,
      badgeText: dayLabel,
      badgeStyle: 'urgent',
      canApply: true,
      applyButton: {
        label: 'Apply Now',
        disabled: false,
        style: 'urgent',
      },
      notice: `Urgent: deadline is approaching in ${calendarDiffDays === 0 ? 'less than 24 hours' : `${calendarDiffDays} days`}. Submit your application promptly.`,
    };
  }

  // 6. Active / Open
  return {
    status: 'OPEN',
    legacyStatus: 'ACTIVE',
    isClosed: false,
    isOpen: true,
    isClosingSoon: false,
    isUpcoming: false,
    isRolling: false,
    daysRemaining: calendarDiffDays,
    normalizedDeadline: deadlineDate,
    formattedDeadline: formattedDate,
    badgeText: 'Applications Open',
    badgeStyle: 'open',
    canApply: true,
    applyButton: {
      label: 'Apply Now',
      disabled: false,
      style: 'primary',
    },
    notice: `Accepting applications until ${formattedDate}.`,
  };
}
