import json
import random

import numpy as np
import pandas as pd
import torch
from sklearn.metrics import precision_recall_fscore_support
from sklearn.model_selection import train_test_split
from sentence_transformers import SentenceTransformer
from torch import nn
from torch.utils.data import DataLoader, TensorDataset

from app.config import DATA_DIR, LABELS, MODEL_DIR, MODEL_NAME
from app.model import MultiLabelClassifier
from training.validate_data import validate_dataset

SEED = 42


def split_indices(labels: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    indices = np.arange(len(labels))
    patterns = np.array(["".join(map(str, row.astype(int))) for row in labels])
    counts = pd.Series(patterns).value_counts()
    strata = np.array([pattern if counts[pattern] >= 3 else "rare" for pattern in patterns])
    if pd.Series(strata).value_counts().min() < 2:
        strata = None
    train, remainder = train_test_split(
        indices, test_size=0.30, random_state=SEED, stratify=strata
    )
    validation, test = train_test_split(
        remainder, test_size=0.50, random_state=SEED
    )
    return train, validation, test


def predict(
    model: MultiLabelClassifier,
    features: np.ndarray,
    indices: np.ndarray,
) -> np.ndarray:
    model.eval()
    with torch.inference_mode():
        tensor = torch.tensor(features[indices], dtype=torch.float32)
        return torch.sigmoid(model(tensor)).numpy()


def select_thresholds(
    truth: np.ndarray,
    probabilities: np.ndarray,
) -> dict[str, float]:
    thresholds: dict[str, float] = {}
    for index, label in enumerate(LABELS):
        best_threshold, best_f1 = 0.5, -1.0
        for threshold in np.arange(0.25, 0.81, 0.05):
            predictions = (probabilities[:, index] >= threshold).astype(int)
            _, _, f1, _ = precision_recall_fscore_support(
                truth[:, index],
                predictions,
                average="binary",
                zero_division=0,
            )
            if f1 > best_f1:
                best_threshold, best_f1 = float(threshold), float(f1)
        thresholds[label] = round(best_threshold, 2)
    return thresholds


def report_metrics(
    truth: np.ndarray,
    probabilities: np.ndarray,
    thresholds: dict[str, float],
) -> dict[str, object]:
    limits = np.array([thresholds[label] for label in LABELS])
    predictions = (probabilities >= limits).astype(int)
    precision, recall, f1, support = precision_recall_fscore_support(
        truth, predictions, average=None, zero_division=0
    )
    macro = precision_recall_fscore_support(
        truth, predictions, average="macro", zero_division=0
    )
    return {
        "per_label": {
            label: {
                "precision": round(float(precision[index]), 4),
                "recall": round(float(recall[index]), 4),
                "f1": round(float(f1[index]), 4),
                "support": int(support[index]),
                "threshold": thresholds[label],
            }
            for index, label in enumerate(LABELS)
        },
        "macro": {
            "precision": round(float(macro[0]), 4),
            "recall": round(float(macro[1]), 4),
            "f1": round(float(macro[2]), 4),
        },
    }


def main() -> None:
    random.seed(SEED)
    np.random.seed(SEED)
    torch.manual_seed(SEED)

    frame = validate_dataset(DATA_DIR / "synthetic_messages.csv")
    labels = frame[LABELS].to_numpy(dtype=np.float32)
    encoder = SentenceTransformer(MODEL_NAME)
    features = encoder.encode(
        frame["text"].tolist(),
        batch_size=32,
        show_progress_bar=True,
        normalize_embeddings=True,
    )
    train_idx, validation_idx, test_idx = split_indices(labels)

    model = MultiLabelClassifier(input_size=features.shape[1])
    positive = labels[train_idx].sum(axis=0)
    positive_weights = torch.tensor(
        (len(train_idx) - positive) / np.maximum(positive, 1),
        dtype=torch.float32,
    )
    loss_function = nn.BCEWithLogitsLoss(pos_weight=positive_weights)
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
    loader = DataLoader(
        TensorDataset(
            torch.tensor(features[train_idx], dtype=torch.float32),
            torch.tensor(labels[train_idx], dtype=torch.float32),
        ),
        batch_size=32,
        shuffle=True,
    )
    validation_features = torch.tensor(features[validation_idx], dtype=torch.float32)
    validation_labels = torch.tensor(labels[validation_idx], dtype=torch.float32)
    best_loss, best_state = float("inf"), None

    for epoch in range(1, 31):
        model.train()
        for batch_features, batch_labels in loader:
            optimizer.zero_grad()
            loss = loss_function(model(batch_features), batch_labels)
            loss.backward()
            optimizer.step()
        model.eval()
        with torch.inference_mode():
            validation_loss = loss_function(
                model(validation_features), validation_labels
            ).item()
        print(f"epoch={epoch:02d} validation_loss={validation_loss:.4f}")
        if validation_loss < best_loss:
            best_loss = validation_loss
            best_state = {
                key: value.detach().clone()
                for key, value in model.state_dict().items()
            }

    if best_state is None:
        raise RuntimeError("Training did not produce a model")
    model.load_state_dict(best_state)
    thresholds = select_thresholds(
        labels[validation_idx],
        predict(model, features, validation_idx),
    )
    report = report_metrics(
        labels[test_idx],
        predict(model, features, test_idx),
        thresholds,
    )
    report["dataset"] = {
        "total": len(frame),
        "train": len(train_idx),
        "validation": len(validation_idx),
        "test": len(test_idx),
        "source": "synthetic demonstration data",
    }

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    encoder.save_pretrained(str(MODEL_DIR / "encoder"))
    torch.save(model.state_dict(), MODEL_DIR / "classifier.pt")
    (MODEL_DIR / "thresholds.json").write_text(
        json.dumps(thresholds, indent=2), encoding="utf-8"
    )
    (MODEL_DIR / "metadata.json").write_text(
        json.dumps(
            {
                "model_name": MODEL_NAME,
                "embedding_dimension": int(features.shape[1]),
                "hidden_size": 128,
                "dropout": 0.25,
                "labels": LABELS,
                "random_seed": SEED,
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    (MODEL_DIR / "evaluation.json").write_text(
        json.dumps(report, indent=2), encoding="utf-8"
    )
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()

