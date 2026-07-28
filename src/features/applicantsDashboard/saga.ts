import { call, put, takeLatest } from 'redux-saga/effects';
import { applicantsActions } from './slice';
import { fetchApplicantsApi } from './repository';
import type { Applicant } from './types';
import { ApiError } from '../../shared/api/apiError';
import { createLogger } from '../../shared/logger';

const log = createLogger('applicantsDashboard/saga');

export function* handleFetchApplicants(): Generator<any, void, any> {
  log.info('Fetch applicants started');
  try {
    const applicants: Applicant[] = yield call(fetchApplicantsApi);
    log.info('Fetch applicants succeeded', { count: applicants.length });
    yield put(applicantsActions.fetchSuccess({ items: applicants, total: applicants.length }));
  } catch (error: unknown) {
    let errorMessage = 'Failed to fetch applicants';
    if (error instanceof ApiError) {
      if (error.status === 408) errorMessage = 'Request timed out';
      else if (error.status === 0) errorMessage = 'No internet connection';
      else errorMessage = `HTTP Error ${error.status}: ${error.message}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    log.error('Fetch applicants failed', { error: errorMessage });
    yield put(applicantsActions.fetchFailure(errorMessage));
  }
}

export function* applicantsSaga(): Generator<any, void, any> {
  yield takeLatest(applicantsActions.fetchRequest.type, handleFetchApplicants);
}
