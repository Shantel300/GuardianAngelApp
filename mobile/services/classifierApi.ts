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

async function useMock(text: string): Promise<SourcedClassificationResult> {
  const result = await mockClassify(text);
  return { ...result, source: 'mock' };
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

export function setApiUrl(url: string): void {
  apiClient.defaults.baseURL = url;
}

export function getApiUrl(): string {
  return apiClient.defaults.baseURL || API_URL;
}
