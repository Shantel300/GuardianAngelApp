import { TextStyle } from 'react-native';

/**
 * Guardian Angel design system — "Serene Guardian / Protective Warmth"
 * Adapted from the Stitch design references for the Person 2 feature set.
 */

export const COLORS = {
  // Brand
  primary: '#b52330', // deep brand red — logo, headlines, key accents
  onPrimary: '#ffffff',
  primaryContainer: '#ff5a5f', // coral — primary CTAs, SOS, active nav
  onPrimaryContainer: '#61000e',
  primaryFixed: '#ffdad8',

  // Secondary (informational / calm)
  secondary: '#0060ac',
  onSecondary: '#ffffff',
  secondaryContainer: '#68abff',
  onSecondaryContainer: '#003e73',

  // Tertiary (safe / active / positive)
  tertiary: '#006d37',
  onTertiary: '#ffffff',
  tertiaryContainer: '#00aa59',
  onTertiaryContainer: '#003517',

  // Status
  warning: '#ff9800',
  onWarning: '#ffffff',
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',

  // Surfaces
  background: '#f7f9fc',
  surface: '#f7f9fc',
  surfaceLowest: '#ffffff',
  surfaceLow: '#f2f4f7',
  surfaceContainer: '#eceef1',
  surfaceHigh: '#e6e8eb',

  // Text / lines
  onSurface: '#191c1e',
  onSurfaceVariant: '#5a403f',
  outline: '#8e706f',
  outlineVariant: '#e2bebc',

  // Soft tonal backgrounds (10% tints used on cards/icon chips)
  primaryTint: '#ffe9ea',
  secondaryTint: '#e3f0ff',
  tertiaryTint: '#e3f6ec',
  warningTint: '#fff3e0',
} as const;

export const FONT = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
} as const;

export const TYPE: Record<string, TextStyle> = {
  headlineXl: { fontFamily: FONT.extrabold, fontSize: 32, lineHeight: 40, letterSpacing: -0.6 },
  headlineLg: { fontFamily: FONT.bold, fontSize: 24, lineHeight: 32, letterSpacing: -0.3 },
  headlineMd: { fontFamily: FONT.bold, fontSize: 20, lineHeight: 28 },
  titleSm: { fontFamily: FONT.bold, fontSize: 16, lineHeight: 22 },
  bodyLg: { fontFamily: FONT.medium, fontSize: 18, lineHeight: 26 },
  bodyMd: { fontFamily: FONT.regular, fontSize: 15, lineHeight: 22 },
  labelMd: { fontFamily: FONT.semibold, fontSize: 14, lineHeight: 20, letterSpacing: 0.1 },
  labelSm: { fontFamily: FONT.semibold, fontSize: 12, lineHeight: 16, letterSpacing: 0.4 },
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
} as const;

export const SPACING = {
  page: 20,
  gutter: 16,
  sm: 8,
  md: 16,
  lg: 24,
} as const;

export const SHADOW = {
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  nav: {
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
} as const;

/** Risk-level display mapping for the classifier (green / amber / red). */
export const RISK = {
  green: {
    label: 'You seem steady',
    color: COLORS.tertiary,
    tint: COLORS.tertiaryTint,
    icon: 'check-circle' as const,
  },
  amber: {
    label: 'Support recommended',
    color: COLORS.warning,
    tint: COLORS.warningTint,
    icon: 'info' as const,
  },
  red: {
    label: 'Let’s get you help',
    color: COLORS.primaryContainer,
    tint: COLORS.primaryTint,
    icon: 'emergency' as const,
  },
} as const;

// ---- Backward-compatible aliases (older imports) ----
export const THEME = { colors: COLORS, typography: TYPE, spacing: SPACING, borderRadius: RADIUS };
export const RISK_LEVELS = {
  green: { label: RISK.green.label, color: RISK.green.color, backgroundColor: RISK.green.tint, icon: '🟢' },
  amber: { label: RISK.amber.label, color: RISK.amber.color, backgroundColor: RISK.amber.tint, icon: '🟡' },
  red: { label: RISK.red.label, color: RISK.red.color, backgroundColor: RISK.red.tint, icon: '🔴' },
};
