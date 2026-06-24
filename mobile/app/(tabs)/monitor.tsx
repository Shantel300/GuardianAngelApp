import { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Alert, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import BentoCard from '../../components/BentoCard';
import PrimaryButton from '../../components/PrimaryButton';
import { IconChip } from '../../components/Icon';
import {
  WEARABLE_SCENARIOS,
  normalScenario,
} from '../../data/wearableScenarios';
import {
  AnomalyState,
  analyseReading,
  calculateBaseline,
  initialAnomalyState,
} from '../../services/wearableAnomaly';
import {
  ensureNotificationPermission,
  sendWellbeingNotification,
} from '../../services/notificationService';
import { COLORS, TYPE, SPACING, RADIUS } from '../../constants/theme';
import { useGuardian } from '../../context/GuardianContext';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

export default function MonitorScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const narrow = width < 360;
  const {
    consent,
    preferences,
    updateConsent,
    setMonitoringActive,
    setNotificationStatus,
  } = useGuardian();
  const [scenario, setScenario] = useState(WEARABLE_SCENARIOS[0]);
  const [reading, setReading] = useState(scenario.readings[0]);
  const [animating, setAnimating] = useState(false);
  const [analysisText, setAnalysisText] = useState('Readings match your personal baseline.');
  const [notificationsAllowed, setNotificationsAllowed] =
    useState<boolean | null>(null);
  const readingIndex = useRef(0);
  const anomalyState = useRef<AnomalyState>(initialAnomalyState());
  const baseline = useMemo(
    () => calculateBaseline(normalScenario.readings),
    []
  );

  useEffect(() => {
    if (!animating) return;
    const id = setInterval(() => {
      readingIndex.current =
        (readingIndex.current + 1) % scenario.readings.length;
      setReading(scenario.readings[readingIndex.current]);
    }, 2000);
    return () => clearInterval(id);
  }, [animating, scenario]);

  useEffect(() => {
    if (!animating) return;
    const result = analyseReading(
      reading,
      baseline,
      anomalyState.current
    );
    anomalyState.current = result.state;
    setAnalysisText(
      result.unusual
        ? `Unusual pattern observed (${result.state.consecutiveUnusual}/3).`
        : result.reasons[0] ?? 'Readings match your personal baseline.'
    );
    if (result.shouldAlert) void triggerCheckIn();
  }, [reading, animating, baseline]);

  const selectScenario = async (id: string) => {
    if (!consent.monitoring) {
      Alert.alert(
        'Monitoring consent needed',
        'Enable simulated monitoring to analyse these fictional readings.',
        [
          { text: 'Not now', style: 'cancel' },
          {
            text: 'Enable',
            onPress: () => {
              updateConsent({ monitoring: true });
              Alert.alert('Monitoring enabled', 'Select the scenario again to begin.');
            },
          },
        ]
      );
      return;
    }
    const s = WEARABLE_SCENARIOS.find((x) => x.id === id);
    if (!s) return;
    setScenario(s);
    readingIndex.current = 0;
    setReading(s.readings[0]);
    anomalyState.current = {
      ...anomalyState.current,
      consecutiveUnusual: 0,
      alertIssued: false,
    };
    setAnalysisText('Building a short pattern before deciding whether to check in.');
    const allowed = preferences.wellbeingNotifications
      ? await ensureNotificationPermission()
      : false;
    setNotificationsAllowed(allowed);
    setNotificationStatus(allowed ? 'granted' : 'denied');
    setMonitoringActive(true);
    setAnimating(true);
  };

  const triggerCheckIn = async () => {
    if (
      preferences.wellbeingNotifications &&
      consent.alerts &&
      notificationsAllowed !== false
    ) {
      try {
        await sendWellbeingNotification();
        return;
      } catch {
        // Fall through to the in-app check-in when notifications are unavailable.
      }
    }
    Alert.alert('Wellbeing check-in', 'Your body signals have changed. Are you okay?', [
      {
        text: "I'm fine",
        onPress: () => {
          setAnimating(false);
          setMonitoringActive(false);
        },
      },
      {
        text: "I'm exercising",
        onPress: () => {
          setAnimating(false);
          setMonitoringActive(false);
        },
      },
      { text: 'I feel stressed', onPress: () => router.push('/support-tool/grounding') },
      { text: 'I need help', onPress: () => router.push('/sos') },
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

        {!consent.monitoring && (
          <View style={styles.consentBanner}>
            <MaterialIcons name="lock" size={17} color={COLORS.primary} />
            <Text style={styles.consentText}>
              Simulated monitoring is off. Select a scenario to review and enable it.
            </Text>
          </View>
        )}

        {/* Simulation banner */}
        <View style={styles.simBanner}>
          <MaterialIcons name="info" size={16} color={COLORS.warning} />
          <Text style={styles.simText}>Simulated data — prototype only</Text>
        </View>

        {/* Metrics grid */}
        <View style={styles.grid}>
          {metrics.map((m) => (
            <BentoCard key={m.label} radius={RADIUS.xl} style={[styles.metricCard, narrow && styles.metricCardNarrow]}>
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

        <PrimaryButton
          label={animating ? 'Stop simulation' : 'Start selected scenario'}
          icon={animating ? 'stop' : 'play-arrow'}
          variant={animating ? 'secondary' : 'primary'}
          onPress={() => {
            if (animating) {
              setAnimating(false);
              setMonitoringActive(false);
            } else {
              void selectScenario(scenario.id);
            }
          }}
        />

        {/* Hint */}
        {animating ? (
          <View style={[styles.hint, { backgroundColor: COLORS.warningTint, borderLeftColor: COLORS.warning }]}>
            <Text style={[styles.hintText, { color: '#8a4b00' }]}>
              {analysisText}
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
  scroll: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: SPACING.page, paddingTop: 12, paddingBottom: 28, gap: 16 },
  h1: { ...TYPE.headlineXl, color: COLORS.onSurface },

  simBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.warningTint, paddingVertical: 10, paddingHorizontal: 14, borderRadius: RADIUS.md },
  simText: { ...TYPE.labelMd, color: '#8a4b00' },
  consentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primaryTint,
    padding: 12,
    borderRadius: RADIUS.md,
  },
  consentText: { ...TYPE.labelMd, color: COLORS.onSurfaceVariant, flex: 1 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 14 },
  metricCard: { width: '48%' },
  metricCardNarrow: { width: '100%' },
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
