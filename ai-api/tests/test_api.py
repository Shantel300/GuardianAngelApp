import pytest
from fastapi.testclient import TestClient

from app.main import app, service
from app.schemas import ClassificationResult


@pytest.fixture(autouse=True)
def disable_model_loading(monkeypatch):
    monkeypatch.setattr(service, "load", lambda: None)
    service.loaded = False


def test_health_contract() -> None:
    with TestClient(app) as client:
        response = client.get("/health")
    assert response.status_code == 200
    assert set(response.json()) == {"status", "modelLoaded", "version"}


def test_api_documentation_is_disabled() -> None:
    with TestClient(app) as client:
        assert client.get("/docs").status_code == 404
        assert client.get("/openapi.json").status_code == 404


def test_invalid_input_does_not_echo_message() -> None:
    secret = "PRIVATE_MESSAGE_SHOULD_NOT_RETURN"
    with TestClient(app) as client:
        response = client.post("/classify", json={"text": secret * 200})
    assert response.status_code == 422
    assert secret not in response.text


def test_classification_contract(monkeypatch) -> None:
    expected = ClassificationResult(
        riskLevel="amber",
        signals=[{"label": "peer_pressure", "probability": 0.9}],
        reasons=["The message contains language associated with peer pressure."],
        recommendedActions=["Choose whether to contact someone you trust."],
        uncertain=False,
    )
    monkeypatch.setattr(service, "classify", lambda _: expected)
    with TestClient(app) as client:
        response = client.post(
            "/classify",
            json={"text": "My friends are pressuring me."},
        )
    assert response.status_code == 200
    assert response.json() == expected.model_dump()


def test_submitted_message_is_not_logged(monkeypatch, caplog) -> None:
    secret = "FICTIONAL_PRIVATE_MESSAGE_7319"
    expected = ClassificationResult(
        riskLevel="green",
        signals=[],
        reasons=["No immediate support signals were identified."],
        recommendedActions=["Continue with prevention resources."],
        uncertain=False,
    )
    monkeypatch.setattr(service, "classify", lambda _: expected)
    with TestClient(app) as client:
        response = client.post("/classify", json={"text": secret})
    assert response.status_code == 200
    assert secret not in caplog.text

