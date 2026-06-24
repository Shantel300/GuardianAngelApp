import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: any;
};

export default function PrimaryButton({ label, onPress, disabled = false, style }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: THEME.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    backgroundColor: THEME.colors.surfaceDim,
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: THEME.colors.onPrimary,
  },
});
