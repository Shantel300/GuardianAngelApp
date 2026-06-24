import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import PageHeader from '../components/PageHeader';
import BentoCard from '../components/BentoCard';
import PrimaryButton from '../components/PrimaryButton';
import { useGuardian } from '../context/GuardianContext';
import { COLORS, RADIUS, SPACING, TYPE } from '../constants/theme';

const REASONS = [
  'General recovery support',
  'Managing pressure',
  'Coping with cravings',
  'Finding local services',
];

export default function ReferralScreen() {
  const { consent, updateConsent } = useGuardian();
  const [reason, setReason] = useState(REASONS[0]);
  const [submitted, setSubmitted] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <PageHeader title="Counsellor Support" subtitle="Review before sharing" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <BentoCard style={styles.consentCard}>
          <View style={styles.consentRow}>
            <View style={styles.consentText}>
              <Text style={styles.title}>Referral sharing consent</Text>
              <Text style={styles.body}>
                Allow a pseudonymous support request. No chat messages or
                biometric readings are included.
              </Text>
            </View>
            <Switch
              value={consent.referral}
              onValueChange={(referral) => updateConsent({ referral })}
              trackColor={{
                false: COLORS.surfaceHigh,
                true: COLORS.primaryContainer,
              }}
              thumbColor={COLORS.surfaceLowest}
            />
          </View>
        </BentoCard>

        <Text style={styles.section}>WHAT SUPPORT WOULD HELP?</Text>
        {REASONS.map((item) => (
          <Pressable
            key={item}
            style={[styles.option, reason === item && styles.optionSelected]}
            onPress={() => setReason(item)}
          >
            <MaterialIcons
              name={reason === item ? 'radio-button-checked' : 'radio-button-unchecked'}
              size={22}
              color={reason === item ? COLORS.secondary : COLORS.outline}
            />
            <Text style={styles.optionText}>{item}</Text>
          </Pressable>
        ))}

        <View style={styles.summary}>
          <Text style={styles.title}>Prototype request summary</Text>
          <Text style={styles.body}>Topic: {reason}</Text>
          <Text style={styles.body}>Identity: pseudonymous prototype user</Text>
          <Text style={styles.body}>Conversation and watch data: not included</Text>
        </View>

        <PrimaryButton
          label={submitted ? 'Demo request prepared' : 'Prepare demo referral'}
          icon={submitted ? 'check' : 'send'}
          disabled={!consent.referral || submitted}
          onPress={() =>
            Alert.alert(
              'Submit simulated referral?',
              'This demonstrates the review flow. It will not transmit anything to a counsellor.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Submit demo',
                  onPress: () => setSubmitted(true),
                },
              ]
            )
          }
        />
        {!consent.referral && (
          <Text style={styles.disabled}>
            Enable referral sharing above to continue.
          </Text>
        )}
        {submitted && (
          <View style={styles.success}>
            <MaterialIcons name="check-circle" size={20} color={COLORS.tertiary} />
            <Text style={styles.successText}>
              Demonstration complete. No data left this device.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    paddingHorizontal: SPACING.page,
    paddingBottom: 28,
    gap: 12,
  },
  consentCard: { minHeight: 110 },
  consentRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  consentText: { flex: 1 },
  title: { ...TYPE.titleSm, color: COLORS.onSurface },
  body: { ...TYPE.bodyMd, color: COLORS.onSurfaceVariant, marginTop: 5 },
  section: { ...TYPE.labelSm, color: COLORS.onSurfaceVariant, marginTop: 6 },
  option: {
    minHeight: 58,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceLowest,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
  },
  optionSelected: { borderColor: COLORS.secondary, backgroundColor: COLORS.secondaryTint },
  optionText: { ...TYPE.labelMd, color: COLORS.onSurface, flex: 1 },
  summary: { padding: 16, borderRadius: RADIUS.lg, backgroundColor: COLORS.surfaceLow },
  disabled: { ...TYPE.labelSm, color: COLORS.primary, textAlign: 'center' },
  success: {
    flexDirection: 'row',
    gap: 8,
    padding: 13,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.tertiaryTint,
  },
  successText: { ...TYPE.labelMd, color: COLORS.tertiary, flex: 1 },
});
