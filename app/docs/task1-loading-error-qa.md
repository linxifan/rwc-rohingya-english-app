# Task 1 manual QA — Loading / Error / Retry

The floating **QA** button appears only in Expo development (`__DEV__`).
No QA controls render in production, and fault injection is disabled in production.

## Prepare
1. `git switch linxi/frontend-tasks && git pull origin linxi/frontend-tasks`
2. `cd app && npm run typecheck && npm run lint && npx expo start`
3. Open Expo Go, tap **QA** at the top right.
4. Optionally enable **Slow requests (2.5s)** to observe loading spinners.
5. Choose **Fail next: <endpoint>**. The panel closes. Trigger a NEW matching request by navigating to a screen that has not mounted, opening a different detail item, or changing Words search text.

The failure is consumed exactly once. The failing request shows loading for ~2.5 seconds, then error and **Try again**. Tapping **Try again** requests the same endpoint again, now succeeding. No app restart needed.

## Screen checklist
- **Words** — Arm `getWords`, change search text; expect loading -> error -> retry -> list. Test empty search results separately.
- **Word Detail** — Arm `getWord`, open a word detail; expect loading -> error -> retry -> word.
- **Learn** — Arm `getNextWord` before first opening Learn (or after changing practice progress); expect loading -> error -> retry -> Up next / completed.
- **Scenario landing** — Arm `getScenarios` before first opening Scenario; expect loading -> error -> retry -> topic cards.
- **Scenario detail** — Arm `getScenario`, open a scenario detail; expect loading -> error -> retry -> chat.
- **Speak** — Arm `translateSpeech`, record and stop; expect loading -> error -> retry -> translation. Or arm `translateImage` and use camera.

For an already-mounted screen, switching tabs may preserve its state. To trigger a fresh request, use an action that re-fetches data (Words search, opening a different detail, Learn practice progress change). Reloading Expo resets the in-memory QA controls, so re-arm after reload.

## Safety
- QA state is in-memory and resets on reload.
- One-shot failures do not alter persisted learning progress.
- Slow mode affects only listed QA-wrapped endpoints and should be turned OFF after testing.
- The mock API is not a network backend. Turning off Wi-Fi does not simulate these failures.
