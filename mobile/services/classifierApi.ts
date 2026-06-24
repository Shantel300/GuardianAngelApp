import axios, { AxiosError } from 'axios';
import { ClassificationResult, classifyMessage as mockClassify } from './mockClassifier';

// Configuration - Person 2 should update this with Person 1's laptop IP
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.10:8000';
const API_TIMEOUT = 5000; // 5 second timeout

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
});

export async function classifyMessage(text: string): Promise<ClassificationResult> {
  if (!text || text.trim().length === 0) {
    return {
      riskLevel: 'green',
      signals: [],
      reasons: ['Empty message'],
      recommendedActions: [],
      uncertain: true,
    };
  }

  try {
    const response = await apiClient.post<ClassificationResult>('/classify', {
      text,
    });

    return response.data;
  } catch (error) {
    console.error('API Error - falling back to mock classifier');

    // Fallback to mock classifier if API unavailable
    const result = await mockClassify(text);
    return {
      ...result,
      // Add indicator that demo classifier is unavailable
      reasons: [...result.reasons, '(Demo classifier unavailable)'],
    };
  }
}

export async function healthCheck(): Promise<boolean> {
  try {
    const response = await apiClient.get('/health');
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

export function setApiUrl(url: string): void {
  apiClient.defaults.baseURL = url;
}

export function getApiUrl(): string {
  return apiClient.defaults.baseURL || API_URL;
}
