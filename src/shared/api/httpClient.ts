import { APP_CONFIG } from '../config';
import { withSpan } from '../tracing/tracer';
import { ApiError } from './apiError';

const DEFAULT_HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.api.timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if ((err as Error).name === 'AbortError') throw new ApiError(408, 'Request timed out', 'TIMEOUT');
    if (!navigator.onLine) throw new ApiError(0, 'No internet connection', 'OFFLINE');
    throw err;
  }
}

async function request<T>(method: string, endpoint: string, body?: unknown): Promise<T> {
  const url = `${APP_CONFIG.api.baseUrl}${endpoint}`;

  return withSpan(`HTTP ${method} ${endpoint}`, async (span) => {
    span.setAttribute('http.method', method);
    span.setAttribute('http.url', url);

    const response = await fetchWithTimeout(url, {
      method,
      headers: DEFAULT_HEADERS,
      ...(body !== undefined && { body: JSON.stringify(body) }),
    });

    span.setAttribute('http.status_code', response.status);

    if (!response.ok) throw new ApiError(response.status, response.statusText || 'API Error');

    return (await response.json()) as T;
  });
}

export const httpGet  = <T>(endpoint: string): Promise<T>              => request<T>('GET',  endpoint);
export const httpPost = <T, U>(endpoint: string, body: U): Promise<T>  => request<T>('POST', endpoint, body);
