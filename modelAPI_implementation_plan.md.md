# Integrate Trained AI API into GuardianAngelApp

## Summary

Integrate the completed Person 1 backend into the latest commit `803499d`. The repository will become a monorepo containing `mobile/` and `ai-api/`. The mobile app will call the trained model over local Wi-Fi and automatically fall back to its scripted classifier if unavailable.

## Integration Changes

- Create `feature/integrate-ai-api` from current `main`; the documented `develop` branch does not currently exist.
- Copy the completed `ai-api/` implementation, synthetic dataset, classifier weights, thresholds, evaluation results, tests, and documentation into the repository.
- Keep the 90 MB MiniLM encoder outside Git. Add a bootstrap command that downloads it once into `ai-api/models/encoder/`; retain the local copy on the demonstration laptop for offline use.
- Preserve the existing API contract:
  - `GET /health`
  - `POST /classify`
  - Response fields: `riskLevel`, `signals`, `reasons`, `recommendedActions`, `uncertain`.
- Add restricted development CORS support for Expo web while keeping native Expo Go requests unchanged.
- Run the backend with `--no-access-log`, no database, no message persistence, and generic errors.

## Mobile Integration

- Add `mobile/.env.example` with `EXPO_PUBLIC_API_URL=http://<ACTIVE_WIFI_IP>:8000`; the actual `.env` remains ignored.
- Strengthen `classifierApi.ts` to:
  - verify `/health` reports `status: "ready"` and `modelLoaded: true`;
  - validate the returned response shape;
  - use the five-second timeout;
  - return a frontend-only `source: "api" | "mock"` indicator;
  - fall back safely without including the submitted message in logs or errors.
- Display a clear “Demo fallback classifier” notice when the backend is unavailable.
- Remove the raw `userMessage` from Expo Router parameters and from the assessment screen. Router state should carry only the classification result, preventing private text from lingering in navigation history.
- Update consent and privacy wording to state that prototype messages are processed temporarily by the team’s local AI laptop and are not stored. Future production inference remains on-device.
- Keep chatbot responses curated by the frontend; the AI only classifies support signals and risk.

## Connection and Demo Flow

1. Start the backend on Person 1’s laptop:

   ```powershell
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --no-access-log
   ```

2. Put the laptop and Expo phone on the same trusted Wi-Fi.
3. Set the active Wi-Fi IPv4 address in `mobile/.env`.
4. Restart Expo with `npx expo start -c`.
5. Confirm `/health` is ready before demonstrating chat.
6. Demonstrate green, amber, red, and uncertain results.
7. Disconnect the backend and demonstrate the labelled mock fallback.

## Test Plan

- Run all backend tests and confirm the current 11-test suite passes.
- Run TypeScript checking and start the Expo SDK 54 app.
- Verify educational and negated text remains green.
- Verify peer pressure and cravings return amber.
- Verify explicit unsafe/help-now language returns red.
- Verify short ambiguous text returns an uncertain clarification result.
- Confirm no message appears in backend logs, files, errors, route parameters, or persistent mobile storage.
- Test invalid input, oversized text, API timeout, unavailable model, wrong IP, and Wi-Fi disconnection.
- Complete one physical-phone end-to-end classification through Person 1’s laptop.

## Assumptions

- The backend and mobile app will live in the same GitHub repository.
- Expo Go and local HTTP are used only for fictional hackathon demonstrations.
- Model training remains based on synthetic English data and is not clinically validated.
- Smartwatch readings remain simulated.
- The trained classifier supports assessment only; it is not a generative chatbot or diagnostic system.
