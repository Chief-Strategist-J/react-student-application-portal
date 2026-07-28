export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_RANK: Record<LogLevel, number> = {
  debug: 0,
  info:  1,
  warn:  2,
  error: 3,
};

const MIN_LEVEL: LogLevel = import.meta.env.PROD ? 'warn' : 'debug';

function shouldLog(level: LogLevel): boolean {
  return LEVEL_RANK[level] >= LEVEL_RANK[MIN_LEVEL];
}

function format(namespace: string, level: LogLevel, message: string): string {
  return `[${new Date().toISOString()}] [${level.toUpperCase()}] [${namespace}] ${message}`;
}

function emit(level: LogLevel, namespace: string, message: string, meta?: unknown): void {
  if (!shouldLog(level)) return;
  const line = format(namespace, level, message);
  const args: unknown[] = meta !== undefined ? [line, meta] : [line];
  switch (level) {
    case 'debug': console.debug(...args); break;
    case 'info':  console.info(...args);  break;
    case 'warn':  console.warn(...args);  break;
    case 'error': console.error(...args); break;
  }
}

export interface Logger {
  debug(msg: string, meta?: unknown): void;
  info(msg: string, meta?: unknown): void;
  warn(msg: string, meta?: unknown): void;
  error(msg: string, meta?: unknown): void;
}

export function createLogger(namespace: string): Logger {
  return {
    debug: (msg, meta) => emit('debug', namespace, msg, meta),
    info:  (msg, meta) => emit('info',  namespace, msg, meta),
    warn:  (msg, meta) => emit('warn',  namespace, msg, meta),
    error: (msg, meta) => emit('error', namespace, msg, meta),
  };
}

export const logger = createLogger('app');
