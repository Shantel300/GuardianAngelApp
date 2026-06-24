from app.config import LABELS
from app.risk_engine import build_result

THRESHOLDS = {label: 0.5 for label in LABELS}


def probabilities(**overrides: float) -> dict[str, float]:
    values = {label: 0.1 for label in LABELS}
    values.update(overrides)
    return values


def test_neutral_message_is_green() -> None:
    result = build_result(
        "We discussed prevention in class today.",
        probabilities(),
        THRESHOLDS,
    )
    assert result.riskLevel == "green"
    assert result.signals == []


def test_peer_pressure_is_amber() -> None:
    result = build_result(
        "My friends keep pressuring me to try it.",
        probabilities(peer_pressure=0.9, substance_exposure=0.7),
        THRESHOLDS,
    )
    assert result.riskLevel == "amber"


def test_explicit_help_request_is_red() -> None:
    result = build_result(
        "I am not safe and need help now.",
        probabilities(immediate_help_request=0.95, general_distress=0.8),
        THRESHOLDS,
    )
    assert result.riskLevel == "red"
    assert result.uncertain is False


def test_short_message_requests_clarification() -> None:
    result = build_result(
        "not sure",
        probabilities(substance_exposure=0.8),
        THRESHOLDS,
    )
    assert result.riskLevel == "green"
    assert result.uncertain is True
    assert result.signals == []


def test_clear_negation_is_not_escalated() -> None:
    result = build_result(
        "I do not want to use drugs.",
        probabilities(substance_exposure=0.8),
        THRESHOLDS,
    )
    assert result.riskLevel == "green"
    assert result.signals == []

