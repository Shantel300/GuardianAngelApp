import csv
import random

from app.config import DATA_DIR, LABELS


def row(text: str, *active: str) -> dict[str, str | int]:
    return {
        "text": text,
        **{label: int(label in active) for label in LABELS},
    }


def build_examples() -> list[dict[str, str | int]]:
    examples: list[dict[str, str | int]] = []

    distress = [
        "I feel overwhelmed",
        "I have been anxious",
        "I cannot calm down",
        "I feel isolated",
        "Everything feels too much",
        "I am struggling to cope",
        "I have been feeling hopeless",
        "My stress is getting worse",
    ]
    contexts = [
        "after school",
        "most evenings",
        "when I am alone",
        "because of problems at home",
        "and I cannot focus",
        "for the past few days",
        "and I do not know who to talk to",
        "when people argue around me",
    ]
    for lead in distress:
        for context in contexts:
            examples.append(row(f"{lead} {context}.", "general_distress"))

    pressure = [
        "My friends keep pressuring me",
        "People at the party want me",
        "My group says I have to",
        "Someone keeps daring me",
        "I am scared my friends will reject me if I do not",
        "They keep telling me it is harmless if I",
        "My classmates are pushing me",
        "I do not know how to say no when they ask me",
    ]
    actions = [
        "try their pills",
        "smoke with them",
        "take something tonight",
        "drink what they brought",
        "use what they are offering",
        "join them after school",
    ]
    for lead in pressure:
        for action in actions:
            examples.append(
                row(f"{lead} {action}.", "peer_pressure", "substance_exposure")
            )

    exposure = [
        "People were using substances near me at {place}.",
        "Someone offered me an unknown pill at {place}.",
        "There are drugs around me when I go to {place}.",
        "I saw someone sharing a substance at {place}.",
        "A person asked whether I wanted to try something at {place}.",
        "I keep ending up around people who use at {place}.",
    ]
    places = [
        "a party",
        "the park",
        "a friend's house",
        "a gathering",
        "the bus stop",
        "after school",
        "the weekend event",
        "my neighbourhood",
    ]
    for template in exposure:
        for place in places:
            examples.append(row(template.format(place=place), "substance_exposure"))

    cravings = [
        "I feel tempted to use again",
        "The cravings are strong",
        "I keep thinking about going back",
        "I am worried I might relapse",
        "I want to stay in recovery but I feel tempted",
        "Being here makes me want to use again",
        "I am struggling with cravings",
        "I nearly used again",
    ]
    craving_contexts = [
        "tonight",
        "when I feel stressed",
        "after seeing old friends",
        "and I need a distraction",
        "because I feel alone",
        "after a difficult day",
    ]
    for lead in cravings:
        for context in craving_contexts:
            examples.append(
                row(
                    f"{lead} {context}.",
                    "general_distress",
                    "craving_or_relapse_risk",
                )
            )

    urgent = [
        "I need help now.",
        "I am not safe and need someone now.",
        "Please contact someone for me immediately.",
        "Help me now, I do not feel safe.",
        "I am unsafe and need support right away.",
        "Please call someone for me.",
        "I need immediate help from a trusted person.",
        "Contact someone now because I feel unsafe.",
        "I cannot manage this and need help now.",
        "Please stay with me and get help.",
        "I need urgent support.",
        "I am in danger and want someone contacted.",
    ]
    for message in urgent:
        examples.append(row(message, "general_distress", "immediate_help_request"))

    urgent_craving = [
        "My cravings are intense and I need help now.",
        "I feel like using again and I am not safe.",
        "I may relapse tonight, please contact someone.",
        "I cannot manage this craving and need immediate help.",
        "I am tempted to use and want urgent support.",
        "Please help me now because I might use again.",
        "I am in a triggering place and need someone to call me.",
        "I feel overwhelmed by cravings and I am unsafe.",
    ]
    for message in urgent_craving:
        examples.append(
            row(
                message,
                "general_distress",
                "craving_or_relapse_risk",
                "immediate_help_request",
            )
        )

    neutral = [
        "We discussed drug prevention in class.",
        "My assignment is about peer pressure.",
        "I watched a documentary about addiction recovery.",
        "I do not want to use drugs.",
        "I am preparing a school presentation about substance misuse.",
        "Exercise made my heart rate increase.",
        "I feel stressed about my examination.",
        "The news report mentioned illegal substances.",
        "My friend said the actor needed help in the movie.",
        "I used to struggle, but I feel safe and supported now.",
        "I am reading about how counsellors support recovery.",
        "Our teacher explained how to refuse peer pressure.",
        "I am tired after football practice.",
        "Coffee made me feel restless this morning.",
        "I want general information about staying healthy.",
        "The app should protect private conversations.",
        "I am learning about first aid.",
        "My family attended a prevention workshop.",
        "I said no when someone offered me something.",
        "I am proud that I followed my recovery plan today.",
    ]
    suffixes = [
        "",
        " It was educational.",
        " I am asking for general information.",
        " This is for a project.",
        " I feel safe right now.",
    ]
    for message in neutral:
        for suffix in suffixes:
            examples.append(row(f"{message}{suffix}"))

    random.Random(42).shuffle(examples)
    unique = {str(item["text"]).casefold(): item for item in examples}
    return list(unique.values())


def main() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    destination = DATA_DIR / "synthetic_messages.csv"
    examples = build_examples()
    with destination.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=["text", *LABELS])
        writer.writeheader()
        writer.writerows(examples)
    print(f"Wrote {len(examples)} synthetic examples to {destination}")


if __name__ == "__main__":
    main()

