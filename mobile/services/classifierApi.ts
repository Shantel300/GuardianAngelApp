import axios from 'axios';
import {
  ClassificationResult,
  RiskLevel,
  classifyMessage as mockClassify,
} from './mockClassifier';

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.10:8000';
const API_TIMEOUT = 5000;

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

export type ClassificationSource = 'api' | 'mock';

export type SourcedClassificationResult = ClassificationResult & {
  source: ClassificationSource;
};

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type ReplySource = 'llm' | 'template' | 'mock';

export type ChatResult = {
  reply: string;
  assessment: SourcedClassificationResult;
  replySource: ReplySource;
};

type ApiChatResult = {
  reply: string;
  assessment: ClassificationResult;
  replySource: 'llm' | 'template';
};

type HealthResponse = {
  status: 'ready' | 'degraded';
  modelLoaded: boolean;
  version: string;
};

const RISK_LEVELS: RiskLevel[] = ['green', 'amber', 'red'];

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isClassificationResult(value: unknown): value is ClassificationResult {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<ClassificationResult>;
  const validSignals =
    Array.isArray(candidate.signals) &&
    candidate.signals.every(
      (signal) =>
        Boolean(signal) &&
        typeof signal.label === 'string' &&
        typeof signal.probability === 'number' &&
        signal.probability >= 0 &&
        signal.probability <= 1
    );

  return (
    RISK_LEVELS.includes(candidate.riskLevel as RiskLevel) &&
    validSignals &&
    isStringArray(candidate.reasons) &&
    isStringArray(candidate.recommendedActions) &&
    typeof candidate.uncertain === 'boolean'
  );
}

function isApiChatResult(value: unknown): value is ApiChatResult {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<ApiChatResult>;
  return (
    typeof candidate.reply === 'string' &&
    candidate.reply.trim().length > 0 &&
    isClassificationResult(candidate.assessment) &&
    (candidate.replySource === 'llm' || candidate.replySource === 'template')
  );
}

async function useMock(text: string): Promise<SourcedClassificationResult> {
  const result = await mockClassify(text);
  return { ...result, source: 'mock' };
}

function chooseMockReply(result: ClassificationResult): string {
  if (result.riskLevel === 'red') {
    return 'It sounds like you may need immediate support. Would you like to contact someone you trust or open the SOS options now?';
  }
  if (result.riskLevel === 'amber') {
    return 'That sounds difficult, and you do not have to handle it alone. Would you like to explore a coping strategy or contact someone you trust?';
  }
  if (result.uncertain) {
    return 'I am not completely sure what you need yet. Would you like to tell me a little more or complete a quick check-in?';
  }
  return 'Thank you for sharing that. I am here with you. Would you like to tell me a little more?';
}

async function useMockChat(messages: ChatMessage[]): Promise<ChatResult> {
  const latest = messages[messages.length - 1]?.content ?? '';
  const assessment = await useMock(latest);
  return {
    reply: chooseMockReply(assessment),
    assessment,
    replySource: 'mock',
  };
}

export async function classifyMessage(
  text: string,
  apiReady = true
): Promise<SourcedClassificationResult> {
  const cleaned = text.trim();
  if (!cleaned) {
    return {
      riskLevel: 'green',
      signals: [],
      reasons: ['Please enter a message before requesting an assessment.'],
      recommendedActions: [],
      uncertain: true,
      source: 'mock',
    };
  }

  if (!apiReady) return useMock(cleaned);

  try {
    const response = await apiClient.post<unknown>('/classify', {
      text: cleaned,
    });
    if (!isClassificationResult(response.data)) {
      return useMock(cleaned);
    }
    return { ...response.data, source: 'api' };
  } catch {
    // Never log private text or errors that may contain request data.
    return useMock(cleaned);
  }
}

export async function healthCheck(): Promise<boolean> {
  try {
    const response = await apiClient.get<HealthResponse>('/health');
    return (
      response.status === 200 &&
      response.data.status === 'ready' &&
      response.data.modelLoaded === true
    );
  } catch {
    return false;
  }
}

export async function sendChatMessage(
  messages: ChatMessage[],
  apiReady = true
): Promise<ChatResult> {
  const limitedMessages = messages
    .slice(-4)
    .map((message) => ({ ...message, content: message.content.trim() }))
    .filter((message) => message.content.length > 0);

  if (
    limitedMessages.length === 0 ||
    limitedMessages[limitedMessages.length - 1].role !== 'user'
  ) {
    return useMockChat([
      { role: 'user', content: 'I am not sure what to say yet.' },
    ]);
  }

  if (!apiReady) return useMockChat(limitedMessages);

  try {
    const response = await apiClient.post<unknown>(
      '/chat',
      { messages: limitedMessages },
      { timeout: 25000 }
    );
    if (!isApiChatResult(response.data)) {
      return useMockChat(limitedMessages);
    }
    return {
      reply: response.data.reply,
      assessment: { ...response.data.assessment, source: 'api' },
      replySource: response.data.replySource,
    };
  } catch {
    return useMockChat(limitedMessages);
  }
}

export function setApiUrl(url: string): void {
  apiClient.defaults.baseURL = url;
}

export function getApiUrl(): string {
  return apiClient.defaults.baseURL || API_URL;
}
