import { call, put, takeLatest, select } from 'redux-saga/effects';
import { applicationActions } from './slice';
import { applicantsActions } from '../applicantsDashboard/slice';
import { uiActions } from '../../shared/store/uiSlice';
import { submitApplicationApi } from './repository';
import type { ApplicationFormFields, SubmitResponse } from './types';
import type { Applicant } from '../applicantsDashboard/types';
import { ApiError } from '../../shared/api/apiError';
import { createLogger } from '../../shared/logger';

const log = createLogger('applicationForm/saga');

export function* handleSaveApplication(): Generator<any, void, any> {
  log.info('Submit application started');
  try {
    const formFields: ApplicationFormFields = yield select((state: any) => state.application.formFields);
    log.debug('Form fields captured', { email: formFields.email, firstName: formFields.firstName });

    const payload = {
      name: `${formFields.firstName || ''} ${formFields.lastName || ''}`.trim() || 'New Applicant',
      username: (formFields.firstName || 'applicant').toLowerCase(),
      email: formFields.email || '',
      phone: formFields.phone || '',
      website: 'edu-portal.univ.edu',
      company: { name: 'EduPortal Applicant' },
      status: 'Under Review' as const,
      documents: {
        transcriptName: formFields.transcriptName,
        idProofName: formFields.idProofName,
        statementName: formFields.statementName,
      },
    };

    const response: SubmitResponse = yield call(submitApplicationApi, payload as any);
    log.info('Submit application succeeded', { responseId: response.id });

    const parsedId =
      typeof response.id === 'number'
        ? response.id
        : typeof response.id === 'string'
        ? parseInt(response.id, 10) || Date.now()
        : Date.now();

    const newApplicant: Applicant = {
      id: parsedId,
      name: payload.name,
      username: payload.username,
      email: payload.email,
      phone: payload.phone,
      website: payload.website,
      company: payload.company,
      status: payload.status,
    };

    yield put(applicationActions.saveSuccess({ message: response.message || 'Application submitted successfully' }));
    yield put(applicantsActions.saveSuccess({ message: 'Added applicant', item: newApplicant }));
    yield put(uiActions.setCurrentTab('dashboard'));

    log.info('Application added to dashboard, redirecting', { applicantId: parsedId });
  } catch (error: unknown) {
    let errorMessage = 'Failed to submit application';
    if (error instanceof ApiError) {
      if (error.status === 408) errorMessage = 'Request timed out';
      else if (error.status === 0) errorMessage = 'No internet connection';
      else errorMessage = `HTTP Error ${error.status}: ${error.message}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    log.error('Submit application failed', { error: errorMessage });
    yield put(applicationActions.saveFailure(errorMessage));
  }
}

export function* applicationSaga(): Generator<any, void, any> {
  yield takeLatest(applicationActions.saveRequest.type, handleSaveApplication);
}
