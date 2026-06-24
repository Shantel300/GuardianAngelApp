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
│   ├── assessment.tsx           # Risk assessment result display
│   ├── check-in.tsx             # Physiological wellbeing check-in
│   ├── (tabs)/                  # Bottom tab navigation
│   │   ├── _layout.tsx          # Tab layout
│   │   ├── home.tsx             # Dashboard
│   │   ├── monitor.tsx          # Wearable dashboard (INTERACTIVE)
│   │   ├── chat.tsx             # Private chatbot (INTERACTIVE)
│   │   ├── support.tsx          # Resources & coping tools
│   │   └── profile.tsx          # Settings & data management
│   └── _layout.tsx              # Root layout with routing
├── components/                   # Reusable UI components
│   ├── PrimaryButton.tsx        # Main action buttons
│   ├── RiskBadge.tsx            # Green/amber/red status
│   ├── ChatBubble.tsx           # Chat message bubbles
│   └── PrivacyBanner.tsx        # Privacy notice banner
├── constants/                    # Theme, config, constants
│   └── theme.ts                 # Design system (Serene Guardian)
├── hooks/                        # Custom React hooks
│   └── useChatSession.ts        # Chat state management (no persistence)
├── services/                     # Business logic & API integration
│   ├── mockClassifier.ts        # Fallback classifier for demo
│   └── classifierApi.ts         # Connect to Person 1's FastAPI server
├── data/                         # Static data
│   └── wearableScenarios.ts     # Simulated wearable readings (4 scenarios)
├── package.json                  # Dependencies
├── app.json                      # Expo configuration
├── app.config.js                 # Expo Router config
└── README.md                     # This file
```

---

## ✅ What's Working Now (Test These)

### 1. **Chat Flow** ✅
- Send a message in the Chat tab
- Watch it get classified (mock or real API)
- See the risk assessment with signals and confidence scores
- Back/retry from assessment screen

**Test Messages:**
- `"I feel pressured"` → Should get Amber with peer_pressure signal
- `"I need help now"` → Should get Red with immediate_help_request
- `"I feel stressed"` → Should get Green with general_distress
- `"Normal text"` → Should get Green with no signals

### 2. **Wearable Monitoring** ✅
- Select different scenarios (Normal, Exercise, Stress, Recovery Risk)
- Watch readings update every 2 seconds (animated)
- Stress and Recovery Risk scenarios trigger check-in alerts
- Respond to check-in with 5 options (I'm fine, exercising, stressed, cravings, help)

**Test Flow:**
1. Go to Monitor tab
2. Tap "Elevated Stress" button
3. Wait 3 seconds for alert
4. Select response (e.g., "I feel stressed")
5. Gets routed to Support resources

### 3. **Session Management** ✅
- Chat messages stored ONLY in React state (never persisted)
- "End Session" button clears ALL messages
- Confirmation dialog before deletion
- Messages gone when you exit the app

### 4. **Privacy** ✅
- Privacy banner always visible in chat
- No AsyncStorage used
- No console.log of messages
- Simulations clearly labeled

### 5. **Assessment Results** ✅
- Shows risk level (green/amber/red) with emoji badge
- Lists detected signals with confidence % and progress bars
- Explains reasons in plain language
- Lists recommended next steps
- Includes disclaimer
- Routes to Support Resources or back to Chat

---

## 🎯 Features Status

| Feature | Status | How to Test |
|---------|--------|------------|
| **Splash & Onboarding** | ✅ Done | Open app, go through 3-page flow |
| **Consent Controls** | ✅ Done | Toggle 4 privacy switches |
| **Home Dashboard** | ✅ Done | Status shows "Active", quick actions present |
| **Chat with Classifier** | ✅ WORKING | Send message → See risk result |
| **Risk Assessment Display** | ✅ WORKING | Classification shows signals + reasons + actions |
| **Wearable Scenarios** | ✅ WORKING | Tap scenario button → Readings animate → Alert triggers |
| **Check-In Prompts** | ✅ WORKING | 5 response options with routing |
| **Session Clearing** | ✅ WORKING | "End Session" button → Confirmation → Messages gone |
| **Mock Classifier** | ✅ Working | Fallback when API unavailable |
| **API Connection** | ⏳ Ready | Update IP in `services/classifierApi.ts` |
| **Support Resources** | ✅ Done | Links to coping tools (basic) |
| **Profile/Settings** | ✅ Basic | Settings screens present |
| **Notifications** | ⏳ TODO | expo-notifications configured but not integrated |
| **Trusted Contacts** | ⏳ TODO | UI scaffolding ready |
| **Referral Flow** | ⏳ TODO | UI scaffolding ready |
| **SOS Button** | ⏳ TODO | Needs press-hold implementation |

---

## 🔗 Testing the End-to-End Flow

### Complete User Journey (3 minutes)

1. **Start App**
   - See splash screen "Private support when you need it"

2. **Onboarding** (tap Next)
   - Page 1: Private youth and recovery support
   - Page 2: AI-assisted early intervention
   - Page 3: Wearable monitoring and trusted contacts

3. **Consent** (toggle switches)
   - Enable "Private Chatbot" (required)
   - Toggle others as desired
   - Tap "Get Started"

4. **Dashboard**
   - See greeting + Guardian Mode status
   - Quick action cards visible

5. **Chat Test**
   - Tap "Chat" tab
   - Send: `"I feel pressured"`
   - See Risk Assessment: **Amber**, signals, confidence
   - Tap "Back to Chat"
   - Tap "End Session" → Confirm → Messages cleared

6. **Wearable Test**
   - Tap "Monitor" tab
   - Select "Elevated Stress" scenario
   - Watch readings animate
   - Alert pops: "Your body signals have changed"
   - Select "I feel stressed" → Routes to Support

7. **Demo Complete!** ✅

---

## 🔌 Connecting to Person 1's API

When Person 1 has the FastAPI server running:

1. Find their laptop IP:
   ```powershell
   ipconfig  # Look for IPv4 Address
   ```

2. Update in `services/classifierApi.ts`:
   ```typescript
   const API_URL = 'http://192.168.1.100:8000';  // Replace with their IP
   ```

3. Restart the app (`npx expo start -c`)

4. Send a message in Chat—app will now use Person 1's real classifier

**Fallback:** If API is unavailable, app automatically uses mock classifier

---

## 🎨 Design System

All UI follows the **"Serene Guardian"** design system:

### Colors
- **Primary Red (#ff5a5f)**: Actions, urgent, SOS
- **Secondary Blue (#0060ac)**: Info, calm
- **Tertiary Green (#006d37)**: Safe, confirmations
- **Neutrals**: Soft grays

### Typography
- **Font**: Plus Jakarta Sans
- **Headlines**: Bold 20-28px
- **Body**: Regular 14-16px
- **Labels**: Semi-bold 12-14px

### Components
- Buttons: 56px minimum height (stress-accessible)
- Cards: 20px padding + subtle shadow
- Pills: Rounded corners (16px)

---

## 🔐 Security Checklist

**All Implemented:**
- ✅ No AsyncStorage (chat only in state)
- ✅ No console.log of messages
- ✅ Clear on "End Session"
- ✅ Confirmation before deletion
- ✅ Messages gone on app close
- ✅ No PII required (use demo data)
- ✅ All simulations labeled
- ✅ No real API calls (mock for now)

**Git Safety:**
```
.gitignore includes:
- node_modules/
- .env*
- .expo/
- *.log
```

---

## 🧪 Testing Checklist

### Core Flow
- [ ] Splash → Onboarding → Consent → Dashboard
- [ ] Chat: Send message → Get classification → See risk result
- [ ] Risk result shows signals with confidence bars
- [ ] Assessment has disclaimer + recommended actions
- [ ] Back from assessment returns to chat

### Wearable
- [ ] Monitor tab loads with Normal scenario active
- [ ] Click each scenario button → readings animate
- [ ] Stress scenario → Alert after 3 seconds
- [ ] Alert has 5 response options
- [ ] Each response does correct action

### Session Management
- [ ] Chat messages appear only in state (not on device storage)
- [ ] "End Session" → Confirmation dialog
- [ ] Confirm delete → Messages cleared
- [ ] Exit app → Reopen app → Chat empty (no persistence)

### Privacy
- [ ] Privacy banner always visible in chat
- [ ] No error messages reveal user text
- [ ] Simulations labeled "Demo" or "Simulated"

---

## 🚀 What to Build Next

Once this testing is complete:

1. **Integrate Person 1's API** (when ready)
2. **SOS Screen** — Press-hold button + protocol selection
3. **Local Notifications** — Check-in alerts
4. **Trusted Contacts** — Add/edit/manage
5. **Referral Flow** — Review & approve sharing
6. **Dark Mode** (optional)
7. **Production Build** (when all features ready)

---

## 📱 Screens Overview

| Screen | Purpose | Status |
|--------|---------|--------|
| Splash | Guardian Angel intro | ✅ Works |
| Onboarding | Feature intro | ✅ Works |
| Consent | Privacy toggles | ✅ Works |
| Home | Dashboard | ✅ Works |
| Chat | **Chatbot + Classifier** | ✅ INTERACTIVE |
| Assessment | **Risk result display** | ✅ INTERACTIVE |
| Monitor | **Wearable + Scenarios** | ✅ INTERACTIVE |
| Check-In | **Wellbeing prompt** | ✅ INTERACTIVE |
| Support | Coping resources | ✅ Works |
| Profile | Settings | ✅ Works |
| Trusted Contact | Add contacts | ⏳ Scaffold ready |
| Referral | Review share | ⏳ Scaffold ready |
| SOS | Emergency | ⏳ TODO |

---

## 📚 Key Files to Know

- **Theme:** `constants/theme.ts` — All colors, typography, spacing
- **Mock Classifier:** `services/mockClassifier.ts` — Test data
- **API Client:** `services/classifierApi.ts` — Person 1 connection + fallback
- **Wearable Data:** `data/wearableScenarios.ts` — 4 test scenarios
- **Chat Session:** `hooks/useChatSession.ts` — State management (no storage)
- **Chat Screen:** `app/(tabs)/chat.tsx` — Main interactive screen
- **Assessment:** `app/assessment.tsx` — Risk result display
- **Monitor:** `app/(tabs)/monitor.tsx` — Wearable + scenarios

---

## 🤝 Troubleshooting

**Expo won't start?**
```powershell
npx expo start -c  # Clear cache
```

**Messages persisting after close?**
- Check that you're using React state, not AsyncStorage
- Verify `clearMessages()` is called on "End Session"

**API not connecting?**
- Verify laptop IP with `ipconfig`
- Both devices on same Wi-Fi
- Check `services/classifierApi.ts` has correct URL
- Look at console logs for detailed error

**Alert not triggering in Monitor?**
- Make sure you tapped the Stress or Recovery Risk scenario
- Wait 3 seconds after tapping
- Check phone sound is not muted

---

## 🎯 5-Hour Sprint Recap

**Done:**
- ✅ 0:00–1:00 Setup + onboarding flow
- ✅ 1:00–2:00 Chat + mock classifier
- ✅ 2:00–3:00 Wearable scenarios + alerts
- ✅ 3:00–4:00 Assessment result display
- ✅ 4:00–5:00 Session management + polish

**Next Phase:**
- Person 1 API integration
- SOS & notification flows
- Production optimization

---

**Ready to test? Start with `npx expo start` and tap the Chat tab! 🚀**
