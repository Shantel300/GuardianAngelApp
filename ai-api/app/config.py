from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
MODEL_DIR = BASE_DIR / "models"
DATA_DIR = BASE_DIR / "data"

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
MAX_MESSAGE_LENGTH = 1_000

LABELS = [
    "general_distress",
    "peer_pressure",
    "substance_exposure",
    "craving_or_relapse_risk",
    "immediate_help_request",
]

