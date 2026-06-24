# Person 1 — AI Model and Secure API Plan

## Objective

Person 1 builds the project’s real AI component:

- Synthetic training dataset
- Transformer-based text feature extraction
- Multi-label neural classifier
- Explainable green/amber/red risk engine
- Private FastAPI inference endpoint
- Model evaluation and demo documentation

The model analyses one message at a time. It does not generate chatbot replies, diagnose addiction, store conversations, or analyse smartwatch data.

## Environment Setup

Install:

- Python 3.11
- Git
- Visual Studio Code
- GitHub account
- Stable internet for downloading packages and model weights

Verify:

```powershell
python --version
pip --version
git --version
```

Clone the repository:

```powershell
git clone <repository-url>
cd guardian-angel
git switch -c feature/ai-api
```

Create the AI directory and virtual environment:

```powershell
mkdir ai-api
cd ai-api
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install torch sentence-transformers pandas numpy scikit-learn fastapi "uvicorn[standard]" pydantic joblib pytest
```

Save dependencies:

```powershell
pip freeze > requirements.txt
```

## Model Architecture

Use a CPU-friendly hybrid architecture:

```text
User message
→ all-MiniLM-L6-v2 tokenizer and transformer
→ 384-dimensional sentence embedding
→ small PyTorch neural network
→ five signal probabilities
→ explainable rule engine
→ green / amber / red result
```

Neural classification head:

```text
384 inputs
→ Linear(384, 128)
→ ReLU
→ Dropout
→ Linear(128, 5)
→ Sigmoid probabilities
```

Freeze MiniLM during training. Only train the small classification head, making CPU training practical.

This is genuine deep learning because a pretrained transformer and neural classification layer are used.

## Classification Labels

The model supports multiple labels for one message.

### `general_distress`

Examples:

- Anxiety
- Feeling overwhelmed
- Emotional distress
- Isolation or hopelessness
- Difficulty coping

It must not automatically mean drug-use risk.

### `peer_pressure`

Examples:

- Friends encouraging substance use
- Difficulty saying no
- Fear of exclusion
- Pressure at a party or gathering

### `substance_exposure`

Examples:

- Being offered a substance
- Being around substance use
- Asking about trying a substance
- Regular exposure through peers

Educational discussion should not trigger this label.

### `craving_or_relapse_risk`

Examples:

- Feeling tempted to use again
- Experiencing cravings
- Returning to triggering situations
- Concern about relapse during recovery

### `immediate_help_request`

Examples:

- “I need help now”
- “I am not safe”
- “Please contact someone”
- Explicit request for urgent support

This label should be based on clear language, not vague model inference.

## Dataset

Create 250–400 fictional English messages.

Recommended distribution:

- 50–70 general-distress examples
- 40–60 peer-pressure examples
- 40–60 substance-exposure examples
- 40–60 craving/relapse examples
- 30–40 immediate-help examples
- 80–100 neutral or difficult-negative examples
- At least 50 examples containing multiple labels

CSV structure:

```csv
text,general_distress,peer_pressure,substance_exposure,craving_or_relapse_risk,immediate_help_request
"I feel overwhelmed and cannot calm down",1,0,0,0,0
"My friends want me to try something tonight",0,1,1,0,0
"I feel tempted to use again",1,0,0,1,0
"I am unsafe and need help now",1,0,0,0,1
"We studied drug prevention in class",0,0,0,0,0
```

Include difficult negative examples:

- “We discussed drugs at school.”
- “I watched a documentary about addiction.”
- “I do not want to use drugs.”
- “My assignment is about peer pressure.”
- “Exercise increased my heart rate.”
- “I’m stressed about my examinations.”
- “My friend said, ‘I need help,’ in a movie.”
- “I used to struggle, but I feel safe now.”

Include spelling variations and informal language, but only claim English support for the prototype.

Do not use:

- Real conversations
- Patient records
- Social-media posts
- Names, addresses or phone numbers
- Data copied from private sources

## Dataset Validation

Person 1 must check:

- Every row contains all five binary labels.
- Labels contain only `0` or `1`.
- Empty messages are rejected.
- Duplicate messages are removed.
- No personally identifiable information is included.
- Neutral examples are present.
- Each label appears in training, validation and test sets.

Split using a fixed random seed:

- 70% training
- 15% validation
- 15% testing

Never train on the final test set.

## Training Pipeline

Person 1 implements:

1. Load and validate the CSV.
2. Generate MiniLM embeddings.
3. Cache embeddings locally to avoid repeated transformer processing.
4. Split data using the fixed seed.
5. Train the neural classification head.
6. Calculate validation loss after each epoch.
7. Stop training when validation performance stops improving.
8. Select one probability threshold per label.
9. Evaluate once on the untouched test set.
10. Save:
   - classifier weights;
   - label names;
   - thresholds;
   - model configuration.

Suggested training settings:

```text
Batch size: 16–32
Learning rate: 0.001
Maximum epochs: 30
Early-stopping patience: 5
Loss: BCEWithLogitsLoss
Optimizer: Adam
Random seed: 42
```

Because the dataset may be imbalanced, use per-label positive weights or report the imbalance honestly.

## Risk Clarification Engine

The neural model predicts support signals. Transparent rules determine the support level.

### Green

Return green when:

- No label crosses its threshold
- The message appears neutral or educational
- Only low-confidence general distress is found
- The classifier is uncertain

Actions:

- Prevention resources
- Optional wellbeing check-in
- Continue private conversation

### Amber

Return amber when:

- `peer_pressure` is detected
- `substance_exposure` is detected
- `craving_or_relapse_risk` is detected without immediate danger
- Strong general distress is combined with another support signal
- Multiple moderate signals are detected

Actions:

- Coping or grounding exercise
- Peer-pressure refusal strategies
- Contact a trusted person
- Optional counsellor referral

### Red

Return red only when:

- `immediate_help_request` exceeds its conservative threshold
- The user explicitly says they are unsafe
- The user manually activates SOS

Actions:

- Ask whether the user wants immediate help
- Offer trusted-contact and SOS controls
- Keep human confirmation in the process

The model must never silently contact another person.

## Explainable Results

Every result includes plain-language reasons.

Example:

```json
{
  "riskLevel": "amber",
  "signals": [
    {
      "label": "peer_pressure",
      "probability": 0.91
    },
    {
      "label": "substance_exposure",
      "probability": 0.76
    }
  ],
  "reasons": [
    "The message contains language associated with peer pressure.",
    "The message may describe exposure to substance use."
  ],
  "recommendedActions": [
    "Review a refusal strategy.",
    "Complete a private wellbeing check-in.",
    "Choose whether to contact someone you trust."
  ],
  "uncertain": false
}
```

Do not expose raw neural-network internals as if they were medical explanations.

## Uncertainty Handling

Return `uncertain: true` when:

- Every probability is near its threshold
- The text is extremely short
- The message is blank or meaningless
- The model produces conflicting signals
- The input is outside the validated English scope

Response:

> “The system is uncertain. Please select how you are feeling.”

The application should then display manual check-in options.

## FastAPI Service

Required endpoints:

### Health check

```http
GET /health
```

Response:

```json
{
  "status": "ready",
  "modelLoaded": true,
  "version": "prototype-1"
}
```

### Classification

```http
POST /classify
```

Request:

```json
{
  "text": "My friends are pressuring me to try something."
}
```

Response:

```json
{
  "riskLevel": "amber",
  "signals": [
    {
      "label": "peer_pressure",
      "probability": 0.89
    }
  ],
  "reasons": [
    "The message contains language associated with peer pressure."
  ],
  "recommendedActions": [
    "Review a refusal strategy.",
    "Contact someone you trust."
  ],
  "uncertain": false
}
```

Validation rules:

- Reject empty input.
- Set a reasonable maximum message length.
- Accept plain text only.
- Return generic errors.
- Never include the original message in errors.

## Privacy and Security

For the hackathon API:

- Process only one message at a time.
- Keep no conversation history.
- Do not write messages to files or databases.
- Do not print request bodies.
- Do not use analytics or telemetry.
- Avoid access logs containing sensitive query parameters.
- Never place messages in URLs.
- Do not expose API documentation publicly during the demo.
- Limit accepted request size.
- Add basic rate limiting if time permits.
- Allow requests only from the expected development origin or local network.
- Shut down the server after the demonstration.

Run without normal access logs:

```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000 --no-access-log
```

The local prototype uses HTTP over trusted Wi-Fi and is not confidential from network or laptop administrators. Use fictional demonstration messages only.

The production version will move inference onto the phone so plaintext conversations never reach a server.

## Connecting to Person 2

Find the laptop IP:

```powershell
ipconfig
```

Person 2 uses:

```text
http://<PERSON_1_IPV4_ADDRESS>:8000
```

Both devices must be connected to the same network.

Test from the laptop:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8000/classify" `
  -ContentType "application/json" `
  -Body '{"text":"My friends are pressuring me."}'
```

Then test from the phone through the React Native application.

If Windows Firewall blocks access, Person 1 may need to permit Python or port 8000 on the private network.

## Shared Contract With Person 2

Person 1 must not change these response properties without coordination:

```ts
type RiskLevel = "green" | "amber" | "red";

type Signal = {
  label: string;
  probability: number;
};

type ClassificationResult = {
  riskLevel: RiskLevel;
  signals: Signal[];
  reasons: string[];
  recommendedActions: string[];
  uncertain: boolean;
};
```

Person 2 should be able to switch between the mock classifier and real API without changing the interface.

## Recommended Repository Contents

Person 1 owns `ai-api/`, containing:

```text
ai-api/
├── app/
│   ├── main.py
│   ├── inference.py
│   ├── risk_engine.py
│   └── schemas.py
├── training/
│   ├── train.py
│   ├── evaluate.py
│   └── validate_data.py
├── data/
│   └── synthetic_messages.csv
├── models/
├── tests/
├── requirements.txt
└── README.md
```

Model files may be committed only if they are reasonably small and allowed by GitHub. Otherwise, package them separately with clear download instructions.

## Testing

### Model tests

Test messages about:

- General stress
- Peer pressure
- Substance exposure
- Recovery cravings
- Immediate requests for help
- Educational discussion
- Negation
- Quotations
- Very short messages
- Misspellings
- Multiple simultaneous labels

### API tests

Verify:

- Valid classification
- Empty input rejection
- Oversized input rejection
- Invalid JSON
- Model unavailable
- Repeated requests
- Original messages absent from logs
- Returned JSON matches the shared contract

### Safety tests

Examples that should not automatically become red:

- “I am stressed about school.”
- “We discussed drugs in class.”
- “I don’t want to use.”
- “My heart rate increased while running.”

Examples expected to request urgent confirmation:

- “I am unsafe and need help now.”
- “Please contact someone for me.”
- “I need immediate support.”

## Evaluation Report

Report:

- Precision per label
- Recall per label
- F1 per label
- Macro-average F1
- Test-set size
- Inference time on CPU
- False-positive examples
- False-negative examples
- Selected thresholds

Do not use accuracy as the only metric.

State clearly:

> “This model was trained on synthetic demonstration data and has not been clinically validated.”

## Five-Hour Schedule

### 0:00–0:30

- Install dependencies.
- Confirm MiniLM downloads and loads.
- Agree on the API contract.
- Create the dataset template.

### 0:30–1:30

- Generate and review synthetic examples.
- Validate labels.
- Create train, validation and test splits.
- Person 2 uses mock API responses meanwhile.

### 1:30–2:15

- Generate embeddings.
- Train the neural classification head.
- Tune validation thresholds.
- Save the best model.

### 2:15–3:00

- Evaluate the untouched test set.
- Implement the risk engine.
- Implement `/health` and `/classify`.

### 3:00–3:45

- Connect Person 2’s phone to the API.
- Fix JSON, CORS, networking and timeout issues.
- Test green, amber, red and uncertain outcomes.

### 3:45–4:30

- Run difficult safety examples.
- Confirm messages are not logged.
- Prepare metrics and architecture diagram.

### 4:30–5:00

- Rehearse the demonstration.
- Keep a working saved model.
- Export sample API responses as a backup.
- Prepare a screenshot of evaluation results.

## Person 1 Deliverables

Must have:

- Synthetic labelled dataset
- Dataset validation script
- Transformer embedding pipeline
- Trained neural classifier
- Saved model and thresholds
- Explainable risk engine
- Working FastAPI endpoint
- Evaluation metrics
- API integration instructions
- Privacy limitations documented

Optional:

- Confusion-matrix chart
- Threshold-comparison chart
- Automated API tests
- French or Creole experimental examples
- Model interpretability visualisation

## Acceptance Criteria

- Training runs on a CPU laptop.
- The final test data is excluded from training.
- The model predicts all five labels.
- The API uses the agreed JSON contract.
- Risk levels come from explainable rules.
- Uncertain outputs request user clarification.
- The React Native app can call the laptop API.
- Messages are not deliberately stored or logged.
- No result claims that drug use was detected.
- The demonstration clearly identifies synthetic data and simulated wearable monitoring.
- A mock response fallback exists if the live API fails.
