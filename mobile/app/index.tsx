import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Mascot from '../components/Mascot';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS, TYPE, SPACING } from '../constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Brand */}
        <View style={styles.brand}>
          <Mascot size={40} rounded={false} />
          <Text style={styles.brandName}>Guardian Angel</Text>
        </View>

        {/* Hero mascot */}
        <View style={styles.hero}>
          <Mascot size={180} />
        </View>

        {/* Headline */}
        <View style={styles.copy}>
          <Text style={styles.h1}>You're never alone.</Text>
          <Text style={styles.h1Accent}>We've got your back!</Text>
          <Text style={styles.sub}>
            Your private companion for early support, wellbeing check-ins, and community care.
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <PrimaryButton label="Get Started" icon="arrow-forward" onPress={() => router.push('/onboarding')} />
          <Text style={styles.secondary} onPress={() => router.push('/consent')}>
            I already have an account
          </Text>
          <View style={styles.dots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, paddingHorizontal: SPACING.page, alignItems: 'center' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  brandName: { ...TYPE.headlineMd, color: COLORS.primary },
  hero: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  copy: { alignItems: 'center', marginBottom: 32 },
  h1: { ...TYPE.headlineXl, color: COLORS.onSurface, textAlign: 'center' },
  h1Accent: { ...TYPE.headlineXl, color: COLORS.primary, textAlign: 'center' },
  sub: { ...TYPE.bodyMd, color: COLORS.onSurfaceVariant, textAlign: 'center', marginTop: 14, paddingHorizontal: 12 },
  actions: { width: '100%', alignItems: 'center' },
  secondary: { ...TYPE.labelMd, color: COLORS.secondary, marginTop: 20 },
  dots: { flexDirection: 'row', gap: 8, marginTop: 24 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.outlineVariant },
  dotActive: { backgroundColor: COLORS.primary, width: 22 },
});
