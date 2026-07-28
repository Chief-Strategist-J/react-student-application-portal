import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createLogger } from '../../logger';

describe('createLogger', () => {
  let debugSpy: ReturnType<typeof vi.spyOn>;
  let infoSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    infoSpy  = vi.spyOn(console, 'info').mockImplementation(() => {});
    warnSpy  = vi.spyOn(console, 'warn').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => vi.restoreAllMocks());

  it('emits debug log with namespace', () => {
    const log = createLogger('test-ns');
    log.debug('hello debug');
    expect(debugSpy).toHaveBeenCalledOnce();
    expect(debugSpy.mock.calls[0][0]).toContain('[DEBUG]');
    expect(debugSpy.mock.calls[0][0]).toContain('[test-ns]');
    expect(debugSpy.mock.calls[0][0]).toContain('hello debug');
  });

  it('emits info log', () => {
    const log = createLogger('test-ns');
    log.info('hello info');
    expect(infoSpy).toHaveBeenCalledOnce();
    expect(infoSpy.mock.calls[0][0]).toContain('[INFO]');
  });

  it('emits warn log', () => {
    const log = createLogger('warn-ns');
    log.warn('careful');
    expect(warnSpy).toHaveBeenCalledOnce();
    expect(warnSpy.mock.calls[0][0]).toContain('[WARN]');
  });

  it('emits error log with meta', () => {
    const log = createLogger('err-ns');
    log.error('boom', { code: 500 });
    expect(errorSpy).toHaveBeenCalledOnce();
    expect(errorSpy.mock.calls[0][0]).toContain('[ERROR]');
    expect(errorSpy.mock.calls[0][1]).toEqual({ code: 500 });
  });

  it('includes ISO timestamp in output', () => {
    const log = createLogger('ts-ns');
    log.info('ts test');
    const output = infoSpy.mock.calls[0][0] as string;
    expect(output).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it('different namespaces produce distinct prefixes', () => {
    const logA = createLogger('alpha');
    const logB = createLogger('beta');
    logA.info('from alpha');
    logB.info('from beta');
    expect(infoSpy.mock.calls[0][0]).toContain('[alpha]');
    expect(infoSpy.mock.calls[1][0]).toContain('[beta]');
  });
});
