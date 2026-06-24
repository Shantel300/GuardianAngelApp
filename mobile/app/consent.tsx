import { useState } from 'react';
import { View, Text, ScrollView, Switch, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import BentoCard from '../components/BentoCard';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS, TYPE, SPACING, RADIUS } from '../constants/theme';

type Toggle = { key: string; title: string; desc: string };

const TOGGLES: Toggle[] = [
  {
    key: 'chatbot',
    title: 'Private Chatbot',
    desc: 'For this prototype, up to four recent messages are temporarily processed by the team’s local AI laptop over trusted Wi-Fi. They are not saved, but the laptop administrator could technically access data during processing.',
  },
  { key: 'monitoring', title: 'Simulated Monitoring', desc: 'Track simulated heart rate, activity and sleep patterns.' },
  { key: 'alerts', title: 'Trusted-Contact Alerts', desc: 'Send limited alerts if unusual patterns are detected.' },
  { key: 'referral', title: 'Referral Sharing', desc: 'Share pseudonymous data with counsellors (you approve each share).' },
];

export default function ConsentScreen() {
  const router = useRouter();
  const [state, setState] = useState<Record<string, boolean>>({
    chatbot: true,
    monitoring: false,
    alerts: false,
    referral: false,
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>Privacy & Consent</Text>
        <Text style={styles.sub}>Guardian Angel respects your privacy. You control what is shared.</Text>

        <View style={{ gap: 14, marginTop: 8 }}>
          {TOGGLES.map((t) => (
            <BentoCard key={t.key} style={styles.card}>
              <View style={styles.cardHead}>
                <Text style={styles.cardTitle}>{t.title}</Text>
                <Switch
                  value={state[t.key]}
                  onValueChange={(v) => setState((s) => ({ ...s, [t.key]: v }))}
                  trackColor={{ false: COLORS.surfaceHigh, true: COLORS.primaryContainer }}
                  thumbColor={COLORS.surfaceLowest}
                />
              </View>
              <Text style={styles.cardDesc}>{t.desc}</Text>
            </BentoCard>
          ))}
        </View>

        <View style={styles.notice}>
          <MaterialIcons name="info" size={16} color={COLORS.primary} />
          <Text style={styles.noticeText}>Essential consent: enable Private Chatbot to continue.</Text>
        </View>

        <PrimaryButton
          label="Get Started"
          icon="arrow-forward"
          disabled={!state.chatbot}
          onPress={() => router.replace('/(tabs)/home')}
          style={{ marginTop: 8 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: SPACING.page, paddingTop: 16, paddingBottom: 24, gap: 6 },
  h1: { ...TYPE.headlineXl, color: COLORS.onSurface },
  sub: { ...TYPE.bodyMd, color: COLORS.onSurfaceVariant, marginTop: 4 },
  card: {},
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardTitle: { ...TYPE.titleSm, color: COLORS.onSurface, flex: 1 },
  cardDesc: { ...TYPE.bodyMd, color: COLORS.onSurfaceVariant },
  notice: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.primaryTint, padding: 14, borderRadius: RADIUS.md, marginTop: 10 },
  noticeText: { ...TYPE.labelMd, color: COLORS.primary, flex: 1 },
});
