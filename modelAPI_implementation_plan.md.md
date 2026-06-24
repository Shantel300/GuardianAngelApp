# Revised AI API Integration Plan

## Summary

Integrate `ai-api/` beside `mobile/`, connect Expo to the trained classifier, preserve the mock fallback, and remove private message text from navigation state.

## Implementation Changes

- Create `feature/integrate-ai-api` from current `main`.
- Add Person 1’s API code, classifier weights, thresholds, synthetic dataset, evaluation results, and tests.
- Exclude the 90 MB MiniLM encoder from Git; provide a bootstrap script that downloads and saves it locally for offline inference.
- Keep the existing `/health` and `/classify` contract unchanged.
- Add `"typecheck": "tsc --noEmit"` to the mobile scripts.
- Add `mobile/.env.example` containing `EXPO_PUBLIC_API_URL`.

## Mobile Behaviour

- Check `/health` once when the chat screen opens, not before every message.
- Cache the connection state for that chat session.
- Submit messages directly to `/classify` when the API is ready.
- Validate response fields before displaying results.
- Return a client-side `source: "api" | "mock"` value.
- Show a visible fallback notice when scripted classification is used.
- Provide a retry connection action if the backend starts after the chat screen opens.
- Remove `userMessage` from route parameters and remove the “You said…” assessment card.
- Keep conversations exclusively in component memory.
- Update consent wording to disclose temporary processing by the local laptop.
- Do not add CORS unless Expo Web will be demonstrated.

## API Result

```ts
type ClassificationResult = {
  riskLevel: "green" | "amber" | "red";
  signals: {
    label: string;
    probability: number;
  }[];
  reasons: string[];
  recommendedActions: string[];
  uncertain: boolean;
};

type SourcedClassificationResult = ClassificationResult & {
  source: "api" | "mock";
};
```

`source` is added by the mobile client and is not part of the backend contract.

## Verification

- Run the 11 existing backend tests.
- Run `npm run typecheck`.
- Test physical-phone access over local Wi-Fi.
- Verify green, amber, red, uncertain, timeout, malformed-response, and offline-fallback cases.
- Confirm messages never appear in route parameters, logs, persistent storage, or API errors.
- Confirm the fallback notice appears only for mock results.
- Confirm the downloaded encoder allows API startup without internet access.

## Assumptions

- The physical-phone Expo demo is the priority, so CORS is omitted initially.
- Only fictional messages are used over local HTTP.
- Removing the echoed message from assessment is an intentional privacy tradeoff.
- The model remains a synthetic-data prototype, not a clinical diagnostic system.
