import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import BentoCard from '../../components/BentoCard';
import { IconChip } from '../../components/Icon';
import { WEARABLE_SCENARIOS } from '../../data/wearableScenarios';
import { COLORS, TYPE, SPACING, RADIUS } from '../../constants/theme';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

export default function MonitorScreen() {
  const router = useRouter();
  const [scenario, setScenario] = useState(WEARABLE_SCENARIOS[0]);
  const [reading, setReading] = useState(scenario.readings[0]);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!animating) return;
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % scenario.readings.length;
      setReading(scenario.readings[i]);
    }, 2000);
    return () => clearInterval(id);
  }, [animating, scenario]);

  const selectScenario = (id: string) => {
    const s = WEARABLE_SCENARIOS.find((x) => x.id === id);
    if (!s) return;
    setScenario(s);
    setReading(s.readings[0]);
    setAnimating(true);
    if (s.shouldAlert) setTimeout(() => triggerCheckIn(), 3000);
  };

  const triggerCheckIn = () => {
    Alert.alert('Wellbeing check-in', 'Your body signals have changed. Are you okay?', [
      { text: "I'm fine", onPress: () => setAnimating(false) },
      { text: "I'm exercising", onPress: () => setAnimating(false) },
      { text: 'I feel stressed', onPress: () => router.push('/(tabs)/support') },
      { text: 'I need help', onPress: () => router.push('/(tabs)/chat') },
    ]);
  };

  const metrics: { label: string; value: string; unit: string; icon: IconName; color: string; tint: string }[] = [
    { label: 'Heart Rate', value: String(reading.heartRate), unit: 'BPM', icon: 'favorite', color: COLORS.primaryContainer, tint: COLORS.primaryTint },
    { label: 'HRV', value: String(reading.hrv), unit: 'ms', icon: 'show-chart', color: COLORS.secondary, tint: COLORS.secondaryTint },
    { label: 'Activity', value: reading.activity.charAt(0).toUpperCase() + reading.activity.slice(1), unit: '', icon: 'directions-run', color: COLORS.tertiary, tint: COLORS.tertiaryTint },
    { label: 'Sleep', value: String(reading.sleepScore), unit: '/100', icon: 'bedtime', color: COLORS.warning, tint: COLORS.warningTint },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>Wellbeing Monitor</Text>

        {/* Simulation banner */}
        <View style={styles.simBanner}>
          <MaterialIcons name="info" size={16} color={COLORS.warning} />
          <Text style={styles.simText}>Simulated data — prototype only</Text>
        </View>

        {/* Metrics grid */}
        <View style={styles.grid}>
          {metrics.map((m) => (
            <BentoCard key={m.label} radius={RADIUS.xl} style={styles.metricCard}>
              <View style={styles.metricTop}>
                <IconChip name={m.icon} color={m.color} tint={m.tint} containerSize={40} size={20} />
              </View>
              <Text style={styles.metricLabel}>{m.label}</Text>
              <View style={styles.metricValueRow}>
                <Text style={[styles.metricValue, { color: m.color }]}>{m.value}</Text>
                {!!m.unit && <Text style={styles.metricUnit}>{m.unit}</Text>}
              </View>
            </BentoCard>
          ))}
        </View>

        {/* Scenarios */}
        <Text style={styles.sectionLabel}>TEST SCENARIOS</Text>
        <View style={{ gap: 12 }}>
          {WEARABLE_SCENARIOS.map((s) => {
            const active = s.id === scenario.id;
            return (
              <BentoCard
                key={s.id}
                onPress={() => selectScenario(s.id)}
                style={[styles.scenarioCard, active && styles.scenarioActive] as any}
              >
                <View style={styles.scenarioRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.scenarioName, active && { color: COLORS.onPrimary }]}>{s.name}</Text>
                    <Text style={[styles.scenarioDesc, active && { color: 'rgba(255,255,255,0.85)' }]}>{s.description}</Text>
                  </View>
                  {active && (
                    <View style={styles.activeTag}>
                      <Text style={styles.activeTagText}>ACTIVE</Text>
                    </View>
                  )}
                </View>
              </BentoCard>
            );
          })}
        </View>

        {/* Hint */}
        {scenario.shouldAlert ? (
          <View style={[styles.hint, { backgroundColor: COLORS.warningTint, borderLeftColor: COLORS.warning }]}>
            <Text style={[styles.hintText, { color: '#8a4b00' }]}>
              This scenario triggers a wellbeing check-in shortly after selection.
            </Text>
          </View>
        ) : (
          <View style={[styles.hint, { backgroundColor: COLORS.tertiaryTint, borderLeftColor: COLORS.tertiary }]}>
            <Text style={[styles.hintText, { color: COLORS.onTertiaryContainer }]}>
              All readings normal — no alerts triggered.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: SPACING.page, paddingTop: 12, paddingBottom: 28, gap: 16 },
  h1: { ...TYPE.headlineXl, color: COLORS.onSurface },

  simBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.warningTint, paddingVertical: 10, paddingHorizontal: 14, borderRadius: RADIUS.md },
  simText: { ...TYPE.labelMd, color: '#8a4b00' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 14 },
  metricCard: { width: '48%' },
  metricTop: { marginBottom: 12 },
  metricLabel: { ...TYPE.labelSm, color: COLORS.onSurfaceVariant },
  metricValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 2 },
  metricValue: { ...TYPE.headlineLg, fontSize: 26 },
  metricUnit: { ...TYPE.labelSm, color: COLORS.onSurfaceVariant },

  sectionLabel: { ...TYPE.labelSm, color: COLORS.onSurfaceVariant, marginTop: 4, marginBottom: -4, marginLeft: 4 },
  scenarioCard: {},
  scenarioActive: { backgroundColor: COLORS.primaryContainer, borderColor: COLORS.primaryContainer },
  scenarioRow: { flexDirection: 'row', alignItems: 'center' },
  scenarioName: { ...TYPE.titleSm, color: COLORS.onSurface },
  scenarioDesc: { ...TYPE.labelSm, color: COLORS.onSurfaceVariant, marginTop: 3 },
  activeTag: { backgroundColor: COLORS.onPrimary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  activeTagText: { ...TYPE.labelSm, color: COLORS.primaryContainer },

  hint: { padding: 14, borderRadius: RADIUS.md, borderLeftWidth: 4 },
  hintText: { ...TYPE.labelMd },
});
