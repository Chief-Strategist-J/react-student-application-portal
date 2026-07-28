import { describe, it, expect } from 'vitest';
import { applicantsReducer, applicantsActions } from '../../slice';
import type { Applicant } from '../../types';

const mockApplicant: Applicant = {
  id: 1,
  name: 'Leanne Graham',
  username: 'Bret',
  email: 'Sincere@april.biz',
  phone: '1-770-736-8031',
  website: 'hildegard.org',
  status: 'Pending',
};

describe('applicantsSlice', () => {
  const initialState = applicantsReducer(undefined, { type: '@@INIT' });

  it('starts with idle status and empty items', () => {
    expect(initialState.status).toBe('idle');
    expect(initialState.items).toEqual([]);
    expect(initialState.error).toBeNull();
  });

  it('fetchRequest sets status to loading', () => {
    const state = applicantsReducer(initialState, applicantsActions.fetchRequest(undefined));
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('fetchSuccess populates items and sets succeeded', () => {
    const state = applicantsReducer(
      initialState,
      applicantsActions.fetchSuccess({ items: [mockApplicant], total: 1 })
    );
    expect(state.status).toBe('succeeded');
    expect(state.items).toHaveLength(1);
    expect(state.items[0].name).toBe('Leanne Graham');
  });

  it('fetchFailure sets error message and failed status', () => {
    const state = applicantsReducer(
      initialState,
      applicantsActions.fetchFailure('Something went wrong')
    );
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Something went wrong');
    expect(state.items).toEqual([]);
  });

  it('setSearchQuery updates searchQuery', () => {
    const state = applicantsReducer(initialState, applicantsActions.setSearchQuery('leanne'));
    expect(state.searchQuery).toBe('leanne');
  });

  it('setSort toggles sortOrder when same column clicked twice', () => {
    const after1 = applicantsReducer(initialState, applicantsActions.setSort({ sortBy: 'name' }));
    expect(after1.sortBy).toBe('name');
    expect(after1.sortOrder).toBe('asc');
    const after2 = applicantsReducer(after1, applicantsActions.setSort({ sortBy: 'name' }));
    expect(after2.sortOrder).toBe('desc');
  });

  it('saveSuccess with item prepends to items list', () => {
    const withItems = applicantsReducer(
      initialState,
      applicantsActions.fetchSuccess({ items: [mockApplicant], total: 1 })
    );
    const newApplicant: Applicant = { ...mockApplicant, id: 99, name: 'New Person' };
    const state = applicantsReducer(
      withItems,
      applicantsActions.saveSuccess({ message: 'Added', item: newApplicant })
    );
    expect(state.items[0].name).toBe('New Person');
    expect(state.items).toHaveLength(2);
  });
});
