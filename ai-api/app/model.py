import torch
from torch import nn


class MultiLabelClassifier(nn.Module):
    def __init__(
        self,
        input_size: int = 384,
        hidden_size: int = 128,
        output_size: int = 5,
        dropout: float = 0.25,
    ) -> None:
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(input_size, hidden_size),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_size, output_size),
        )

    def forward(self, features: torch.Tensor) -> torch.Tensor:
        return self.network(features)

