import { createListSlice } from '../../shared/store/createListSlice';
import type { Applicant } from './types';

export const applicantsSlice = createListSlice<Applicant, Record<string, unknown>>('applicants', {});

export const applicantsActions = applicantsSlice.actions;
export const applicantsReducer = applicantsSlice.reducer;
