export interface ApplicationFormFields {
  step: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  transcriptName: string;
  idProofName: string;
  statementName: string;
}

export interface ApplicationSubmitPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  documents: {
    transcriptName: string;
    idProofName: string;
    statementName: string;
  };
}

export interface SubmitResponse {
  success?: boolean;
  applicationId?: string;
  id?: number | string;
  message?: string;
}

export const INITIAL_APPLICATION_FORM: ApplicationFormFields = {
  step: 1,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dob: '',
  transcriptName: '',
  idProofName: '',
  statementName: '',
};
