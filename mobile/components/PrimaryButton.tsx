import { Text, Pressable, StyleSheet, ViewStyle, ActivityIndicator, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, RADIUS, TYPE, SHADOW } from '../constants/theme';

type Variant = 'primary' | 'secondary' | 'ghost';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  icon?: React.ComponentProps<typeof MaterialIcons>['name'];
  style?: ViewStyle;
};

export default function PrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  icon,
  style,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        variant === 'primary' && !isDisabled && SHADOW.card,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? COLORS.onPrimary : COLORS.primaryContainer} />
      ) : (
        <View style={styles.row}>
          {icon && (
            <MaterialIcons
              name={icon}
              size={20}
              color={variant === 'primary' ? COLORS.onPrimary : COLORS.primaryContainer}
              style={{ marginRight: 8 }}
            />
          )}
          <Text
            style={[
              TYPE.labelMd,
              { fontSize: 16 },
              variant === 'primary' ? styles.primaryText : styles.accentText,
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  primary: { backgroundColor: COLORS.primaryContainer },
  secondary: { backgroundColor: COLORS.surfaceLowest, borderWidth: 2, borderColor: COLORS.primaryContainer },
  ghost: { backgroundColor: 'transparent' },
  disabled: { backgroundColor: COLORS.surfaceHigh, borderWidth: 0 },
  pressed: { transform: [{ scale: 0.97 }] },
  primaryText: { color: COLORS.onPrimary },
  accentText: { color: COLORS.primaryContainer },
});
