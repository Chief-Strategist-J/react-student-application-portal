import { describe, it, expect, vi, afterEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { applicantsReducer, applicantsActions } from '../../slice';
import { applicantsSaga } from '../../saga';

vi.mock('../../../../shared/logger', () => ({
  createLogger: () => ({ debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }),
}));

const makeMockUsers = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    username: `user${i + 1}`,
    email: `user${i + 1}@test.com`,
    phone: '000',
    website: 'test.com',
    company: { name: `Company ${i + 1}` },
  }));

function buildStore() {
  const sagaMiddleware = createSagaMiddleware();
  const store = configureStore({
    reducer: { applicants: applicantsReducer },
    middleware: (getDefault) => getDefault({ thunk: false }).concat(sagaMiddleware),
  });
  sagaMiddleware.run(applicantsSaga);
  return store;
}

describe('ApplicantsDashboard — full store integration', () => {
  afterEach(() => vi.restoreAllMocks());

  it('goes idle → loading → succeeded with 10 items', async () => {
    const mockUsers = makeMockUsers(10);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => mockUsers,
    }));

    const store = buildStore();
    expect(store.getState().applicants.status).toBe('idle');

    store.dispatch(applicantsActions.fetchRequest(undefined));
    expect(store.getState().applicants.status).toBe('loading');


    await new Promise((r) => setTimeout(r, 50));

    const state = store.getState().applicants;
    expect(state.status).toBe('succeeded');
    expect(state.items).toHaveLength(10);
    expect(state.items[0].name).toBe('User 1');

    expect(state.items[0].status).toBe('Pending');
    expect(state.items[1].status).toBe('Under Review');
    expect(state.items[2].status).toBe('Approved');
    expect(state.items[3].status).toBe('Waitlisted');
    expect(state.items[4].status).toBe('Pending');
  });

  it('goes idle → loading → failed on network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Network failure')));
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true, configurable: true });

    const store = buildStore();
    store.dispatch(applicantsActions.fetchRequest(undefined));
    await new Promise((r) => setTimeout(r, 50));

    const state = store.getState().applicants;
    expect(state.status).toBe('failed');
    expect(typeof state.error).toBe('string');
    expect(state.items).toEqual([]);

    Object.defineProperty(navigator, 'onLine', { value: true, writable: true, configurable: true });
  });

  it('saveSuccess prepends new applicant to list', async () => {
    const mockUsers = makeMockUsers(2);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true, status: 200, statusText: 'OK',
      json: async () => mockUsers,
    }));

    const store = buildStore();
    store.dispatch(applicantsActions.fetchRequest(undefined));
    await new Promise((r) => setTimeout(r, 50));

    store.dispatch(applicantsActions.saveSuccess({
      message: 'Added',
      item: { id: 99, name: 'New Person', username: 'newp', email: 'n@p.com', phone: '0', website: 'n.com', status: 'Under Review' },
    }));

    expect(store.getState().applicants.items[0].name).toBe('New Person');
    expect(store.getState().applicants.items).toHaveLength(3);
  });
});
