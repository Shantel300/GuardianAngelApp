import { View, Text, StyleSheet } from 'react-native';
import { RiskLevel } from '../services/mockClassifier';
import { RISK_LEVELS, THEME } from '../constants/theme';

type Props = {
  level: RiskLevel;
  size?: 'small' | 'medium' | 'large';
};

export default function RiskBadge({ level, size = 'medium' }: Props) {
  const riskInfo = RISK_LEVELS[level];
  const sizeStyles = {
    small: { fontSize: 12, padding: 8 },
    medium: { fontSize: 16, padding: 12 },
    large: { fontSize: 20, padding: 16 },
  };

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: riskInfo.backgroundColor },
        sizeStyles[size],
      ]}
    >
      <Text style={{ fontSize: size === 'large' ? 24 : 16, marginRight: 8 }}>
        {riskInfo.icon}
      </Text>
      <Text style={[styles.text, { color: riskInfo.color, fontSize: sizeStyles[size].fontSize }]}>
        {riskInfo.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: THEME.borderRadius.lg,
    paddingHorizontal: 12,
  },
  text: {
    fontWeight: '600' as const,
  },
});
