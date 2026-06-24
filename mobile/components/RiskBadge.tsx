import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { RiskLevel } from '../services/mockClassifier';
import { RISK, RADIUS, TYPE } from '../constants/theme';

type Props = {
  level: RiskLevel;
  size?: 'small' | 'medium' | 'large';
};

export default function RiskBadge({ level, size = 'medium' }: Props) {
  const info = RISK[level];
  const iconSize = size === 'large' ? 26 : size === 'small' ? 16 : 20;
  const fontSize = size === 'large' ? 18 : size === 'small' ? 12 : 15;
  const pad = size === 'large' ? 14 : size === 'small' ? 8 : 11;

  return (
    <View style={[styles.badge, { backgroundColor: info.tint, paddingVertical: pad, paddingHorizontal: pad + 4 }]}>
      <MaterialIcons name={info.icon} size={iconSize} color={info.color} style={{ marginRight: 8 }} />
      <Text style={[TYPE.labelMd, { color: info.color, fontSize }]}>{info.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: RADIUS.full,
  },
});
