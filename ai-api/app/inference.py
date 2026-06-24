import json
from pathlib import Path

import torch
from sentence_transformers import SentenceTransformer

from .config import LABELS, MODEL_DIR
from .model import MultiLabelClassifier
from .risk_engine import build_result
from .schemas import ClassificationResult


class ModelNotReadyError(RuntimeError):
    pass


class ModelService:
    def __init__(self, model_dir: Path = MODEL_DIR) -> None:
        self.model_dir = model_dir
        self.encoder: SentenceTransformer | None = None
        self.classifier: MultiLabelClassifier | None = None
        self.thresholds: dict[str, float] = {}
        self.loaded = False

    def load(self) -> None:
        weights = self.model_dir / "classifier.pt"
        thresholds = self.model_dir / "thresholds.json"
        metadata = self.model_dir / "metadata.json"
        encoder = self.model_dir / "encoder"
        if not all(path.exists() for path in (weights, thresholds, metadata, encoder)):
            self.loaded = False
            return

        model_metadata = json.loads(metadata.read_text(encoding="utf-8"))
        if model_metadata["labels"] != LABELS:
            raise ModelNotReadyError("Saved model labels do not match the API")

        self.encoder = SentenceTransformer(str(encoder), local_files_only=True)
        self.classifier = MultiLabelClassifier(
            input_size=model_metadata["embedding_dimension"],
            hidden_size=model_metadata["hidden_size"],
            output_size=len(LABELS),
            dropout=model_metadata["dropout"],
        )
        state = torch.load(weights, map_location="cpu", weights_only=True)
        self.classifier.load_state_dict(state)
        self.classifier.eval()
        self.thresholds = json.loads(thresholds.read_text(encoding="utf-8"))
        self.loaded = True

    def classify(self, text: str) -> ClassificationResult:
        if not self.loaded or self.encoder is None or self.classifier is None:
            raise ModelNotReadyError("Model is not ready")

        embedding = self.encoder.encode(
            [text],
            convert_to_tensor=True,
            normalize_embeddings=True,
            show_progress_bar=False,
        ).cpu()
        with torch.inference_mode():
            values = torch.sigmoid(self.classifier(embedding))[0].tolist()
        return build_result(
            text,
            dict(zip(LABELS, values, strict=True)),
            self.thresholds,
        )

