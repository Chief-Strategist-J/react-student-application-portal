import { createListSlice } from '../../shared/store/createListSlice';
import type { ApplicationFormFields } from './types';
import { INITIAL_APPLICATION_FORM } from './types';

export const applicationSlice = createListSlice<unknown, ApplicationFormFields>(
  'application',
  INITIAL_APPLICATION_FORM
);

export const applicationActions = applicationSlice.actions;
export const applicationReducer = applicationSlice.reducer;
