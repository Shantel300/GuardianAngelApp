from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from .config import MAX_CHAT_MESSAGES, MAX_MESSAGE_LENGTH

RiskLevel = Literal["green", "amber", "red"]


class ClassificationRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    text: str = Field(min_length=1, max_length=MAX_MESSAGE_LENGTH)

    @field_validator("text")
    @classmethod
    def reject_blank_text(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Message must not be blank")
        return cleaned


class Signal(BaseModel):
    label: str
    probability: float = Field(ge=0.0, le=1.0)


class ClassificationResult(BaseModel):
    riskLevel: RiskLevel
    signals: list[Signal]
    reasons: list[str]
    recommendedActions: list[str]
    uncertain: bool


class HealthResponse(BaseModel):
    status: Literal["ready", "degraded"]
    modelLoaded: bool
    generatorLoaded: bool
    version: str


class ChatMessage(BaseModel):
    model_config = ConfigDict(extra="forbid")
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=MAX_MESSAGE_LENGTH)

    @field_validator("content")
    @classmethod
    def reject_blank_content(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Message must not be blank")
        return cleaned


class ChatRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    messages: list[ChatMessage] = Field(min_length=1, max_length=MAX_CHAT_MESSAGES)

    @model_validator(mode="after")
    def require_final_user_message(self) -> "ChatRequest":
        if self.messages[-1].role != "user":
            raise ValueError("The final message must be from the user")
        return self


class ChatResponse(BaseModel):
    reply: str
    assessment: ClassificationResult
    replySource: Literal["llm", "template"]
