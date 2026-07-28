import { describe, it, expect, vi, afterEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { applicationReducer, applicationActions } from '../../slice';
import { applicantsReducer } from '../../../applicantsDashboard/slice';
import { uiReducer } from '../../../../shared/store/uiSlice';
import { applicationSaga } from '../../saga';

vi.mock('../../../../shared/logger', () => ({
  createLogger: () => ({ debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }),
}));

function buildStore() {
  const sagaMiddleware = createSagaMiddleware();
  const store = configureStore({
    reducer: {
      application: applicationReducer,
      applicants: applicantsReducer,
      ui: uiReducer,
    },
    middleware: (getDefault) => getDefault({ thunk: false }).concat(sagaMiddleware),
  });
  sagaMiddleware.run(applicationSaga);
  return store;
}

describe('ApplicationForm — full store integration', () => {
  afterEach(() => vi.restoreAllMocks());

  it('successful submit: saving → success → dashboard redirect + applicant added', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      statusText: 'Created',
      json: async () => ({ id: 201, title: 'Application' }),
    }));

    const store = buildStore();


    store.dispatch(applicationActions.updateFormField({ key: 'firstName', value: 'Alice' }));
    store.dispatch(applicationActions.updateFormField({ key: 'lastName',  value: 'Smith' }));
    store.dispatch(applicationActions.updateFormField({ key: 'email',     value: 'alice@test.com' }));
    store.dispatch(applicationActions.updateFormField({ key: 'phone',     value: '9876543210' }));


    store.dispatch(applicationActions.saveRequest(undefined));
    expect(store.getState().application.saving).toBe(true);

    await new Promise((r) => setTimeout(r, 100));

    const appState = store.getState().application;
    expect(appState.saving).toBe(false);
    expect(appState.successMessage).toBeTruthy();
    expect(appState.localError).toBeNull();


    const applicants = store.getState().applicants.items;
    expect(applicants).toHaveLength(1);
    expect(applicants[0].name).toBe('Alice Smith');
    expect(applicants[0].status).toBe('Under Review');


    expect(store.getState().ui.currentTab).toBe('dashboard');
  });

  it('failed submit: shows error, stays on form, no applicant added', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({}),
    }));

    const store = buildStore();
    store.dispatch(applicationActions.updateFormField({ key: 'firstName', value: 'Bob' }));
    store.dispatch(applicationActions.saveRequest(undefined));

    await new Promise((r) => setTimeout(r, 100));

    const appState = store.getState().application;
    expect(appState.saving).toBe(false);
    expect(appState.localError).toBeTruthy();
    expect(appState.successMessage).toBeNull();

    expect(store.getState().applicants.items).toHaveLength(0);

    expect(store.getState().ui.currentTab).toBe('dashboard');
  });
});
