/**
 * AtlasFind - Centralized Opportunity Lifecycle & Deadline Management
 *
 * Authoritative lifecycle evaluation, timezone-aware deadline normalization,
 * button state determination, and badge formatting across Discovery, Opportunity Details,
 * Search, Saved Opportunities, Kanban Tracker, and AI Chat.
 *
 * The Six Canonical Lifecycle States:
 * 1. OPEN: Confirmed future deadline (>14 days), actively accepting applications.
 * 2. CLOSING_SOON: Confirmed future deadline (<=14 days or today), urgent indicators active.
 * 3. CLOSED: Deadline has passed OR opportunity marked explicitly closed.
 * 4. UPCOMING: Opening date (opensDate) is in the future; applications not yet accepted.
 * 5. ROLLING_INTAKE: Verified rolling admissions confirmed by official source. Active application link.
 * 6. UNCONFIRMED: Deadline is unknown, missing, or unverified. Never claimed as definitely open;
 *    displays warning badge and 'Check Official Website' action.
 */

export type LifecycleStatus =
  | 'OPEN'
  | 'CLOSING_SOON'
  | 'CLOSED'
  | 'UPCOMING'
  | 'ROLLING_INTAKE'
  | 'UNCONFIRMED';

export interface OpportunityLifecycleInput {
  id?: string;
  deadline?: string | Date | null;
  opensDate?: string | Date | null;
  startDate?: string | Date | null;
  isRolling?: boolean;
  status?: string | null; // e.g. 'open', 'closed', 'upcoming', 'rolling', 'archived'
  verificationStatus?: string | null; // 'verified', 'unverified', etc.
  publishedTimezone?: string | null; // e.g. 'Europe/London', 'America/New_York', 'UTC'
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
  isUnconfirmed: boolean;
  daysRemaining: number | null;
  rawDeadline: string | Date | null;
  normalizedDeadline: Date | null;
  publishedTimezone: string | null;
  dateOnlyPolicyApplied: boolean;
  formattedDeadline: string;
  badgeText: string;
  badgeStyle: 'open' | 'urgent' | 'closed' | 'upcoming' | 'rolling' | 'neutral';
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
 *
 * Documented Date-Only Policy:
 * When an opportunity source specifies a deadline date without an explicit time-of-day
 * or timezone (date-only format YYYY-MM-DD or midnight UTC T00:00:00Z), AtlasFind
 * normalizes the cutoff timestamp to the END OF THAT CALENDAR DAY: 23:59:59.999 UTC.
 * This guarantees that candidates are not prematurely cut off at 00:00:00 on the day
 * the application is published as due.
 */
export function normalizeDeadlineDate(
  deadline: string | Date | null | undefined,
  publishedTimezone?: string | null
): { normalized: Date | null; isDateOnly: boolean; timezoneUsed: string | null } {
  if (!deadline) {
    return { normalized: null, isDateOnly: false, timezoneUsed: null };
  }

  if (deadline instanceof Date) {
    if (isNaN(deadline.getTime())) {
      return { normalized: null, isDateOnly: false, timezoneUsed: null };
    }
    // If exact midnight UTC, adjust to end-of-day UTC
    const isMidnight =
      deadline.getUTCHours() === 0 &&
      deadline.getUTCMinutes() === 0 &&
      deadline.getUTCSeconds() === 0 &&
      deadline.getUTCMilliseconds() === 0;

    if (isMidnight) {
      const d = new Date(deadline);
      d.setUTCHours(23, 59, 59, 999);
      return { normalized: d, isDateOnly: true, timezoneUsed: publishedTimezone || 'UTC (End of Day)' };
    }
    return { normalized: deadline, isDateOnly: false, timezoneUsed: publishedTimezone || 'UTC' };
  }

  const trimmed = String(deadline).trim();
  if (!trimmed) {
    return { normalized: null, isDateOnly: false, timezoneUsed: null };
  }

  // Check for date-only formats: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const endOfDay = new Date(`${trimmed}T23:59:59.999Z`);
    return {
      normalized: endOfDay,
      isDateOnly: true,
      timezoneUsed: publishedTimezone || 'UTC (Date-Only EOD)',
    };
  }

  // Check for ISO strings with midnight UTC
  if (trimmed.endsWith('T00:00:00.000Z') || trimmed.endsWith('T00:00:00Z')) {
    const datePart = trimmed.slice(0, 10);
    const endOfDay = new Date(`${datePart}T23:59:59.999Z`);
    return {
      normalized: endOfDay,
      isDateOnly: true,
      timezoneUsed: publishedTimezone || 'UTC (Date-Only EOD)',
    };
  }

  const parsed = new Date(trimmed);
  if (isNaN(parsed.getTime())) {
    return { normalized: null, isDateOnly: false, timezoneUsed: null };
  }

  const isMidnight =
    parsed.getUTCHours() === 0 &&
    parsed.getUTCMinutes() === 0 &&
    parsed.getUTCSeconds() === 0 &&
    parsed.getUTCMilliseconds() === 0;

  if (isMidnight) {
    parsed.setUTCHours(23, 59, 59, 999);
    return { normalized: parsed, isDateOnly: true, timezoneUsed: publishedTimezone || 'UTC (Date-Only EOD)' };
  }

  return { normalized: parsed, isDateOnly: false, timezoneUsed: publishedTimezone || 'UTC' };
}

/**
 * Assesses complete lifecycle health for an opportunity according to the 6 canonical states.
 */
export function evaluateOpportunityLifecycle(
  input: OpportunityLifecycleInput,
  referenceDate: Date = new Date()
): OpportunityLifecycleInfo {
  const { isRolling, status, explicitlyClosed, verificationStatus, publishedTimezone } = input;
  const now = referenceDate;

  // 1. Explicitly Closed or status === 'closed'
  if (explicitlyClosed || status?.toLowerCase() === 'closed') {
    return {
      status: 'CLOSED',
      legacyStatus: 'EXPIRED',
      isClosed: true,
      isOpen: false,
      isClosingSoon: false,
      isUpcoming: false,
      isRolling: false,
      isUnconfirmed: false,
      daysRemaining: -1,
      rawDeadline: input.deadline ?? null,
      normalizedDeadline: input.deadline ? new Date(input.deadline) : null,
      publishedTimezone: publishedTimezone || null,
      dateOnlyPolicyApplied: false,
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

  // 2. Verified Rolling Intake
  // Must be verified as rolling intake by official provider source
  const isVerifiedRolling = Boolean(isRolling || status?.toLowerCase() === 'rolling') && (verificationStatus !== 'unverified');
  if (isVerifiedRolling) {
    return {
      status: 'ROLLING_INTAKE',
      legacyStatus: 'ACTIVE',
      isClosed: false,
      isOpen: true,
      isClosingSoon: false,
      isUpcoming: false,
      isRolling: true,
      isUnconfirmed: false,
      daysRemaining: null,
      rawDeadline: input.deadline ?? null,
      normalizedDeadline: null,
      publishedTimezone: null,
      dateOnlyPolicyApplied: false,
      formattedDeadline: 'Rolling Admissions',
      badgeText: 'Rolling Intake',
      badgeStyle: 'rolling',
      canApply: true,
      applyButton: {
        label: 'Apply Now (Rolling)',
        disabled: false,
        style: 'primary',
      },
      notice: 'Verified rolling admissions: applications are reviewed on an ongoing basis until capacity is filled.',
    };
  }

  // 3. Unconfirmed Opportunity (missing deadline, unverified date, or pending audit)
  // NEVER describe an unknown deadline as a verified rolling intake!
  if (!input.deadline) {
    return {
      status: 'UNCONFIRMED',
      legacyStatus: 'ACTIVE',
      isClosed: false,
      isOpen: false, // Not definitely open
      isClosingSoon: false,
      isUpcoming: false,
      isRolling: false,
      isUnconfirmed: true,
      daysRemaining: null,
      rawDeadline: null,
      normalizedDeadline: null,
      publishedTimezone: null,
      dateOnlyPolicyApplied: false,
      formattedDeadline: 'Deadline Unconfirmed',
      badgeText: 'Unconfirmed',
      badgeStyle: 'neutral',
      canApply: false,
      applyButton: {
        label: 'Check Official Website',
        disabled: false,
        style: 'secondary',
      },
      notice: '⚠️ Application dates unconfirmed by official authority. Please check the official provider website for current cycle details.',
    };
  }

  const { normalized: deadlineDate, isDateOnly, timezoneUsed } = normalizeDeadlineDate(
    input.deadline,
    publishedTimezone
  );

  if (!deadlineDate) {
    return {
      status: 'UNCONFIRMED',
      legacyStatus: 'ACTIVE',
      isClosed: false,
      isOpen: false,
      isClosingSoon: false,
      isUpcoming: false,
      isRolling: false,
      isUnconfirmed: true,
      daysRemaining: null,
      rawDeadline: input.deadline,
      normalizedDeadline: null,
      publishedTimezone: null,
      dateOnlyPolicyApplied: false,
      formattedDeadline: 'Invalid / Unconfirmed Date',
      badgeText: 'Unconfirmed',
      badgeStyle: 'neutral',
      canApply: false,
      applyButton: {
        label: 'Check Official Website',
        disabled: false,
        style: 'secondary',
      },
      notice: '⚠️ Application dates unconfirmed. Check official website.',
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

  // 4. Closed (Deadline has passed)
  if (diffMs <= 0 || calendarDiffDays < 0) {
    return {
      status: 'CLOSED',
      legacyStatus: 'EXPIRED',
      isClosed: true,
      isOpen: false,
      isClosingSoon: false,
      isUpcoming: false,
      isRolling: false,
      isUnconfirmed: false,
      daysRemaining: calendarDiffDays < 0 ? calendarDiffDays : -1,
      rawDeadline: input.deadline,
      normalizedDeadline: deadlineDate,
      publishedTimezone: timezoneUsed,
      dateOnlyPolicyApplied: isDateOnly,
      formattedDeadline: formattedDate,
      badgeText: 'Closed',
      badgeStyle: 'closed',
      canApply: false,
      applyButton: {
        label: 'Applications Closed',
        disabled: true,
        style: 'disabled',
      },
      notice: `The application deadline for this cycle passed on ${formattedDate}. Check official website for next intake cycles.`,
    };
  }

  // 5. Upcoming (opensDate in future)
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
        isUnconfirmed: false,
        daysRemaining: calendarDiffDays,
        rawDeadline: input.deadline,
        normalizedDeadline: deadlineDate,
        publishedTimezone: timezoneUsed,
        dateOnlyPolicyApplied: isDateOnly,
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

  // 6. Closing Soon (<= 14 days or today)
  if (calendarDiffDays <= 14) {
    const dayLabel = calendarDiffDays === 0
      ? 'Closes Today'
      : calendarDiffDays === 1
      ? 'Closes Tomorrow'
      : `Closes in ${calendarDiffDays} days`;

    return {
      status: 'CLOSING_SOON',
      legacyStatus: 'CLOSING_SOON',
      isClosed: false,
      isOpen: true,
      isClosingSoon: true,
      isUpcoming: false,
      isRolling: false,
      isUnconfirmed: false,
      daysRemaining: calendarDiffDays,
      rawDeadline: input.deadline,
      normalizedDeadline: deadlineDate,
      publishedTimezone: timezoneUsed,
      dateOnlyPolicyApplied: isDateOnly,
      formattedDeadline: formattedDate,
      badgeText: dayLabel,
      badgeStyle: 'urgent',
      canApply: true,
      applyButton: {
        label: 'Apply Now',
        disabled: false,
        style: 'urgent',
      },
      notice: `Urgent: deadline closes on ${formattedDate} (${calendarDiffDays === 0 ? 'less than 24 hours remaining' : `in ${calendarDiffDays} days`}). Submit your application promptly.`,
    };
  }

  // 7. Open (> 14 days)
  return {
    status: 'OPEN',
    legacyStatus: 'ACTIVE',
    isClosed: false,
    isOpen: true,
    isClosingSoon: false,
    isUpcoming: false,
    isRolling: false,
    isUnconfirmed: false,
    daysRemaining: calendarDiffDays,
    rawDeadline: input.deadline,
    normalizedDeadline: deadlineDate,
    publishedTimezone: timezoneUsed,
    dateOnlyPolicyApplied: isDateOnly,
    formattedDeadline: formattedDate,
    badgeText: 'Applications Open',
    badgeStyle: 'open',
    canApply: true,
    applyButton: {
      label: 'Apply Now',
      disabled: false,
      style: 'primary',
    },
    notice: `Verified open: accepting applications until ${formattedDate}.`,
  };
}
