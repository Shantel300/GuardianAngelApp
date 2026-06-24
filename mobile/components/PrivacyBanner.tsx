import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';

type Props = {
  message?: string;
};

export default function PrivacyBanner({ message = '🔒 This session will not be saved' }: Props) {
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#e3f2fd',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: THEME.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: THEME.colors.secondary,
  },
  text: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: '#003e73',
  },
});
