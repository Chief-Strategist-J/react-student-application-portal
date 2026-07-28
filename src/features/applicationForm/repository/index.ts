import { httpPost } from '../../../shared/api/httpClient';
import { ENDPOINTS } from '../../../shared/config';
import type { ApplicationSubmitPayload, SubmitResponse } from '../types';

export async function submitApplicationApi(payload: ApplicationSubmitPayload): Promise<SubmitResponse> {
  return httpPost<SubmitResponse, ApplicationSubmitPayload>(ENDPOINTS.SUBMIT_APPLICATION, payload);
}
