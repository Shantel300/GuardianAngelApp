import { View, Text, StyleSheet, Image, ImageSourcePropType, ViewStyle } from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';

/**
 * Guardian Angel penguin mascot.
 *
 * Renders an emoji placeholder by default. To use real art, drop a PNG into
 * assets/ and pass it in, e.g.:
 *   <Mascot source={require('../assets/mascot.png')} />
 * (Do NOT add a static require to a missing file here — Metro resolves every
 * require at bundle time, so a missing asset breaks the dev bundle.)
 */
type Props = {
  size?: number;
  rounded?: boolean;
  source?: ImageSourcePropType;
  style?: ViewStyle;
};

export default function Mascot({ size = 64, rounded = true, source, style }: Props) {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: rounded ? size / 2 : RADIUS.xl,
        },
        style,
      ]}
    >
      {source ? (
        <Image source={source} style={{ width: size, height: size }} resizeMode="contain" />
      ) : (
        <Text style={{ fontSize: size * 0.56 }}>🐧</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
