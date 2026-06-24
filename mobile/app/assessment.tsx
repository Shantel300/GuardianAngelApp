import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import BentoCard from '../components/BentoCard';
import RiskBadge from '../components/RiskBadge';
import PrimaryButton from '../components/PrimaryButton';
import { SourcedClassificationResult } from '../services/classifierApi';
import { COLORS, TYPE, SPACING, RADIUS } from '../constants/theme';

export default function AssessmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  let result: SourcedClassificationResult | null = null;
  try {
    if (params.result) {
      result = JSON.parse(params.result as string);
    }
  } catch {
    result = null;
  }

  if (!result) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <Text style={TYPE.bodyMd}>Could not load the assessment.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>ASSESSMENT RESULT</Text>
        <RiskBadge level={result.riskLevel} size="large" />

        {result.source === 'mock' && (
          <View style={styles.fallback}>
            <MaterialIcons name="info-outline" size={16} color={COLORS.warning} />
            <Text style={styles.fallbackText}>
              Demo fallback classifier used because the trained AI service was unavailable.
            </Text>
          </View>
        )}

        {result.signals.length > 0 && (
          <BentoCard>
            <Text style={styles.cardTitle}>Detected signals</Text>
            <View style={{ gap: 14, marginTop: 12 }}>
              {result.signals.map((s, i) => (
                <View key={i}>
                  <View style={styles.signalRow}>
                    <Text style={styles.signalName}>{s.label.replace(/_/g, ' ')}</Text>
                    <Text style={styles.signalPct}>{Math.round(s.probability * 100)}%</Text>
                  </View>
                  <View style={styles.track}>
                    <View style={[styles.fill, { width: `${Math.round(s.probability * 100)}%` }]} />
                  </View>
                </View>
              ))}
            </View>
          </BentoCard>
        )}

        <BentoCard>
          <Text style={styles.cardTitle}>Why this result?</Text>
          <View style={{ gap: 8, marginTop: 10 }}>
            {result.reasons.map((r, i) => (
              <View key={i} style={styles.bulletRow}>
                <MaterialIcons name="circle" size={6} color={COLORS.onSurfaceVariant} style={{ marginTop: 7 }} />
                <Text style={styles.bullet}>{r}</Text>
              </View>
            ))}
          </View>
        </BentoCard>

        {result.uncertain && (
          <View style={styles.uncertain}>
            <MaterialIcons name="help-outline" size={16} color={COLORS.warning} />
            <Text style={styles.uncertainText}>The system is uncertain — please share how you're feeling.</Text>
          </View>
        )}

        <BentoCard>
          <Text style={styles.cardTitle}>Suggested next steps</Text>
          <View style={{ gap: 10, marginTop: 10 }}>
            {result.recommendedActions.map((a, i) => (
              <View key={i} style={styles.action}>
                <Text style={styles.actionText}>{a}</Text>
              </View>
            ))}
          </View>
        </BentoCard>

        <View style={styles.disclaimer}>
          <MaterialIcons name="info" size={15} color={COLORS.secondary} />
          <Text style={styles.disclaimerText}>
            This is based on demonstration data and is not a diagnosis. In a crisis, reach a trusted adult or emergency services.
          </Text>
        </View>

        <PrimaryButton label="Get Support Resources" icon="volunteer-activism" onPress={() => router.push('/(tabs)/support')} />
        <PrimaryButton label="Back to Chat" variant="secondary" onPress={() => router.back()} style={{ marginTop: 4 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  center: { alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: SPACING.page, paddingTop: 16, paddingBottom: 28, gap: 14 },
  label: { ...TYPE.labelSm, color: COLORS.onSurfaceVariant },

  fallback: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.warningTint,
    padding: 12,
    borderRadius: RADIUS.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  fallbackText: { ...TYPE.labelMd, color: '#8a4b00', flex: 1 },

  cardTitle: { ...TYPE.titleSm, color: COLORS.onSurface },
  signalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  signalName: { ...TYPE.labelMd, color: COLORS.onSurface, textTransform: 'capitalize' },
  signalPct: { ...TYPE.labelMd, color: COLORS.secondary },
  track: { height: 6, borderRadius: 3, backgroundColor: COLORS.surfaceHigh, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: COLORS.secondary, borderRadius: 3 },

  bulletRow: { flexDirection: 'row', gap: 8 },
  bullet: { ...TYPE.bodyMd, color: COLORS.onSurfaceVariant, flex: 1 },

  uncertain: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.warningTint, padding: 12, borderRadius: RADIUS.md, borderLeftWidth: 4, borderLeftColor: COLORS.warning },
  uncertainText: { ...TYPE.labelMd, color: '#8a4b00', flex: 1 },

  action: { backgroundColor: COLORS.surfaceLow, paddingVertical: 12, paddingHorizontal: 14, borderRadius: RADIUS.md, borderLeftWidth: 3, borderLeftColor: COLORS.secondary },
  actionText: { ...TYPE.labelMd, color: COLORS.onSurface },

  disclaimer: { flexDirection: 'row', gap: 8, backgroundColor: COLORS.secondaryTint, padding: 12, borderRadius: RADIUS.md },
  disclaimerText: { ...TYPE.labelSm, color: COLORS.onSecondaryContainer, flex: 1, lineHeight: 16 },
});
