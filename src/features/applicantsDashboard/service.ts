import type { Applicant } from './types';
import { APPLICANT_STATUSES } from '../../shared/config';
import { isEqualNormalized } from '../../shared/utils/normalizeKey';
import { createLogger } from '../../shared/logger';

const log = createLogger('applicantsDashboard/service');

export function filterAndSortApplicants(
  items: Applicant[],
  searchQuery: string,
  sortBy: string | null,
  sortOrder: 'asc' | 'desc',
): Applicant[] {
  log.debug('Filtering applicants', { count: items.length, searchQuery, sortBy, sortOrder });

  let result = [...items];

  const q = searchQuery.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (item) =>
        item.name?.toLowerCase().includes(q) ||
        item.username?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q) ||
        item.phone?.includes(q) ||
        item.website?.toLowerCase().includes(q) ||
        item.company?.name?.toLowerCase().includes(q) ||
        item.status?.toLowerCase().includes(q),
    );
  }

  if (sortBy) {
    result = [...result].sort((a, b) => {
      const getValue = (item: Applicant): string => {
        if (isEqualNormalized(sortBy, 'name'))    return item.name?.toLowerCase() ?? '';
        if (isEqualNormalized(sortBy, 'email'))   return item.email?.toLowerCase() ?? '';
        if (isEqualNormalized(sortBy, 'company')) return (item.company?.name ?? '').toLowerCase();
        if (isEqualNormalized(sortBy, 'status'))  return item.status?.toLowerCase() ?? '';
        return '';
      };
      const va = getValue(a);
      const vb = getValue(b);
      return sortOrder === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });
  }

  log.debug('Filter complete', { resultCount: result.length });
  return result;
}

export interface ApplicantStats {
  total: number;
  underReview: number;
  approved: number;
}

export function computeApplicantStats(items: Applicant[]): ApplicantStats {
  return {
    total: items.length,
    underReview: items.filter((i) => isEqualNormalized(i.status, APPLICANT_STATUSES.UNDER_REVIEW)).length,
    approved:    items.filter((i) => isEqualNormalized(i.status, APPLICANT_STATUSES.APPROVED)).length,
  };
}

export function getAvatarLetter(name?: string): string {
  return (name ?? 'U').charAt(0).toUpperCase();
}

export function resolveErrorState(error: string | null): 'TIMEOUT' | 'OFFLINE' | 'API_ERROR' {
  if (error?.includes('timed out')) return 'TIMEOUT';
  if (error?.includes('offline') || error?.includes('internet')) return 'OFFLINE';
  return 'API_ERROR';
}
