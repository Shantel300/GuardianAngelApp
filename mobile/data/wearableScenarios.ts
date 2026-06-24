export type WearableReading = {
  timestamp: number;
  heartRate: number;
  hrv: number;
  activity: 'resting' | 'walking' | 'exercise';
  sleepScore: number;
};

export type WearableScenario = {
  id: string;
  name: string;
  readings: WearableReading[];
  shouldAlert: boolean;
  description: string;
};

// Normal readings - no alert
export const normalScenario: WearableScenario = {
  id: 'normal',
  name: 'Normal',
  description: 'Relaxed state with normal vitals',
  shouldAlert: false,
  readings: [
    { timestamp: 0, heartRate: 68, hrv: 48, activity: 'resting', sleepScore: 78 },
    { timestamp: 2000, heartRate: 70, hrv: 46, activity: 'resting', sleepScore: 78 },
    { timestamp: 4000, heartRate: 72, hrv: 45, activity: 'resting', sleepScore: 78 },
    { timestamp: 6000, heartRate: 71, hrv: 47, activity: 'resting', sleepScore: 78 },
  ],
};

// Exercise - elevated heart rate but explained by activity
export const exerciseScenario: WearableScenario = {
  id: 'exercise',
  name: 'Exercising',
  description: 'High heart rate explained by exercise activity',
  shouldAlert: false,
  readings: [
    { timestamp: 0, heartRate: 95, hrv: 32, activity: 'exercise', sleepScore: 82 },
    { timestamp: 2000, heartRate: 110, hrv: 28, activity: 'exercise', sleepScore: 82 },
    { timestamp: 4000, heartRate: 115, hrv: 25, activity: 'exercise', sleepScore: 82 },
    { timestamp: 6000, heartRate: 105, hrv: 30, activity: 'exercise', sleepScore: 82 },
  ],
};

// Elevated stress - should trigger check-in
export const stressScenario: WearableScenario = {
  id: 'stress',
  name: 'Elevated Stress',
  description: 'Stress indicators without exercise explanation',
  shouldAlert: true,
  readings: [
    { timestamp: 0, heartRate: 88, hrv: 30, activity: 'resting', sleepScore: 65 },
    { timestamp: 2000, heartRate: 95, hrv: 26, activity: 'resting', sleepScore: 65 },
    { timestamp: 4000, heartRate: 102, hrv: 22, activity: 'resting', sleepScore: 65 },
    { timestamp: 6000, heartRate: 98, hrv: 24, activity: 'resting', sleepScore: 65 },
  ],
};

// Recovery risk pattern - should trigger check-in and contact simulation
export const recoveryRiskScenario: WearableScenario = {
  id: 'recovery-risk',
  name: 'Recovery Risk Pattern',
  description: 'Pattern consistent with risk behavior',
  shouldAlert: true,
  readings: [
    { timestamp: 0, heartRate: 92, hrv: 28, activity: 'resting', sleepScore: 52 },
    { timestamp: 2000, heartRate: 105, hrv: 20, activity: 'resting', sleepScore: 52 },
    { timestamp: 4000, heartRate: 112, hrv: 18, activity: 'resting', sleepScore: 52 },
    { timestamp: 6000, heartRate: 108, hrv: 21, activity: 'walking', sleepScore: 52 },
  ],
};

export const WEARABLE_SCENARIOS: WearableScenario[] = [
  normalScenario,
  exerciseScenario,
  stressScenario,
  recoveryRiskScenario,
];
