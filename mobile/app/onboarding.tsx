import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import BentoCard from '../components/BentoCard';
import { IconChip } from '../components/Icon';
import PrimaryButton from '../components/PrimaryButton';
import Mascot from '../components/Mascot';
import { COLORS, TYPE, SPACING } from '../constants/theme';

export default function OnboardingScreen() {
  const router = useRouter();

  const features = [
    { icon: 'lock' as const, color: COLORS.secondary, tint: COLORS.secondaryTint, title: 'Private by design', desc: 'Conversations are never saved or shared without your consent.' },
    { icon: 'auto-awesome' as const, color: COLORS.tertiary, tint: COLORS.tertiaryTint, title: 'AI-assisted support', desc: 'Smart, gentle signals that point you to the right resources.' },
    { icon: 'favorite' as const, color: COLORS.primaryContainer, tint: COLORS.primaryTint, title: 'Always with you', desc: 'Optional wellbeing monitoring and trusted-contact alerts.' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.heroRow}>
          <Mascot size={72} />
          <View style={{ flex: 1 }}>
            <Text style={styles.h1}>Private youth & recovery support</Text>
          </View>
        </View>

        <View style={{ gap: 14, marginTop: 8 }}>
          {features.map((f) => (
            <BentoCard key={f.title} style={styles.card}>
              <IconChip name={f.icon} color={f.color} tint={f.tint} />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.cardTitle}>{f.title}</Text>
                <Text style={styles.cardDesc}>{f.desc}</Text>
              </View>
            </BentoCard>
          ))}
        </View>

        <View style={styles.actions}>
          <PrimaryButton label="Next" icon="arrow-forward" onPress={() => router.push('/consent')} />
          <Text style={styles.skip} onPress={() => router.push('/consent')}>Skip for now</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, paddingHorizontal: SPACING.page, paddingTop: 16 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  h1: { ...TYPE.headlineLg, color: COLORS.onSurface },
  card: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { ...TYPE.titleSm, color: COLORS.onSurface },
  cardDesc: { ...TYPE.bodyMd, color: COLORS.onSurfaceVariant, marginTop: 4 },
  actions: { marginTop: 'auto', alignItems: 'center', gap: 16, paddingBottom: 12 },
  skip: { ...TYPE.labelMd, color: COLORS.secondary },
});
