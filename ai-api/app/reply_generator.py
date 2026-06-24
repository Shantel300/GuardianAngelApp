from __future__ import annotations

import re
from pathlib import Path

import torch
from huggingface_hub import snapshot_download
from transformers import AutoModelForCausalLM, AutoTokenizer

from .config import CHAT_MODEL_NAME, MAX_REPLY_TOKENS, MODEL_DIR
from .schemas import ChatMessage, ClassificationResult

CRISIS_REPLY = (
    "It sounds like you may need immediate support. "
    "Would you like to contact someone you trust or open the SOS options now?"
)

TEMPLATE_REPLIES = {
    "green": (
        "Thank you for sharing that. I’m here with you. "
        "Would you like to tell me a little more or try a wellbeing check-in?"
    ),
    "amber": (
        "That sounds difficult, and you do not have to handle it alone. "
        "Would you like to explore a coping strategy or contact someone you trust?"
    ),
    "red": CRISIS_REPLY,
}

BLOCKED_OUTPUT_PATTERNS = (
    r"\byou (?:have|are suffering from)\b",
    r"\bi diagnose\b",
    r"\bdiagnos(?:e|is|ed)\b",
    r"\btake \d+\s*(?:mg|milligrams?)\b",
    r"\bstop taking\b",
    r"\boverdose instructions?\b",
    r"\bpolice report\b",
)

SYSTEM_PROMPT = """You are Guardian, a calm youth wellbeing support companion.
Write one complete empathetic sentence of fewer than twenty words.
Do not diagnose, identify drug use, prescribe treatment, or invent emergency guidance.
Do not claim to be a therapist or promise confidentiality.
Use only the approved next actions supplied below.
Ask one gentle question. Do not mention probabilities or internal labels.
Directly respond to the user's latest message. Do not say "How can I help?"."""


class ReplyGenerator:
    def __init__(self, model_dir: Path = MODEL_DIR / "chat") -> None:
        self.model_dir = model_dir
        self.tokenizer = None
        self.model = None
        self.loaded = False

    def load(self) -> None:
        if not self.model_dir.exists():
            self.loaded = False
            return
        self.tokenizer = AutoTokenizer.from_pretrained(
            self.model_dir,
            local_files_only=True,
        )
        self.model = AutoModelForCausalLM.from_pretrained(
            self.model_dir,
            local_files_only=True,
            dtype=torch.float16,
            low_cpu_mem_usage=True,
        )
        self.model.eval()
        torch.set_num_threads(min(4, max(torch.get_num_threads(), 1)))
        self.loaded = True

    def generate(
        self,
        messages: list[ChatMessage],
        assessment: ClassificationResult,
    ) -> tuple[str, str]:
        if assessment.riskLevel == "red":
            return CRISIS_REPLY, "template"
        # Higher-impact support replies use reviewed, classifier-conditioned
        # language. The tiny local model is reserved for low-risk conversation.
        if assessment.riskLevel == "amber":
            return TEMPLATE_REPLIES["amber"], "template"
        if not self.loaded or self.tokenizer is None or self.model is None:
            return TEMPLATE_REPLIES[assessment.riskLevel], "template"

        approved_actions = "; ".join(assessment.recommendedActions)
        context = [
            {
                "role": "system",
                "content": (
                    f"{SYSTEM_PROMPT}\n"
                    f"Current support level: {assessment.riskLevel}.\n"
                    f"Approved next actions: {approved_actions}"
                ),
            },
            *[
                {"role": message.role, "content": message.content}
                for message in messages[-4:]
            ],
        ]
        prompt = self.tokenizer.apply_chat_template(
            context,
            tokenize=False,
            add_generation_prompt=True,
        )
        inputs = self.tokenizer(prompt, return_tensors="pt")
        with torch.inference_mode():
            output = self.model.generate(
                **inputs,
                max_new_tokens=MAX_REPLY_TOKENS,
                do_sample=False,
                repetition_penalty=1.1,
                pad_token_id=self.tokenizer.eos_token_id,
            )
        generated = output[0][inputs["input_ids"].shape[-1] :]
        reply = self.tokenizer.decode(generated, skip_special_tokens=True).strip()
        reply = self._complete_sentence(reply)
        if not self._is_safe(reply) or not self._is_relevant(reply, assessment):
            return TEMPLATE_REPLIES[assessment.riskLevel], "template"
        return reply, "llm"

    @staticmethod
    def _is_safe(reply: str) -> bool:
        if not reply or len(reply) > 600:
            return False
        if len(re.findall(r"[.!?]+", reply)) > 4:
            return False
        normalized = reply.casefold()
        return not any(
            re.search(pattern, normalized)
            for pattern in BLOCKED_OUTPUT_PATTERNS
        )

    @staticmethod
    def _is_relevant(
        reply: str,
        assessment: ClassificationResult,
    ) -> bool:
        normalized = reply.casefold()
        generic_failures = (
            "how can i help",
            "assist with anything else",
            "as an ai",
            "i don't understand",
        )
        if any(phrase in normalized for phrase in generic_failures):
            return False
        if assessment.riskLevel == "amber":
            support_terms = (
                "difficult",
                "pressure",
                "support",
                "trust",
                "cope",
                "strategy",
                "safe",
                "alone",
            )
            return any(term in normalized for term in support_terms)
        return True

    @staticmethod
    def _complete_sentence(reply: str) -> str:
        matches = list(re.finditer(r"[.!?]", reply))
        if matches:
            return reply[: matches[-1].end()].strip()
        return ""


def download_chat_model(destination: Path = MODEL_DIR / "chat") -> None:
    destination.mkdir(parents=True, exist_ok=True)
    snapshot_download(
        repo_id=CHAT_MODEL_NAME,
        local_dir=destination,
        allow_patterns=[
            "config.json",
            "generation_config.json",
            "model.safetensors",
            "tokenizer.json",
            "tokenizer_config.json",
            "special_tokens_map.json",
            "vocab.json",
            "merges.txt",
            "chat_template.jinja",
        ],
    )
