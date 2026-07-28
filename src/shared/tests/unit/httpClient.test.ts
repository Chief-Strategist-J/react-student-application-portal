import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';


vi.mock('../tracing/tracer', () => ({
  withSpan: async (_name: string, fn: (span: any) => Promise<unknown>) =>
    fn({ setAttribute: vi.fn(), setStatus: vi.fn(), recordException: vi.fn(), end: vi.fn() }),
}));

vi.mock('../logger', () => ({
  createLogger: () => ({ debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }),
}));

import { httpGet, httpPost } from '../../api/httpClient';
import { ApiError } from '../../api/apiError';

const mockFetch = (ok: boolean, data: unknown, status = 200) =>
  vi.fn().mockResolvedValue({
    ok,
    status,
    statusText: ok ? 'OK' : 'Not Found',
    json: async () => data,
  });

describe('httpClient', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
  });
  afterEach(() => vi.restoreAllMocks());

  describe('httpGet', () => {
    it('returns parsed JSON on 200', async () => {
      vi.stubGlobal('fetch', mockFetch(true, [{ id: 1 }]));
      const result = await httpGet<{ id: number }[]>('/users');
      expect(result).toEqual([{ id: 1 }]);
    });

    it('throws ApiError on non-ok response', async () => {
      vi.stubGlobal('fetch', mockFetch(false, null, 404));
      await expect(httpGet('/missing')).rejects.toBeInstanceOf(ApiError);
    });

    it('throws ApiError with OFFLINE code when navigator.onLine is false', async () => {
      Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('network error')));
      await expect(httpGet('/users')).rejects.toMatchObject({ status: 0 });
    });

    it('throws TIMEOUT ApiError on AbortError', async () => {
      const abortErr = Object.assign(new Error('aborted'), { name: 'AbortError' });
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(abortErr));
      await expect(httpGet('/slow')).rejects.toMatchObject({ status: 408 });
    });
  });

  describe('httpPost', () => {
    it('sends body and returns response', async () => {
      vi.stubGlobal('fetch', mockFetch(true, { id: 101, title: 'test' }));
      const result = await httpPost<{ id: number }, { title: string }>('/posts', { title: 'test' });
      expect(result).toEqual({ id: 101, title: 'test' });
    });

    it('throws ApiError on 422', async () => {
      vi.stubGlobal('fetch', mockFetch(false, null, 422));
      await expect(httpPost('/posts', {})).rejects.toBeInstanceOf(ApiError);
    });

    it('sends Content-Type: application/json header', async () => {
      const spy = mockFetch(true, { id: 1 });
      vi.stubGlobal('fetch', spy);
      await httpPost('/posts', { title: 'hello' });
      const callOptions = spy.mock.calls[0][1] as RequestInit;
      expect((callOptions.headers as Record<string, string>)['Content-Type']).toBe('application/json');
    });
  });
});
