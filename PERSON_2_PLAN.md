# Person 2 — React Native Application Plan

## Objective

Person 2 builds the complete mobile-facing prototype using React Native and Expo. The app demonstrates prevention, recovery monitoring, confidential chatbot interaction, risk explanations, support referrals, and emergency tools.

Person 2 does not train the AI model. They initially use mock responses, then connect the interface to Person 1's FastAPI classifier.

## Environment Setup

Install:

- Node.js LTS
- Git
- Visual Studio Code
- Expo Go on an Android phone
- A GitHub account

Verify:

```powershell
node --version
npm --version
git --version
```

Clone the shared repository:

```powershell
git clone <repository-url>
cd guardian-angel
git switch -c feature/mobile-app
```

Create the Expo project inside `mobile/` if it does not exist:

```powershell
npx create-expo-app@latest mobile
cd mobile
npm install
npx expo install expo-router expo-notifications expo-linear-gradient
npx expo start
```

Scan the QR code using Expo Go.

## Application Screens

### 1. Splash Screen

Display:

- Guardian Angel logo or mascot
- Product name
- "Private support when you need it"
- Short loading animation

### 2. Onboarding

Use three short pages:

1. Private youth and recovery support
2. AI-assisted early intervention
3. Optional wearable monitoring and trusted contacts

Include:

- Next and back controls
- Skip option
- "Get Started" button

### 3. Privacy and Consent

Explain:

- The prototype does not diagnose drug use.
- Conversations are not intentionally saved.
- Prototype messages are temporarily sent to the local AI laptop.
- Smartwatch information is simulated.
- Trusted-contact and referral messages are simulated.
- The user controls what is shared.

Consent controls:

- Private chatbot processing
- Simulated wearable monitoring
- Trusted-contact alerts
- Optional referral sharing

The user must accept essential consent before continuing.

### 4. Home Dashboard

Display:

- Greeting
- Current support status: green, amber or red
- Monitoring status
- Privacy status
- Quick actions:
  - Talk privately
  - Start monitoring
  - Check in
  - Get support
  - SOS
- Recent alert status without showing conversation content
- "Pause monitoring" control

### 5. Private Chatbot

Include:

- Chat bubbles
- Message input
- Send button
- Typing/loading indicator
- Privacy banner: "This session will not be saved"
- Suggested prompts:
  - "I feel pressured"
  - "I feel stressed"
  - "I'm experiencing cravings"
  - "I need support"
- Risk explanation after classification
- "End private session" button

Chat data rules:

- Keep messages only in React component state.
- Never use AsyncStorage for messages.
- Never print messages with `console.log`.
- Do not include message content in error reports.
- Clear the array when the session ends.
- Ask for confirmation before leaving an active conversation.

### 6. Risk Assessment Result

Display:

- Green, amber or red badge
- Detected support signals
- Confidence values where useful
- Plain-language reasons
- Model uncertainty warning
- Recommended actions
- Disclaimer that this is not a diagnosis

Example:

```text
Amber — You may benefit from support

Signals:
• Peer-pressure language
• Elevated emotional distress

Suggested next step:
Talk to someone you trust or review a refusal strategy.
```

### 7. Simulated Smartwatch Dashboard

Display:

- Heart rate
- HRV
- Activity level
- Sleep quality
- Personal baseline
- Monitoring status
- Animated chart or changing readings

Scenario buttons:

- Normal
- Exercising
- Elevated stress
- Recovery-risk pattern

Expected behaviour:

- Normal: no alert
- Exercise: elevated heart rate explained by activity
- Stress: show wellbeing check-in
- Recovery risk: show check-in and trusted-contact simulation

Clearly label all readings as simulated.

### 8. Physiological Check-In

Prompt:

> "Your body signals have changed. Are you okay?"

Responses:

- I'm fine
- I'm exercising
- I feel stressed
- I'm experiencing cravings
- I need help

Actions:

- "I'm fine" closes the alert.
- "Exercising" explains why readings changed.
- "Stressed" offers grounding exercises.
- "Cravings" opens the recovery-support flow.
- "Need help" opens trusted-contact and SOS choices.

### 9. Coping and Prevention Support

Include curated tools:

- Guided breathing exercise
- Five-senses grounding exercise
- Peer-pressure refusal phrases
- Craving delay timer
- Leave-the-situation safety suggestion
- Call or message a trusted person
- Request counsellor support

No AI-generated medical instructions should be displayed.

### 10. Trusted Contacts

Allow the user to enter a demonstration contact:

- Contact name
- Relationship
- Mock phone number
- Alert permission switch

Display the exact limited alert:

> "Guardian Angel noticed an unusual wellbeing pattern. Please check in with your contact."

Do not include:

- Chat messages
- Drug-use accusations
- Detailed biometrics
- Location without separate consent

The send action must display "Simulation only."

### 11. Counsellor Referral

Show a locally prepared referral summary containing only:

- Pseudonymous user identifier
- User-selected concern
- User-selected support preference
- Risk level
- Request time

The user can:

- Review the summary
- Edit it
- Remove information
- Approve simulated sharing
- Cancel the referral

Never automatically send the conversation transcript.

### 12. SOS and Safety

Include:

- Large press-and-hold SOS button
- Cancellation countdown
- Trusted-contact option
- Simulated location-sharing option
- Simulated emergency-service options
- "I am safe" cancellation
- Clear "Prototype simulation" label

No real emergency call or message should be triggered.

### 13. Privacy and Security Centre

Include:

- Pause monitoring
- End and erase chat session
- Remove trusted contact
- Revoke referral consent
- Clear prototype settings
- Notification privacy toggle
- Explanation of what is and is not stored
- Explanation of future on-device AI
- "Delete all local prototype data" button

## Navigation

Recommended bottom navigation:

```text
Home | Monitor | Chat | Support | Profile
```

SOS should remain visible from the dashboard and support section.

Suggested routes:

```text
app/
  index.tsx
  onboarding.tsx
  consent.tsx
  home.tsx
  chat.tsx
  assessment.tsx
  monitor.tsx
  check-in.tsx
  support.tsx
  trusted-contact.tsx
  referral.tsx
  sos.tsx
  privacy.tsx
```

## Components

Create reusable components:

```text
components/
  PrimaryButton.tsx
  MetricCard.tsx
  RiskBadge.tsx
  ChatBubble.tsx
  PrivacyBanner.tsx
  ConsentToggle.tsx
  SupportActionCard.tsx
  ScenarioButton.tsx
  LoadingIndicator.tsx
```

Use one shared theme:

```text
constants/
  theme.ts
```

Recommended colours:

- Navy: trust and privacy
- Coral/red: SOS and urgent actions
- Green: stable state
- Amber: support recommended
- Light blue: wellbeing and monitoring
- White/light grey: accessible backgrounds

## Mock Classifier

Person 2 should first create:

```text
services/mockClassifier.ts
```

Interface:

```ts
export type RiskLevel = "green" | "amber" | "red";

export type Signal = {
  label: string;
  probability: number;
};

export type ClassificationResult = {
  riskLevel: RiskLevel;
  signals: Signal[];
  reasons: string[];
  recommendedActions: string[];
  uncertain?: boolean;
};
```

Mock function:

```ts
export async function classifyMessage(
  text: string
): Promise<ClassificationResult> {
  const message = text.toLowerCase();

  if (
    message.includes("unsafe") ||
    message.includes("help now")
  ) {
    return {
      riskLevel: "red",
      signals: [
        {
          label: "immediate_help_request",
          probability: 0.96
        }
      ],
      reasons: ["Immediate help language detected"],
      recommendedActions: [
        "Contact a trusted person",
        "Open the safety screen"
      ]
    };
  }

  if (
    message.includes("pressure") ||
    message.includes("craving") ||
    message.includes("use again")
  ) {
    return {
      riskLevel: "amber",
      signals: [
        {
          label: "peer_pressure",
          probability: 0.86
        }
      ],
      reasons: ["A possible support concern was identified"],
      recommendedActions: [
        "Complete a private check-in",
        "Review coping strategies"
      ]
    };
  }

  return {
    riskLevel: "green",
    signals: [],
    reasons: ["No immediate support signals identified"],
    recommendedActions: ["Continue using prevention resources"]
  };
}
```

## Person 1 API Integration

Create:

```text
services/classifierApi.ts
```

Request:

```http
POST http://<PERSON_1_LAPTOP_IP>:8000/classify
Content-Type: application/json
```

Body:

```json
{
  "text": "My friends are pressuring me."
}
```

The returned JSON must use the same `ClassificationResult` interface as the mock classifier.

Configuration:

```ts
const API_URL = "http://192.168.1.10:8000";
```

Requirements:

- Both devices must use the same Wi-Fi.
- Use the laptop's network IP, not `localhost`.
- Add a short request timeout.
- Show a neutral error without repeating the message.
- Fall back to the mock classifier when the API is unavailable.
- Show "Demo classifier unavailable" when fallback is used.

## Wearable Simulator

Create:

```text
data/wearableScenarios.ts
```

Each scenario contains timed readings:

```ts
export type WearableReading = {
  timestamp: number;
  heartRate: number;
  hrv: number;
  activity: "resting" | "walking" | "exercise";
  sleepScore: number;
};

export type WearableScenario = {
  id: string;
  name: string;
  readings: WearableReading[];
  shouldAlert: boolean;
};
```

The simulator should update displayed values every one or two seconds.

It must use activity context to distinguish exercise from unexplained physiological changes.

## Local Notifications

Use `expo-notifications` for an in-app/local demonstration.

Notification:

> "Guardian Angel check-in: Your wellbeing signals have changed. Are you okay?"

Requirements:

- Ask for notification permission.
- Continue functioning if permission is denied.
- Never include drugs, cravings, biometrics, or risk level on the lock screen.
- Do not implement remote push notifications.

## Security Requirements

Person 2 must ensure:

- No secrets are placed in source code.
- No chat content is logged.
- No chat content is persisted.
- No real personal information is required.
- No analytics package records user input.
- Referral sharing requires confirmation.
- Trusted-contact alerts require consent.
- Sensitive notifications use neutral wording.
- The app clearly labels simulations.
- Error messages do not reveal submitted text.
- Git does not contain `.env`, `node_modules`, credentials, or real health information.

Create `.gitignore` entries for:

```text
node_modules/
.expo/
.env
.env.*
*.log
```

## GitHub Responsibilities

Person 2 works on:

```text
feature/mobile-app
```

Recommended commits:

```text
feat: add onboarding and consent flow
feat: add home dashboard navigation
feat: add private chatbot interface
feat: add mock risk classification
feat: add wearable scenario simulator
feat: add check-in and support flow
feat: add referral and SOS screens
feat: connect classifier API
fix: clear chat state when session ends
```

Before integration:

```powershell
git status
git add .
git commit -m "feat: complete mobile prototype flow"
git push -u origin feature/mobile-app
```

Do not merge directly into `main` without testing.

## Five-Hour Priorities

### Must have

- Onboarding and consent
- Home dashboard
- Private chatbot
- Mock classifier
- Person 1 API connection
- Risk result
- Wearable simulation
- Check-in prompt
- Support recommendations
- Session deletion

### Should have

- Trusted-contact simulation
- Referral review
- SOS screen
- Local notifications
- Privacy centre

### Optional polish

- Animated charts
- Mascot animation
- Guided breathing animation
- Dark mode
- Multiple languages
- Installable production build

If time is limited, complete the must-have journey before adding optional screens.

## Final Demo Acceptance Criteria

- App opens through Expo Go.
- Onboarding leads to the dashboard.
- User can start and end a private conversation.
- Ending the session visibly clears all messages.
- Chatbot can call Person 1's model.
- Model results show risk level, reasons, and actions.
- App handles the AI server being unavailable.
- Four wearable scenarios work.
- Exercise does not trigger a recovery-risk claim.
- Stress or recovery scenarios trigger a check-in.
- User can reach support, referral, and SOS screens.
- Every external alert is clearly marked as simulated.
- The full user story can be demonstrated in under three minutes.
