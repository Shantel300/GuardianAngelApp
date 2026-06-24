import { MaterialIcons } from '@expo/vector-icons';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

type Props = {
  name: IconName;
  size?: number;
  color?: string;
};

export function Icon({ name, size = 24, color = COLORS.onSurface }: Props) {
  return <MaterialIcons name={name} size={size} color={color} />;
}

type ChipProps = {
  name: IconName;
  color?: string;
  tint?: string;
  size?: number;
  containerSize?: number;
  style?: ViewStyle;
};

/** Icon inside a soft rounded tonal chip (used on cards/list rows). */
export function IconChip({
  name,
  color = COLORS.secondary,
  tint = COLORS.secondaryTint,
  size = 22,
  containerSize = 44,
  style,
}: ChipProps) {
  return (
    <View
      style={[
        styles.chip,
        { width: containerSize, height: containerSize, backgroundColor: tint },
        style,
      ]}
    >
      <MaterialIcons name={name} size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
