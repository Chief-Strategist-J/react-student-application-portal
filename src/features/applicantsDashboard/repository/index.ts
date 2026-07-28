import { httpGet } from '../../../shared/api/httpClient';
import { ENDPOINTS, APPLICANT_STATUSES } from '../../../shared/config';
import { createLogger } from '../../../shared/logger';
import type { Applicant } from '../types';

const log = createLogger('applicantsDashboard/repository');

const STATUSES: Applicant['status'][] = [
  APPLICANT_STATUSES.PENDING,
  APPLICANT_STATUSES.UNDER_REVIEW,
  APPLICANT_STATUSES.APPROVED,
  APPLICANT_STATUSES.WAITLISTED,
];

export async function fetchApplicantsApi(): Promise<Applicant[]> {
  log.info('Fetching applicants from API');
  const users = await httpGet<Applicant[]>(ENDPOINTS.USERS);
  const mapped = users.map((user, index) => ({
    ...user,
    status: STATUSES[index % STATUSES.length],
  }));
  log.info('Applicants fetched and mapped', { count: mapped.length });
  return mapped;
}
