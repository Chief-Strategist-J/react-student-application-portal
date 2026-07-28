import React, { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../shared/store/hooks';
import { applicationActions } from './slice';
import { uiActions } from '../../shared/store/uiSlice';
import type { ApplicationFormFields } from './types';
import { validateStep1, isStep1Valid, loadDraft, saveDraft } from './service';

export function useApplicationFormController() {
  const dispatch = useAppDispatch();
  const formFields = useAppSelector((s) => s.application.formFields as ApplicationFormFields);
  const saving = useAppSelector((s) => s.application.saving);
  const localError = useAppSelector((s) => s.application.localError);
  const successMessage = useAppSelector((s) => s.application.successMessage);

  const [errors, setErrors] = React.useState<Record<string, string | undefined>>({});

  useEffect(() => {
    const draft = loadDraft();
    if (draft) dispatch(applicationActions.setFormFields(draft));
  }, [dispatch]);

  useEffect(() => {
    saveDraft(formFields);
  }, [formFields]);

  const updateField = useCallback(
    (key: keyof ApplicationFormFields, value: string | number) => {
      dispatch(applicationActions.updateFormField({ key, value }));
      setErrors((prev) => ({ ...prev, [key]: '' }));
    },
    [dispatch],
  );

  const handleNext = useCallback(() => {
    if (formFields.step === 1) {
      const errs = validateStep1(formFields);
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;
    }
    if (formFields.step < 3) updateField('step', formFields.step + 1);
  }, [formFields, updateField]);

  const handleBack = useCallback(() => {
    if (formFields.step > 1) updateField('step', formFields.step - 1);
  }, [formFields.step, updateField]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isStep1Valid(formFields)) dispatch(applicationActions.saveRequest(undefined));
    },
    [dispatch, formFields],
  );

  const handleFileChange = useCallback(
    (key: keyof ApplicationFormFields, e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) updateField(key, e.target.files[0].name);
    },
    [updateField],
  );

  const handleReturnToDashboard = useCallback(() => {
    dispatch(applicationActions.resetForm(undefined));
    dispatch(uiActions.setCurrentTab('dashboard'));
  }, [dispatch]);

  return {
    formFields,
    saving,
    localError,
    successMessage,
    errors,
    updateField,
    handleNext,
    handleBack,
    handleSubmit,
    handleFileChange,
    handleReturnToDashboard,
  };
}
