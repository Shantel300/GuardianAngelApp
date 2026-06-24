# Running Guardian Angel

For the project overview and feature summary, see [README.md](README.md).

Guardian Angel uses:

- **Docker Desktop** for the private AI backend.
- **Expo Go** for the mobile application.
- The laptop and phone connected to the **same Wi-Fi network or hotspot**.

The scripts automatically detect the laptop's current Wi-Fi address and
configure Expo to use it. You should not manually enter an IP address.

## 1. Install the required software

Install these once:

1. [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
   with the WSL 2 backend.
2. [Node.js 20 LTS](https://nodejs.org/).
3. [Expo Go](https://expo.dev/go) on the Android phone.

After installing Docker Desktop:

1. Restart Windows if requested.
2. Open Docker Desktop.
3. Wait until Docker reports that the engine is running.
4. Allow Docker Desktop and Node.js through Windows Firewall on **private
   networks** if Windows asks.

## 2. First-time project setup

Open PowerShell in the repository:

```powershell
cd "C:\path\to\GuardianAngelApp"
```

Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-demo.ps1
```

The setup script will:

1. Check Docker, Node.js, and npm.
2. Build the CPU-only AI container.
3. Download the offline MiniLM and SmolLM2 models if they are missing.
4. Run the backend test suite inside Docker.
5. Install the Expo dependencies.
6. Start and verify the API.
7. Configure `mobile/.env` with the laptop's current network address.

The model download is approximately 364 MB and only happens once. Model files
remain on the laptop and are not committed to Git.

## 3. Start the complete project

Make sure:

- Docker Desktop is running.
- The phone and laptop are on the same Wi-Fi or phone hotspot.
- Expo Go is installed on the phone.

Then run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-demo.ps1
```

The script will:

1. Detect the laptop's current Wi-Fi IP.
2. Update `mobile/.env`.
3. Start the Docker AI backend.
4. Wait for the classifier and chatbot.
5. Start Expo in LAN mode.
6. Display the Expo QR code.

Keep the PowerShell window open. Scan the QR code with Expo Go.

In the Chat screen, the connection banner should display:

```text
Local trained AI connected
```

If the backend cannot be reached, the app remains usable through its scripted
mock fallback.

## 4. Test the phone connection

If Expo opens but Chat displays the fallback classifier, open another
PowerShell window and run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\test-connection.ps1
```

The script prints a URL similar to:

```text
http://128.1.101.103:8000/health
```

Open the printed URL in the phone's browser.

If it does not open:

1. Confirm the phone and laptop are on the same network.
2. Allow Docker Desktop through Windows Firewall on private networks.
3. Avoid university or public Wi-Fi that isolates connected devices.
4. Use the phone's hotspot and connect the laptop to it.
5. Run `start-demo.ps1` again after changing networks.

The script automatically replaces the old IP address whenever it starts.

## 5. Stop the project

Stop Expo with `Ctrl+C` in its PowerShell window.

Stop the Docker backend:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\stop-demo.ps1
```

This preserves:

- Downloaded AI models.
- Docker build cache.
- Expo dependencies.
- Local app preferences.

It does not preserve private conversations or check-in responses.

## Useful Docker commands

Show the backend status:

```powershell
docker compose ps
```

Show backend logs:

```powershell
docker compose logs --tail 100 ai-api
```

Restart only the backend:

```powershell
docker compose restart ai-api
```

Run backend tests in Docker:

```powershell
docker compose --profile test run --rm ai-api-tests
```

Re-download missing models:

```powershell
docker compose --profile setup run --rm model-bootstrap
```

Rebuild after backend dependency changes:

```powershell
docker compose build ai-api
```

## Important notes

- Do not use `localhost` as the API address on the phone. On a phone,
  `localhost` means the phone itself.
- Expo stays outside Docker so Expo Go, QR discovery, notifications, SMS, and
  dialer actions work normally.
- Docker exposes only port `8000` for the AI API.
- The API runs one worker so the models are loaded into memory only once.
- The API does not intentionally log or persist submitted messages.
- The chatbot may take several seconds to reply on an 8 GB CPU laptop.
- The wearable readings and counsellor referral remain simulated prototype
  features.

## Fast command summary

First time:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-demo.ps1
```

Every demo:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-demo.ps1
```

When finished:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\stop-demo.ps1
```
