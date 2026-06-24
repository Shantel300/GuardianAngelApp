# Guardian Angel

Guardian Angel is a privacy-conscious hackathon prototype for youth wellbeing
and recovery support in Mauritius. It combines an Expo mobile application with
a local, CPU-friendly AI service.

The project is designed to support early check-ins and access to reviewed
coping tools. It does **not** diagnose stress, cravings, relapse, substance use,
or any medical condition.

## Quick start

The recommended demo workflow uses Docker Desktop for the AI backend and Expo
Go for the phone application.

### First-time setup

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-demo.ps1
```

### Start the complete project

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-demo.ps1
```

Scan the displayed QR code with Expo Go. The script automatically detects the
laptop's current Wi-Fi address and configures the mobile API URL.

### Stop the project

Stop Expo with `Ctrl+C`, then run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\stop-demo.ps1
```

For prerequisites, troubleshooting, and manual commands, read
[runproject.md](runproject.md).

## Architecture

```text
Expo Go mobile app
        |
        | Local Wi-Fi HTTP
        v
Docker FastAPI service
        |
        +-- MiniLM message embeddings
        +-- Multi-label PyTorch classifier
        +-- Explainable green/amber/red risk rules
        +-- Local SmolLM2 reply generator
```

The Expo application runs on the host instead of inside Docker so QR
discovery, local notifications, SecureStore, SMS, and dialer actions continue
to work normally on a physical phone.

## Current features

### Mobile

- Private in-memory chatbot with generated, reviewed-template, and mock
  fallback replies.
- Explainable assessment display with support signals and recommended actions.
- Simulated smartwatch readings with personal-baseline anomaly rules.
- Neutral local wellbeing notifications and check-in routing.
- Press-and-hold SOS flow with explicit confirmation before opening a dialer.
- Trusted contacts encrypted locally with Expo SecureStore.
- Interactive breathing, grounding, refusal-phrase, and craving-delay tools.
- Demonstration counsellor referral flow with user-controlled consent.
- Editable private nickname, preferences, privacy controls, notifications, and
  local-data reset.

### AI backend

- `GET /health`
- `POST /classify`
- `POST /chat`
- Five multi-label support signals.
- Transparent risk decisions.
- Red-risk messages bypass free generation.
- Offline inference after model bootstrap.
- Generic errors and disabled interactive API documentation.

## Privacy model

- Chat messages and check-in responses stay in memory and are not intentionally
  persisted.
- Up to four recent chat messages are temporarily sent to the local AI laptop.
- The API does not intentionally log request bodies or retain conversations.
- Preferences and consent are stored locally with AsyncStorage.
- Trusted-contact details are stored locally with SecureStore.
- No call, SMS, contact alert, or referral is sent automatically.
- Only fictional messages should be used during the hackathon prototype.
- Local HTTP on trusted Wi-Fi is a prototype limitation; it is not equivalent
  to production end-to-end encryption.

## Repository layout

```text
GuardianAngelApp/
|-- ai-api/              FastAPI, classifier, chatbot, training, and tests
|-- mobile/              Expo Router React Native application
|-- scripts/             Windows setup, start, stop, and connection helpers
|-- docker-compose.yml   Backend, model-bootstrap, and test services
|-- runproject.md        Complete operating guide
`-- README.md            Project overview
```

Component-specific documentation:

- [AI backend README](ai-api/README.md)
- [Mobile README](mobile/README.md)
- [Run guide](runproject.md)

Historical planning files remain in the repository for hackathon context. The
three documents above describe the implemented system.

## Verification

Mobile type checking:

```powershell
cd mobile
npm run typecheck
```

Backend tests:

```powershell
cd ai-api
.\.venv\Scripts\python.exe -m pytest
```

Backend tests in Docker:

```powershell
docker compose --profile test run --rm ai-api-tests
```

The current suite contains 18 backend tests covering API privacy, schema
contracts, dataset scope, risk rules, and reply safety behavior.

## Prototype limitations

- Smartwatch values are simulated; there is no live Wear OS integration.
- The classifier was trained on synthetic English data.
- The counsellor referral is a clearly labelled demonstration.
- Emergency numbers must be reconfirmed before real-world use.
- Physical-phone behavior still depends on notification, dialer, SMS, network,
  and firewall permissions.
