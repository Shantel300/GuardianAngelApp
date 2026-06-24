export const THEME = {
  colors: {
    // Primary
    primary: '#ff5a5f',
    onPrimary: '#ffffff',
    primaryContainer: '#ff5a5f',
    onPrimaryContainer: '#61000e',

    // Secondary
    secondary: '#0060ac',
    onSecondary: '#ffffff',
    secondaryContainer: '#68abff',
    onSecondaryContainer: '#003e73',

    // Tertiary (Success/Green)
    tertiary: '#006d37',
    onTertiary: '#ffffff',
    tertiaryContainer: '#00aa59',
    onTertiaryContainer: '#003517',

    // Error
    error: '#ba1a1a',
    onError: '#ffffff',
    errorContainer: '#ffdad6',
    onErrorContainer: '#93000a',

    // Surfaces
    surface: '#f7f9fc',
    surfaceDim: '#d8dadd',
    surfaceBright: '#f7f9fc',
    onSurface: '#191c1e',
    onSurfaceVariant: '#5a403f',

    // Neutral
    background: '#f7f9fc',
    onBackground: '#191c1e',
    outline: '#8e706f',
    outlineVariant: '#e2bebc',

    // Inverse
    inverseSurface: '#2d3133',
    inverseOnSurface: '#eff1f4',
    inversePrimary: '#ffb3b0',
  },

  typography: {
    headlineXL: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
      letterSpacing: -0.02,
    },
    headlineLG: {
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: 32,
    },
    headlineLGMobile: {
      fontSize: 20,
      fontWeight: '700' as const,
      lineHeight: 28,
    },
    bodyLG: {
      fontSize: 18,
      fontWeight: '500' as const,
      lineHeight: 26,
    },
    bodyMD: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    labelMD: {
      fontSize: 14,
      fontWeight: '600' as const,
      lineHeight: 20,
      letterSpacing: 0.01,
    },
    labelSM: {
      fontSize: 12,
      fontWeight: '600' as const,
      lineHeight: 16,
      letterSpacing: 0.02,
    },
  },

  spacing: {
    pageMargin: 20,
    gutterGrid: 16,
    stackSM: 8,
    stackMD: 16,
    stackLG: 24,
    containerPadding: 20,
  },

  borderRadius: {
    sm: 4,
    default: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  shadows: {
    card: {
      elevation: 2,
      shadowColor: '#000000',
      shadowOpacity: 0.06,
      shadowRadius: 15,
      shadowOffset: { width: 0, height: 4 },
    },
    sos: {
      elevation: 4,
      shadowColor: '#b52330',
      shadowOpacity: 0.3,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 8 },
    },
  },
};

export const RISK_LEVELS = {
  green: {
    label: 'Safe',
    color: THEME.colors.tertiary,
    backgroundColor: '#e8f5e9',
    icon: '🟢',
  },
  amber: {
    label: 'Support Recommended',
    color: '#ff9800',
    backgroundColor: '#fff3e0',
    icon: '🟡',
  },
  red: {
    label: 'Immediate Support Needed',
    color: THEME.colors.primary,
    backgroundColor: '#fff3f3',
    icon: '🔴',
  },
};
