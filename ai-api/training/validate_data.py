from pathlib import Path

import pandas as pd

from app.config import DATA_DIR, LABELS


def validate_dataset(path: Path) -> pd.DataFrame:
    frame = pd.read_csv(path)
    if list(frame.columns) != ["text", *LABELS]:
        raise ValueError("Dataset columns do not match the classifier labels")
    if frame.empty or frame["text"].isna().any():
        raise ValueError("Dataset contains missing messages")
    if frame["text"].str.strip().eq("").any():
        raise ValueError("Dataset contains blank messages")
    if frame["text"].str.casefold().duplicated().any():
        raise ValueError("Dataset contains duplicate messages")
    for label in LABELS:
        if not set(frame[label].unique()) <= {0, 1}:
            raise ValueError(f"{label} contains invalid values")
        if frame[label].sum() < 10:
            raise ValueError(f"{label} has too few positive examples")
    return frame


def main() -> None:
    frame = validate_dataset(DATA_DIR / "synthetic_messages.csv")
    print(f"Dataset valid: {len(frame)} examples")
    print(frame[LABELS].sum().to_string())


if __name__ == "__main__":
    main()

