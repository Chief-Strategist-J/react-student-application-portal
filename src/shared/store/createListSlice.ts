import { createSlice, type PayloadAction, type Slice } from '@reduxjs/toolkit';

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ListUiState<T, F extends object = Record<string, unknown>> {
  items: T[];
  status: RequestStatus;
  error: string | null;
  searchQuery: string;
  sortBy: string | null;
  sortOrder: 'asc' | 'desc';
  formFields: F;
  saving: boolean;
  localError: string | null;
  successMessage: string | null;
}

export function createListSlice<T, F extends object = Record<string, unknown>>(
  name: string,
  initialFormFields: F
): Slice<ListUiState<T, F>> {
  const initialState: ListUiState<T, F> = {
    items: [],
    status: 'idle',
    error: null,
    searchQuery: '',
    sortBy: null,
    sortOrder: 'asc',
    formFields: initialFormFields,
    saving: false,
    localError: null,
    successMessage: null,
  };

  return createSlice({
    name,
    initialState,
    reducers: {
      fetchRequest(state, _action: PayloadAction<void | undefined>) {
        state.status = 'loading';
        state.error = null;
      },
      fetchSuccess(state, action: PayloadAction<T[] | { items: T[]; total?: number }>) {
        state.status = 'succeeded';
        state.error = null;
        if (Array.isArray(action.payload)) {
          state.items = action.payload as any;
        } else if (action.payload && Array.isArray(action.payload.items)) {
          state.items = action.payload.items as any;
        } else {
          state.items = [] as any;
        }
      },
      fetchFailure(state, action: PayloadAction<string>) {
        state.status = 'failed';
        state.error = action.payload;
        state.items = [] as any;
      },
      setSearchQuery(state, action: PayloadAction<string>) {
        state.searchQuery = action.payload;
      },
      setSort(state, action: PayloadAction<{ sortBy: string; sortOrder?: 'asc' | 'desc' }>) {
        if (state.sortBy === action.payload.sortBy) {
          state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          state.sortBy = action.payload.sortBy;
          state.sortOrder = action.payload.sortOrder ?? 'asc';
        }
      },
      updateFormField(state, action: PayloadAction<{ key: keyof F; value: any }>) {
        (state.formFields as any)[action.payload.key] = action.payload.value;
      },
      setFormFields(state, action: PayloadAction<Partial<F>>) {
        state.formFields = { ...state.formFields, ...action.payload } as any;
      },
      resetForm(state, _action: PayloadAction<void | undefined>) {
        state.formFields = initialFormFields as any;
        state.saving = false;
        state.localError = null;
        state.successMessage = null;
      },
      saveRequest(state, _action: PayloadAction<void | undefined>) {
        state.saving = true;
        state.localError = null;
        state.successMessage = null;
      },
      saveSuccess(state, action: PayloadAction<string | { message: string; item?: T }>) {
        state.saving = false;
        state.localError = null;
        if (typeof action.payload === 'string') {
          state.successMessage = action.payload;
        } else if (action.payload) {
          state.successMessage = action.payload.message;
          if (action.payload.item) {
            state.items.unshift(action.payload.item as any);
          }
        }
      },
      saveFailure(state, action: PayloadAction<string>) {
        state.saving = false;
        state.localError = action.payload;
      },
      setLocalError(state, action: PayloadAction<string>) {
        state.localError = action.payload;
      },
      setSuccessMessage(state, action: PayloadAction<string>) {
        state.successMessage = action.payload;
      },
    },
  });
}
