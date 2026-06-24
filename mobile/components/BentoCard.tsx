import { View, Pressable, StyleSheet, ViewStyle, GestureResponderEvent, StyleProp } from 'react-native';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';

type Props = {
  children: React.ReactNode;
  onPress?: (e: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  radius?: number;
};

/** White rounded card with a soft border + ambient shadow. Pressable when onPress is set. */
export default function BentoCard({ children, onPress, style, padded = true, radius = RADIUS.xl }: Props) {
  const base = [
    styles.card,
    { borderRadius: radius },
    padded && styles.padded,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        style={({ pressed }) => [...base, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={base}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surfaceLowest,
    borderWidth: 1,
    borderColor: 'rgba(226,190,188,0.35)',
    ...SHADOW.card,
  },
  padded: {
    padding: 16,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.95,
  },
});
