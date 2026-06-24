from app.reply_generator import CRISIS_REPLY, ReplyGenerator
from app.schemas import ChatMessage, ClassificationResult


def assessment(level: str) -> ClassificationResult:
    return ClassificationResult(
        riskLevel=level,
        signals=[],
        reasons=["Test reason"],
        recommendedActions=["Contact someone you trust."],
        uncertain=False,
    )


def test_red_risk_always_bypasses_generation() -> None:
    generator = ReplyGenerator()
    reply, source = generator.generate(
        [ChatMessage(role="user", content="I am not safe and need help now.")],
        assessment("red"),
    )
    assert reply == CRISIS_REPLY
    assert source == "template"


def test_missing_model_uses_reviewed_template() -> None:
    generator = ReplyGenerator()
    reply, source = generator.generate(
        [ChatMessage(role="user", content="I feel pressured by my friends.")],
        assessment("amber"),
    )
    assert source == "template"
    assert reply


def test_diagnostic_output_is_rejected() -> None:
    assert ReplyGenerator._is_safe("You have a substance use disorder.") is False
    assert ReplyGenerator._is_safe("That sounds hard. Would talking help?") is True


def test_generic_irrelevant_output_is_rejected() -> None:
    amber = assessment("amber")
    assert (
        ReplyGenerator._is_relevant(
            "I'm here to help. Can I assist with anything else?",
            amber,
        )
        is False
    )
    assert (
        ReplyGenerator._is_relevant(
            "That pressure sounds difficult. Would a refusal strategy help?",
            amber,
        )
        is True
    )
