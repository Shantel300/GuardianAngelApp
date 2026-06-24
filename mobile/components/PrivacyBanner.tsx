import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, RADIUS, TYPE } from '../constants/theme';

type Props = {
  message?: string;
};

export default function PrivacyBanner({ message = 'This session will not be saved' }: Props) {
  return (
    <View style={styles.banner}>
      <MaterialIcons name="lock" size={16} color={COLORS.secondary} style={{ marginRight: 8 }} />
      <Text style={[TYPE.labelSm, styles.text]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondaryTint,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginHorizontal: 20,
    marginVertical: 12,
    borderRadius: RADIUS.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
  },
  text: { color: COLORS.onSecondaryContainer, flex: 1, letterSpacing: 0.1 },
});
