from pathlib import Path

import pandas as pd

from training.generate_dataset import build_examples
from training.validate_data import validate_dataset


def test_generated_dataset_has_required_scope(tmp_path: Path) -> None:
    path = tmp_path / "dataset.csv"
    pd.DataFrame(build_examples()).to_csv(path, index=False)
    validated = validate_dataset(path)
    assert 250 <= len(validated) <= 400

