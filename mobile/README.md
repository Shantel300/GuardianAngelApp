# Guardian Angel Mobile App — Person 2

A secure, AI-powered React Native mobile support system for youth wellbeing and recovery. This app demonstrates early intervention, private chatbot interaction, wearable monitoring simulation, and emergency tools.

## 🚀 Quick Start

### Prerequisites

- **Node.js LTS** (v18 or later) — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (already installed)
- **Expo Go app** on your Android/iOS device (for testing)

### Verify Installation

```powershell
node --version
npm --version
git --version
```

### Clone & Setup

```powershell
cd guardian-angel
git switch -c feature/mobile-app
cd mobile
npm install
```

### Run the App

```powershell
npx expo start
```

Scan the QR code with **Expo Go** app on your phone.

---

## 📁 Project Structure

```
mobile/
├── app/                          # Expo Router screens (file-based routing)
│   ├── index.tsx                # Splash screen
│   ├── onboarding.tsx           # 3-page onboarding flow
│   ├── consent.tsx              # Privacy & consent toggles
│   ├── (tabs)/                  # Bottom tab navigation
│   │   ├── _layout.tsx          # Tab layout
│   │   ├── home.tsx             # Dashboard
│   │   ├── monitor.tsx          # Wearable dashboard
│   │   ├── chat.tsx             # Private chatbot
│   │   ├── support.tsx          # Resources & coping tools
│   │   └── profile.tsx          # Settings & data management
│   └── ...                       # Other screens (to add)
├── components/                   # Reusable UI components
│   ├── PrimaryButton.tsx        # Main action buttons
│   ├── RiskBadge.tsx            # Green/amber/red status
│   ├── ChatBubble.tsx           # Chat message bubbles
│   ├── PrivacyBanner.tsx        # Privacy notice banner
│   └── ...                       # (Add more as needed)
├── constants/                    # Theme, config, constants
│   └── theme.ts                 # Design system (colors, typography, spacing)
├── services/                     # Business logic & API integration
│   ├── mockClassifier.ts        # Fallback classifier for demo
│   ├── classifierApi.ts         # Connect to Person 1's FastAPI server
│   └── ...                       # (Other services)
├── data/                         # Static data
│   └── wearableScenarios.ts     # Simulated wearable readings
├── package.json                  # Dependencies
├── app.json                      # Expo configuration
├── app.config.js                 # Expo Router config
└── README.md                     # This file

```

---

## 🎯 Key Features to Build

### ✅ Must Have (5-Hour Priority)

1. **Onboarding & Consent** — ✅ Basic screens created
   - 3-page flow explaining features
   - 4 consent toggles (chatbot, monitoring, alerts, referrals)
   - Essential consent enforced

2. **Home Dashboard** — ✅ Basic screen created
   - Greeting with status (green/amber/red)
   - Quick action cards
   - Device battery status

3. **Private Chatbot** — ✅ Basic screen created
   - Message bubbles
   - Input field with send button
   - Privacy banner ("Not saved")
   - **TODO**: Connect to classifier (mock first, then real API)

4. **Mock Classifier** — ✅ Created (`services/mockClassifier.ts`)
   - Keyword-based classification
   - Returns risk level, signals, reasons, actions
   - Implements shared contract with Person 1's API

5. **Wearable Simulator** — ✅ Data created (`data/wearableScenarios.ts`)
   - 4 scenarios: Normal, Exercise, Stress, Recovery Risk
   - Monitor screen displays metrics
   - **TODO**: Add tap-to-trigger scenario buttons

6. **Check-In Prompt** — ⏳ To build
   - "Your signals have changed—are you okay?"
   - 5 response options
   - Route to appropriate support flow

7. **Support Resources** — ✅ Basic screen created
   - Coping tools (breathing, grounding, refusal phrases, timer)
   - Contact trusted person
   - SOS access

8. **Session Deletion** — ⏳ To build
   - Clear chat messages from memory on exit
   - Show confirmation before clearing
   - Never persist to storage

### 🔧 Should Have

- Trusted Contact management screen
- Referral review & approval flow
- SOS screen with protocol selection
- Local notifications (expo-notifications)
- Privacy Centre (pause, clear data, revoke consent)

### ✨ Optional Polish

- Animated charts
- Mascot animation
- Dark mode
- Multiple languages
- Production build setup

---

## 🔗 Connecting to Person 1's API

### Before Integration

1. Person 1 trains the model and starts the FastAPI server on their laptop
2. Find their laptop's local IP:
   ```powershell
   ipconfig  # Look for IPv4 Address (e.g., 192.168.1.10)
   ```

### Configure API Endpoint

In `services/classifierApi.ts`, update:
```typescript
const API_URL = 'http://192.168.1.10:8000';  // Replace with Person 1's IP
```

Or set environment variable:
```powershell
# .env.local
EXPO_PUBLIC_API_URL=http://192.168.1.10:8000
```

### Test the Connection

```powershell
# From the mobile/ directory
npx expo start

# In your chat screen, send a message and check the console
```

### Fallback Behavior

If the API is unavailable:
- App automatically falls back to `mockClassifier.ts`
- User sees "(Demo classifier unavailable)" in reasons
- App continues functioning

---

## 🎨 Design System

All UI follows the **"Serene Guardian"** design system defined in `constants/theme.ts`.

### Key Colors

- **Primary (Coral Red #ff5a5f)**: Actions, urgent states, SOS
- **Secondary (Blue #0060ac)**: Information, maps, calm states
- **Tertiary (Green #006d37)**: Safe arrival, confirmations
- **Neutrals**: Soft grays (#f7f9fc background)

### Typography

- Font: Plus Jakarta Sans (modern, friendly)
- Headlines: Bold 20-32px
- Body: Regular 14-18px
- Labels: Semi-bold 12-16px

### Component Sizing

- **Buttons**: 56px minimum height (accessible for stress)
- **Cards**: 20px padding
- **Spacing**: 8px base unit (stack-sm, stack-md, stack-lg)

Use the `THEME` object from `constants/theme.ts` in all components.

---

## 🔐 Security & Privacy Rules

**CRITICAL** — These must be enforced:

- ✅ **No chat persistence**: Keep messages only in React component state
- ✅ **No console.log**: Never print messages for debugging
- ✅ **No AsyncStorage**: Don't save chat to device storage
- ✅ **Clear on exit**: Erase all messages when session ends
- ✅ **Confirm before leaving**: Ask if they want to exit active chat
- ✅ **No error logging**: Never include message content in error reports
- ✅ **Labeled simulations**: All alerts marked "Simulated" or "Demo"
- ✅ **No PII required**: Use fictional names in demo

**Add to .gitignore**:
```
node_modules/
.env
.env.local
*.log
.expo/
```

---

## 🧪 Testing Checklist

Before integration with Person 1's API:

- [ ] Onboarding completes without errors
- [ ] Consent page correctly toggles all switches
- [ ] Chat screen sends/receives mock messages
- [ ] Mock classifier returns proper risk levels (green/amber/red)
- [ ] Risk badge displays colors correctly
- [ ] Wearable scenarios load all 4 readings
- [ ] Privacy banner shows correctly
- [ ] Messages disappear when app closes
- [ ] No console errors or warnings

---

## 📱 Screens Overview

| Screen | Purpose | Status |
|--------|---------|--------|
| Splash | Guardian Angel intro | ✅ Basic created |
| Onboarding | Feature introduction | ✅ Basic created |
| Consent | Privacy controls | ✅ Basic created |
| Home | Dashboard & quick actions | ✅ Basic created |
| Monitor | Wearable metrics | ✅ Basic created |
| Chat | Private chatbot | ✅ Basic created |
| Assessment | Risk result display | ⏳ To build |
| Check-In | Physiological prompt | ⏳ To build |
| Support | Coping tools | ✅ Basic created |
| Trusted Contact | Add/manage contacts | ⏳ To build |
| Referral | Review & approve | ⏳ To build |
| SOS | Emergency protocol | ⏳ To build |
| Privacy Centre | Data management | ⏳ To build |
| Profile | Settings | ✅ Basic created |

---

## 🚦 5-Hour Sprint Guide

### 0:00–1:00: Setup & Mock Flow
- ✅ npm install
- ✅ Verify Expo starts
- ✅ Test onboarding → consent → home flow

### 1:00–2:00: Chat & Classifier
- ✅ Chat screen integration
- ✅ Mock classifier testing (green/amber/red)
- ✅ Risk badge display

### 2:00–3:00: Wearable & Scenarios
- ✅ Wearable data structure
- ✅ Scenario triggers
- ✅ Alert notifications (if time)

### 3:00–4:00: API Integration
- Connect to Person 1's laptop API
- Debug networking issues
- Test green/amber/red responses

### 4:00–5:00: Polish & Demo Prep
- Bug fixes
- UI polish
- Rehearse demo flow
- Backup mock responses

---

## 🔗 Shared Contract With Person 1

Do NOT change these response properties without coordination:

```typescript
type RiskLevel = 'green' | 'amber' | 'red';

type Signal = {
  label: string;
  probability: number;
};

type ClassificationResult = {
  riskLevel: RiskLevel;
  signals: Signal[];
  reasons: string[];
  recommendedActions: string[];
  uncertain?: boolean;
};
```

Person 1 will return this exact structure from `/classify` endpoint.

---

## 📚 Resources

- **Expo Documentation**: https://docs.expo.dev
- **React Native API**: https://reactnative.dev/docs/api
- **Design System**: See `constants/theme.ts`
- **Person 1 Plan**: See `../PERSON_1_PLAN.md`
- **Project Plan**: See `../PERSON_2_PLAN.md`

---

## 🤝 Need Help?

- **Setup issues?** Check Node.js version and npm cache
- **Expo won't start?** Run `npx expo start -c` (clear cache)
- **API not connecting?** Verify laptop IP with `ipconfig`
- **Git questions?** See `../CLAUDE.md` for team workflow

---

**Happy building! 🚀**
