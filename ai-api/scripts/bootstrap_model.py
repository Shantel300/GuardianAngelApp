"""Download MiniLM locally, or rebuild all model artifacts if needed."""

import argparse
import sys
from pathlib import Path

# Allow running as a standalone script (`python scripts/bootstrap_model.py`)
# by ensuring the ai-api root is importable, mirroring tests/conftest.py.
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sentence_transformers import SentenceTransformer

from app.config import MODEL_DIR, MODEL_NAME


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--train",
        action="store_true",
        help="Generate the dataset and train classifier weights as well.",
    )
    args = parser.parse_args()

    if args.train:
        from training.generate_dataset import main as generate_dataset
        from training.train import main as train_model

        generate_dataset()
        train_model()
        return

    destination = MODEL_DIR / "encoder"
    destination.mkdir(parents=True, exist_ok=True)
    encoder = SentenceTransformer(MODEL_NAME)
    encoder.save_pretrained(str(destination))
    print(f"Saved offline encoder to {destination}")


if __name__ == "__main__":
    main()

