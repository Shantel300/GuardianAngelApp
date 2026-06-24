import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import BentoCard from '../components/BentoCard';
import { IconChip } from '../components/Icon';
import { COLORS, TYPE, SPACING, RADIUS } from '../constants/theme';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

export default function CheckInScreen() {
  const router = useRouter();

  const options: { id: string; label: string; desc: string; icon: IconName; color: string; tint: string; action: () => void }[] = [
    { id: 'fine', label: "I'm fine", desc: 'Close the check-in and carry on', icon: 'check-circle', color: COLORS.tertiary, tint: COLORS.tertiaryTint, action: () => router.back() },
    { id: 'exercising', label: "I'm exercising", desc: 'Signals explained by activity', icon: 'directions-run', color: COLORS.secondary, tint: COLORS.secondaryTint, action: () => router.back() },
    { id: 'stressed', label: 'I feel stressed', desc: 'Try a grounding exercise', icon: 'self-improvement', color: COLORS.warning, tint: COLORS.warningTint, action: () => router.replace('/(tabs)/support') },
    { id: 'cravings', label: "I'm having cravings", desc: 'Open recovery support', icon: 'healing', color: COLORS.primaryContainer, tint: COLORS.primaryTint, action: () => router.replace('/(tabs)/support') },
    { id: 'help', label: 'I need help', desc: 'Reach a trusted person or SOS', icon: 'sos', color: COLORS.primary, tint: COLORS.primaryTint, action: () => router.replace('/(tabs)/chat') },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>Wellbeing Check-In</Text>
        <Text style={styles.sub}>Your body signals have changed. Are you okay?</Text>

        <View style={styles.alert}>
          <MaterialIcons name="favorite" size={18} color={COLORS.warning} />
          <Text style={styles.alertText}>We noticed an unusual pattern in your wellbeing signals.</Text>
        </View>

        <View style={{ gap: 12, marginTop: 6 }}>
          {options.map((o) => (
            <BentoCard key={o.id} style={styles.row} onPress={o.action}>
              <IconChip name={o.icon} color={o.color} tint={o.tint} />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.rowTitle}>{o.label}</Text>
                <Text style={styles.rowDesc}>{o.desc}</Text>
              </View>
              <MaterialIcons name="arrow-forward-ios" size={15} color={COLORS.outline} />
            </BentoCard>
          ))}
        </View>

        <View style={styles.note}>
          <MaterialIcons name="info" size={15} color={COLORS.secondary} />
          <Text style={styles.noteText}>Your responses personalise your experience but are not stored.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: SPACING.page, paddingTop: 20, paddingBottom: 28, gap: 6 },
  h1: { ...TYPE.headlineXl, color: COLORS.onSurface },
  sub: { ...TYPE.bodyLg, color: COLORS.onSurfaceVariant, marginTop: 4 },
  alert: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.warningTint, padding: 14, borderRadius: RADIUS.md, borderLeftWidth: 4, borderLeftColor: COLORS.warning, marginTop: 14 },
  alertText: { ...TYPE.labelMd, color: '#8a4b00', flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowTitle: { ...TYPE.titleSm, color: COLORS.onSurface },
  rowDesc: { ...TYPE.labelSm, color: COLORS.onSurfaceVariant, marginTop: 2 },
  note: { flexDirection: 'row', gap: 8, backgroundColor: COLORS.secondaryTint, padding: 12, borderRadius: RADIUS.md, marginTop: 12 },
  noteText: { ...TYPE.labelSm, color: COLORS.onSecondaryContainer, flex: 1 },
});
