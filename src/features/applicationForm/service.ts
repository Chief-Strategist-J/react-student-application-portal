import { APP_CONFIG } from '../../shared/config';
import { createLogger } from '../../shared/logger';
import type { ApplicationFormFields } from './types';

const log = createLogger('applicationForm/service');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ValidationErrors {
  [key: string]: string | undefined;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dob?: string;
}

export function validateStep1(fields: ApplicationFormFields): ValidationErrors {
  log.debug('Validating step 1', { email: fields.email });

  const errors: ValidationErrors = {};

  if (!fields.firstName?.trim()) errors.firstName = 'First name is required.';
  if (!fields.lastName?.trim())  errors.lastName  = 'Last name is required.';

  if (!fields.email?.trim()) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_REGEX.test(fields.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  const phoneDigits = (fields.phone ?? '').replace(/\D/g, '');
  if (!fields.phone?.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (phoneDigits.length !== 10) {
    errors.phone = 'Please enter a valid 10-digit phone number.';
  }

  if (!fields.dob?.trim()) errors.dob = 'Date of birth is required.';

  const isValid = Object.keys(errors).length === 0;
  log.debug('Step 1 validation result', { isValid, errorFields: Object.keys(errors) });

  return errors;
}

export function isStep1Valid(fields: ApplicationFormFields): boolean {
  return Object.keys(validateStep1(fields)).length === 0;
}

export function loadDraft(): Partial<ApplicationFormFields> | null {
  try {
    const raw = localStorage.getItem(APP_CONFIG.storageKeys.applicationDraft);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ApplicationFormFields>;
    log.info('Draft loaded from localStorage');
    return parsed;
  } catch {
    log.warn('Failed to parse draft from localStorage');
    return null;
  }
}

export function saveDraft(fields: ApplicationFormFields): void {
  try {
    localStorage.setItem(APP_CONFIG.storageKeys.applicationDraft, JSON.stringify(fields));
  } catch {
    log.warn('Failed to save draft to localStorage');
  }
}

export function clearDraft(): void {
  localStorage.removeItem(APP_CONFIG.storageKeys.applicationDraft);
  log.info('Draft cleared from localStorage');
}
