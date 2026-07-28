import {
  WebTracerProvider,
  BatchSpanProcessor,
  ConsoleSpanExporter,
} from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { trace, context, SpanStatusCode, type Tracer, type Span } from '@opentelemetry/api';
import { APP_CONFIG } from '../config';

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: APP_CONFIG.telemetry.serviceName,
  'app.version': APP_CONFIG.app.version,
  'deployment.environment': import.meta.env.PROD ? 'production' : 'development',
});

const spanProcessors = [new BatchSpanProcessor(new ConsoleSpanExporter())];

if (APP_CONFIG.telemetry.otlpUrl && !APP_CONFIG.telemetry.otlpUrl.includes('localhost')) {
  spanProcessors.push(
    new BatchSpanProcessor(new OTLPTraceExporter({ url: APP_CONFIG.telemetry.otlpUrl }), {
      scheduledDelayMillis: 5000,
      maxExportBatchSize: 10,
    })
  );
}

const provider = new WebTracerProvider({ resource, spanProcessors });
provider.register();

registerInstrumentations({
  instrumentations: [
    new FetchInstrumentation({ ignoreUrls: [/localhost:4318/, /v1\/traces/] }),
  ],
});

export const tracer: Tracer = trace.getTracer(
  APP_CONFIG.telemetry.tracerName,
  APP_CONFIG.app.version,
);

export async function withSpan<T>(
  name: string,
  fn: (span: Span) => Promise<T>,
  attrs?: Record<string, string | number | boolean>,
): Promise<T> {
  const span = tracer.startSpan(name);
  if (attrs) {
    Object.entries(attrs).forEach(([k, v]) => span.setAttribute(k, v));
  }
  return context.with(trace.setSpan(context.active(), span), async () => {
    try {
      const result = await fn(span);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      span.setStatus({ code: SpanStatusCode.ERROR, message: msg });
      span.recordException(err instanceof Error ? err : new Error(msg));
      throw err;
    } finally {
      span.end();
    }
  });
}
