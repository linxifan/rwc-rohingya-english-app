/**
 * Manual QA fault injection for the mock API. Only available in development.
 * Arm a single failure; the next matching request fails after a visible delay.
 * Retry then succeeds automatically. No persistence or production effect.
 */
export const QA_ENDPOINTS = [
  'getWords', 'getWord', 'getNextWord', 'getScenarios',
  'getScenario', 'translateSpeech', 'translateImage',
] as const;

export type QaEndpoint = (typeof QA_ENDPOINTS)[number];
let armed: QaEndpoint | null = null;
let slow = false;

export const mockQa = {
  arm(endpoint: QaEndpoint) { if (__DEV__) armed = endpoint; },
  disarm() { armed = null; },
  setSlow(value: boolean) { if (__DEV__) slow = value; },
  getArmed() { return __DEV__ ? armed : null; },
  getSlow() { return __DEV__ && slow; },
};

/** Wrap a mock response; never changes behavior in production. */
export async function qaDelay<T>(endpoint: QaEndpoint, value: T, ms: number): Promise<T> {
  const fail = __DEV__ && armed === endpoint;
  if (fail) armed = null;
  await new Promise<void>((resolve) => setTimeout(resolve, __DEV__ && (slow || fail) ? 2500 : ms));
  if (fail) throw new Error(`[QA] Simulated failure: ${endpoint}`);
  return value;
}
