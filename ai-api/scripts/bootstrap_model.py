"""Download local model assets, or rebuild classifier artifacts if needed."""

import argparse
import sys
from pathlib import Path

# Allow running as a standalone script (`python scripts/bootstrap_model.py`)
# by ensuring the ai-api root is importable, mirroring tests/conftest.py.
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sentence_transformers import SentenceTransformer

from app.config import MODEL_DIR, MODEL_NAME
from app.reply_generator import download_chat_model


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--train",
        action="store_true",
        help="Generate the dataset and train classifier weights as well.",
    )
    parser.add_argument(
        "--classifier-only",
        action="store_true",
        help="Skip downloading the local reply-generation model.",
    )
    args = parser.parse_args()

    if args.train:
        from training.generate_dataset import main as generate_dataset
        from training.train import main as train_model

        generate_dataset()
        train_model()
        if not args.classifier_only:
            download_chat_model()
        return

    destination = MODEL_DIR / "encoder"
    destination.mkdir(parents=True, exist_ok=True)
    encoder = SentenceTransformer(MODEL_NAME)
    encoder.save_pretrained(str(destination))
    print(f"Saved offline encoder to {destination}")
    if not args.classifier_only:
        download_chat_model()
        print(f"Saved offline chat model to {MODEL_DIR / 'chat'}")


if __name__ == "__main__":
    main()
