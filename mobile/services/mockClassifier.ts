export type RiskLevel = 'green' | 'amber' | 'red';

export type Signal = {
  label: string;
  probability: number;
};

export type ClassificationResult = {
  riskLevel: RiskLevel;
  signals: Signal[];
  reasons: string[];
  recommendedActions: string[];
  uncertain?: boolean;
};

export async function classifyMessage(text: string): Promise<ClassificationResult> {
  const message = text.toLowerCase();

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Immediate help request - RED
  if (
    message.includes('unsafe') ||
    message.includes('help now') ||
    message.includes('emergency') ||
    message.includes('suicide') ||
    message.includes('self harm')
  ) {
    return {
      riskLevel: 'red',
      signals: [
        {
          label: 'immediate_help_request',
          probability: 0.96,
        },
      ],
      reasons: ['Immediate help language detected'],
      recommendedActions: [
        'Contact a trusted person',
        'Open the SOS screen',
        'Call emergency services if needed',
      ],
    };
  }

  // Peer pressure, substance exposure, or cravings - AMBER
  if (
    message.includes('pressure') ||
    message.includes('craving') ||
    message.includes('use again') ||
    message.includes('tempted') ||
    message.includes('offered') ||
    message.includes('substance') ||
    message.includes('friends want')
  ) {
    return {
      riskLevel: 'amber',
      signals: [
        {
          label: 'peer_pressure',
          probability: 0.86,
        },
        {
          label: 'substance_exposure',
          probability: 0.72,
        },
      ],
      reasons: [
        'A possible support concern was identified',
        'Peer or substance-related language detected',
      ],
      recommendedActions: [
        'Complete a private check-in',
        'Review coping strategies',
        'Contact someone you trust',
      ],
    };
  }

  // General distress - GREEN or AMBER depending on intensity
  if (
    message.includes('stressed') ||
    message.includes('anxious') ||
    message.includes('overwhelmed') ||
    message.includes('sad') ||
    message.includes('lonely') ||
    message.includes('nervous')
  ) {
    return {
      riskLevel: 'green',
      signals: [
        {
          label: 'general_distress',
          probability: 0.65,
        },
      ],
      reasons: ['General emotional distress detected'],
      recommendedActions: [
        'Continue using prevention resources',
        'Try a grounding exercise',
        'Optional wellbeing check-in',
      ],
    };
  }

  // Neutral or educational - GREEN
  return {
    riskLevel: 'green',
    signals: [],
    reasons: ['No immediate support signals identified'],
    recommendedActions: ['Continue using prevention resources'],
  };
}
