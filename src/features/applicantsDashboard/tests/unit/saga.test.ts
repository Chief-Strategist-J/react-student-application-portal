import { describe, it, expect, vi } from 'vitest';
import { runSaga } from 'redux-saga';
import { applicantsActions } from '../../slice';
import { handleFetchApplicants } from '../../saga';
import type { Applicant } from '../../types';
import * as repository from '../../repository';

vi.mock('../../../../shared/logger', () => ({
  createLogger: () => ({ debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }),
}));

vi.mock('../../repository', () => ({
  fetchApplicantsApi: vi.fn(),
}));

const mockApplicants: Applicant[] = [
  {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    company: { name: 'Romaguera-Crona' },
    status: 'Pending',
  },
  {
    id: 2,
    name: 'Ervin Howell',
    username: 'Antonette',
    email: 'Shanna@melissa.tv',
    phone: '010-692-6593 x09125',
    website: 'anastasia.net',
    company: { name: 'Deckow-Crist' },
    status: 'Under Review',
  },
];

describe('applicantsDashboard/saga — handleFetchApplicants', () => {
  it('dispatches fetchSuccess with mapped applicants on success', async () => {
    const dispatched: unknown[] = [];

    vi.mocked(repository.fetchApplicantsApi).mockResolvedValue(mockApplicants);

    await runSaga(
      { dispatch: (action) => dispatched.push(action), getState: () => ({}) },
      handleFetchApplicants,
    ).toPromise();

    const successAction = dispatched.find(
      (a: any) => a.type === applicantsActions.fetchSuccess.type
    ) as any;
    expect(successAction).toBeDefined();
    expect(successAction.payload.items).toHaveLength(2);
    expect(successAction.payload.total).toBe(2);
  });

  it('dispatches fetchFailure with message on API error', async () => {
    const dispatched: unknown[] = [];

    vi.mocked(repository.fetchApplicantsApi).mockRejectedValue(new Error('Network failure'));

    await runSaga(
      { dispatch: (action) => dispatched.push(action), getState: () => ({}) },
      handleFetchApplicants,
    ).toPromise();

    const failAction = dispatched.find(
      (a: any) => a.type === applicantsActions.fetchFailure.type
    ) as any;
    expect(failAction).toBeDefined();
    expect(typeof failAction.payload).toBe('string');
  });
});
