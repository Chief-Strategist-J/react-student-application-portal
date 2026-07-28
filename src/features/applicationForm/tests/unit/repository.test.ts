import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('../../../../shared/tracing/tracer', () => ({
  withSpan: async (_name: string, fn: (span: any) => Promise<unknown>) =>
    fn({ setAttribute: vi.fn(), setStatus: vi.fn(), recordException: vi.fn(), end: vi.fn() }),
}));

vi.mock('../../../../shared/logger', () => ({
  createLogger: () => ({ debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }),
}));

import { submitApplicationApi } from '../../repository';
import type { ApplicationSubmitPayload } from '../../types';

const payload: ApplicationSubmitPayload = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '1234567890',
  dob: '1990-01-01',
  documents: { transcriptName: 't.pdf', idProofName: 'id.pdf', statementName: 's.pdf' },
};

describe('applicationForm/repository — submitApplicationApi', () => {
  afterEach(() => vi.restoreAllMocks());

  it('POSTs payload and returns server response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      statusText: 'Created',
      json: async () => ({ id: 101, title: 'test' }),
    }));

    const result = await submitApplicationApi(payload);
    expect(result).toMatchObject({ id: 101 });
  });

  it('throws on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({}),
    }));
    await expect(submitApplicationApi(payload)).rejects.toThrow();
  });
});
