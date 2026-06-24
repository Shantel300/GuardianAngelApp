import { WearableReading } from '../data/wearableScenarios';

export type WearableBaseline = {
  heartRate: number;
  hrv: number;
  sleepScore: number;
};

export type AnomalyState = {
  consecutiveUnusual: number;
  alertIssued: boolean;
  lastAlertAt: number | null;
};

export type AnomalyResult = {
  state: AnomalyState;
  unusual: boolean;
  shouldAlert: boolean;
  reasons: string[];
};

export const ALERT_COOLDOWN_MS = 60_000;

export function calculateBaseline(
  readings: WearableReading[]
): WearableBaseline {
  const resting = readings.filter((reading) => reading.activity === 'resting');
  const source = resting.length > 0 ? resting : readings;
  const average = (values: number[]) =>
    values.reduce((total, value) => total + value, 0) / values.length;

  return {
    heartRate: average(source.map((reading) => reading.heartRate)),
    hrv: average(source.map((reading) => reading.hrv)),
    sleepScore: average(source.map((reading) => reading.sleepScore)),
  };
}

export function initialAnomalyState(): AnomalyState {
  return {
    consecutiveUnusual: 0,
    alertIssued: false,
    lastAlertAt: null,
  };
}

export function analyseReading(
  reading: WearableReading,
  baseline: WearableBaseline,
  state: AnomalyState,
  now = Date.now()
): AnomalyResult {
  if (reading.activity === 'exercise') {
    return {
      state: { ...state, consecutiveUnusual: 0, alertIssued: false },
      unusual: false,
      shouldAlert: false,
      reasons: ['Elevated readings are explained by exercise.'],
    };
  }

  const reasons: string[] = [];
  if (reading.heartRate >= baseline.heartRate + 15) {
    reasons.push('Heart rate is above the personal resting baseline.');
  }
  if (reading.hrv <= baseline.hrv * 0.7) {
    reasons.push('Heart-rate variability is below the personal baseline.');
  }
  if (reading.sleepScore <= baseline.sleepScore - 15) {
    reasons.push('Recent sleep quality is below the personal baseline.');
  }

  const unusual = reasons.length >= 2;
  const consecutiveUnusual = unusual ? state.consecutiveUnusual + 1 : 0;
  const cooldownComplete =
    state.lastAlertAt === null || now - state.lastAlertAt >= ALERT_COOLDOWN_MS;
  const shouldAlert =
    unusual &&
    consecutiveUnusual >= 3 &&
    !state.alertIssued &&
    cooldownComplete;

  return {
    unusual,
    shouldAlert,
    reasons,
    state: {
      consecutiveUnusual,
      alertIssued: shouldAlert ? true : unusual ? state.alertIssued : false,
      lastAlertAt: shouldAlert ? now : state.lastAlertAt,
    },
  };
}
