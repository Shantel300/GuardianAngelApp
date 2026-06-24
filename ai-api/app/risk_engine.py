from dataclasses import dataclass

from .config import LABELS
from .schemas import ClassificationResult, Signal

REASONS = {
    "general_distress": "The message may describe emotional distress or difficulty coping.",
    "peer_pressure": "The message contains language associated with peer pressure.",
    "substance_exposure": "The message may describe exposure to substance use.",
    "craving_or_relapse_risk": "The message may describe cravings or concern about relapse.",
    "immediate_help_request": "The message contains an explicit request for immediate support.",
}

ACTIONS = {
    "green": [
        "Continue with prevention and wellbeing resources.",
        "Choose a private check-in if you would like more support.",
    ],
    "amber": [
        "Complete a private wellbeing check-in.",
        "Review a coping or refusal strategy.",
        "Choose whether to contact someone you trust.",
    ],
    "red": [
        "Confirm whether you want immediate help.",
        "Open trusted-contact or SOS options.",
        "Stay with a safe person if one is available.",
    ],
}

URGENT_PHRASES = (
    "i need help now",
    "help me now",
    "i am not safe",
    "i'm not safe",
    "i am unsafe",
    "contact someone now",
    "call someone for me",
    "immediate help",
)

SAFE_NEGATIONS = (
    "i do not want to use",
    "i don't want to use",
    "i dont want to use",
    "i will not use",
    "i won't use",
    "i said no when",
)


@dataclass(frozen=True)
class RiskDecision:
    level: str
    uncertain: bool


def _is_uncertain(
    text: str,
    probabilities: dict[str, float],
    thresholds: dict[str, float],
) -> bool:
    if len(text.split()) < 3:
        return True
    margins = [
        abs(probabilities[label] - thresholds[label])
        for label in LABELS
    ]
    return min(margins) < 0.05


def _decide(
    text: str,
    active: set[str],
    probabilities: dict[str, float],
    uncertain: bool,
) -> RiskDecision:
    normalized = text.casefold()
    explicit_urgent = any(phrase in normalized for phrase in URGENT_PHRASES)
    if explicit_urgent or (
        "immediate_help_request" in active
        and probabilities["immediate_help_request"] >= 0.80
    ):
        return RiskDecision("red", False)

    if active & {
        "peer_pressure",
        "substance_exposure",
        "craving_or_relapse_risk",
    }:
        return RiskDecision("amber", uncertain)

    if (
        "general_distress" in active
        and probabilities["general_distress"] >= 0.75
    ):
        return RiskDecision("amber", uncertain)

    return RiskDecision("green", uncertain)


def build_result(
    text: str,
    probabilities: dict[str, float],
    thresholds: dict[str, float],
) -> ClassificationResult:
    normalized = text.casefold()
    too_short = len(text.split()) < 3
    safe_negation = any(phrase in normalized for phrase in SAFE_NEGATIONS)

    active = {
        label
        for label in LABELS
        if probabilities[label] >= thresholds[label]
    }
    if probabilities["immediate_help_request"] < 0.80:
        active.discard("immediate_help_request")
    if too_short or safe_negation:
        active.clear()

    uncertain = _is_uncertain(text, probabilities, thresholds)
    if too_short:
        uncertain = True
    elif safe_negation:
        uncertain = False

    decision = _decide(text, active, probabilities, uncertain)
    ordered = sorted(active, key=probabilities.get, reverse=True)
    signals = [
        Signal(label=label, probability=round(probabilities[label], 4))
        for label in ordered
    ]

    if decision.uncertain and not signals:
        reasons = ["The model is not confident enough to identify a support signal."]
    elif signals:
        reasons = [REASONS[signal.label] for signal in signals]
    else:
        reasons = ["No immediate support signals were identified."]

    return ClassificationResult(
        riskLevel=decision.level,
        signals=signals,
        reasons=reasons,
        recommendedActions=ACTIONS[decision.level],
        uncertain=decision.uncertain,
    )

