import { describe, it, expect } from 'vitest';
import { applicationReducer, applicationActions } from '../../slice';

describe('applicationSlice', () => {
  const initialState = applicationReducer(undefined, { type: '@@INIT' });

  it('starts idle with empty form fields', () => {
    expect(initialState.saving).toBe(false);
    expect(initialState.localError).toBeNull();
    expect(initialState.successMessage).toBeNull();
    expect(initialState.formFields.firstName).toBe('');
    expect(initialState.formFields.step).toBe(1);
  });

  it('saveRequest sets saving=true and clears errors', () => {
    const state = applicationReducer(initialState, applicationActions.saveRequest(undefined));
    expect(state.saving).toBe(true);
    expect(state.localError).toBeNull();
    expect(state.successMessage).toBeNull();
  });

  it('saveSuccess sets successMessage and saving=false', () => {
    const state = applicationReducer(
      initialState,
      applicationActions.saveSuccess({ message: 'Submitted!' })
    );
    expect(state.saving).toBe(false);
    expect(state.successMessage).toBe('Submitted!');
  });

  it('saveFailure sets localError and saving=false', () => {
    const state = applicationReducer(
      initialState,
      applicationActions.saveFailure('Validation failed')
    );
    expect(state.saving).toBe(false);
    expect(state.localError).toBe('Validation failed');
  });

  it('updateFormField updates a single field', () => {
    const state = applicationReducer(
      initialState,
      applicationActions.updateFormField({ key: 'firstName', value: 'John' })
    );
    expect(state.formFields.firstName).toBe('John');
  });

  it('resetForm restores initial form fields', () => {
    const dirty = applicationReducer(
      initialState,
      applicationActions.updateFormField({ key: 'firstName', value: 'Jane' })
    );
    const reset = applicationReducer(dirty, applicationActions.resetForm(undefined));
    expect(reset.formFields.firstName).toBe('');
  });
});
