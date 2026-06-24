# Guardian Angel AI API

CPU-friendly multi-label classifier for the Guardian Angel hackathon prototype.
It uses synthetic demonstration data and is not clinically validated.

## Setup

```powershell
cd ai-api
uv venv --python 3.11 .venv
uv pip install --python .venv/Scripts/python.exe -r requirements.txt
.\.venv\Scripts\Activate.ps1
```

## Build model artifacts

The repository includes classifier weights and evaluation metadata. Download
the 90 MB classifier encoder and local SmolLM2 reply model once:

```powershell
python scripts/bootstrap_model.py
```

To regenerate the synthetic dataset, train the neural classifier, evaluate it,
and export the encoder:

```powershell
python scripts/bootstrap_model.py --train
```

## Run

```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000 --no-access-log
```

`GET /health` reports whether all local artifacts are ready. `POST /classify`
accepts `{ "text": "..." }` and returns `riskLevel`, `signals`, `reasons`,
`recommendedActions`, and `uncertain`.

`POST /chat` accepts at most four in-memory user/assistant messages. It
classifies the latest user message, applies a safety gate, and then returns a
short generated or reviewed template reply. Red-risk results always bypass
free-form generation.

On low-memory CPU laptops the optimized 135M generator is used only for
low-risk conversation. Amber and red replies use immediate reviewed language,
which keeps high-impact responses fast and predictable.

The service keeps no conversation history, writes no submitted messages, and
does not expose interactive API documentation. Use only fictional messages
over trusted local Wi-Fi during the prototype demo.

## Verify

```powershell
pytest -q
```
