type TelemetryPayload = Record<string, unknown>;

function emit(event: string, payload?: TelemetryPayload): void {
  console.info('[telemetry]', event, payload ?? {});
}

export function trackView(viewName: string, payload?: TelemetryPayload): void {
  emit('view.open', { viewName, ...payload });
}

export function trackFlow(flowName: string, payload?: TelemetryPayload): void {
  emit('flow.event', { flowName, ...payload });
}

export function trackError(errorName: string, error: unknown, payload?: TelemetryPayload): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  emit('error', { errorName, errorMessage, ...payload });
}
