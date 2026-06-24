import { useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated, Pressable, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Mascot from '../../components/Mascot';
import BentoCard from '../../components/BentoCard';
import { IconChip } from '../../components/Icon';
import { COLORS, TYPE, SPACING, RADIUS, SHADOW } from '../../constants/theme';
import { useGuardian } from '../../context/GuardianContext';

function PulseDot({ reducedMotion }: { reducedMotion: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (reducedMotion) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, { toValue: 2.6, duration: 1400, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 1400, useNativeDriver: true }),
        ]),
        Animated.timing(scale, { toValue: 1, duration: 0, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.6, duration: 0, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scale, opacity, reducedMotion]);

  return (
    <View style={styles.dotWrap}>
      <Animated.View style={[styles.dotPing, { transform: [{ scale }], opacity }]} />
      <View style={styles.dotCore} />
    </View>
  );
}

type QuickAction = {
  label: string;
  sub: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
  tint: string;
  route: string;
  highlight?: boolean;
};

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const narrow = width < 360;
  const { preferences, trustedContacts, monitoringActive } = useGuardian();

  const actions: QuickAction[] = [
    { label: 'Talk Privately', sub: 'Chat with Guardian', icon: 'forum', color: COLORS.secondary, tint: COLORS.secondaryTint, route: '/(tabs)/chat' },
    { label: 'SOS', sub: 'Emergency help', icon: 'emergency', color: COLORS.onPrimary, tint: 'rgba(255,255,255,0.2)', route: '/sos', highlight: true },
    { label: 'Start Monitoring', sub: 'Track wellbeing', icon: 'monitor-heart', color: COLORS.tertiary, tint: COLORS.tertiaryTint, route: '/(tabs)/monitor' },
    { label: 'Check In', sub: 'How are you?', icon: 'favorite', color: COLORS.warning, tint: COLORS.warningTint, route: '/check-in' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Mascot size={40} />
          <Text style={styles.brandName}>Guardian Angel</Text>
        </View>
        <Pressable style={styles.iconBtn} onPress={() => router.push('/(tabs)/profile')}>
          <MaterialIcons name="settings" size={24} color={COLORS.onSurfaceVariant} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Greeting card */}
        <BentoCard radius={RADIUS.xxl} style={styles.greetCard}>
          <View style={styles.greetRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.greetHi}>Hi, {preferences.nickname}! 👋</Text>
              <Text style={styles.greetSub}>How are you today?</Text>
              <View style={styles.statusPill}>
                <PulseDot reducedMotion={preferences.reducedMotion} />
                <Text style={styles.statusText}>
                  Guardian Mode: {monitoringActive ? 'Monitoring' : 'Ready'}
                </Text>
              </View>
            </View>
            <View style={styles.shield}>
              <MaterialIcons name="shield" size={30} color={COLORS.primaryContainer} />
            </View>
          </View>
        </BentoCard>

        {/* Quick actions */}
        <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
        <View style={styles.grid}>
          {actions.map((a) => (
            <BentoCard
              key={a.label}
              radius={RADIUS.xxl}
              onPress={() => router.push(a.route as any)}
              style={[styles.gridItem, narrow && styles.fullWidth, a.highlight && styles.gridItemHighlight] as any}
              padded={false}
            >
              <View style={styles.gridItemInner}>
                <View style={[styles.actionChip, { backgroundColor: a.tint }]}>
                  <MaterialIcons name={a.icon} size={24} color={a.color} />
                </View>
                <Text style={[styles.actionLabel, a.highlight && { color: COLORS.onPrimary }]}>{a.label}</Text>
                <Text style={[styles.actionSub, a.highlight && { color: 'rgba(255,255,255,0.85)' }]}>{a.sub}</Text>
              </View>
            </BentoCard>
          ))}
        </View>

        {preferences.supportivePrompts && (
          <BentoCard radius={RADIUS.xxl} onPress={() => router.push('/(tabs)/chat')} style={styles.companion}>
            <Mascot size={84} />
            <View style={styles.companionBody}>
              <View style={styles.speech}>
                <Text style={styles.speechText}>I'm here with you. Tap to talk whenever you need.</Text>
              </View>
              <View style={styles.companionCta}>
                <Text style={styles.companionCtaText}>Talk to Guardian</Text>
                <MaterialIcons name="arrow-forward-ios" size={13} color={COLORS.primary} />
              </View>
            </View>
          </BentoCard>
        )}

        {/* Stats */}
        <View style={[styles.statsRow, narrow && styles.stacked]}>
          <BentoCard style={[styles.statCard, narrow && styles.fullWidth]}>
            <IconChip name="group" color={COLORS.secondary} tint={COLORS.secondaryTint} containerSize={40} size={20} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.statLabel}>Trusted</Text>
              <Text style={styles.statValue}>{trustedContacts.length} Saved</Text>
            </View>
          </BentoCard>
          <BentoCard style={[styles.statCard, narrow && styles.fullWidth]}>
            <IconChip name="battery-full" color={COLORS.tertiary} tint={COLORS.tertiaryTint} containerSize={40} size={20} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.statLabel}>Device</Text>
              <Text style={styles.statValue}>Demo data</Text>
            </View>
          </BentoCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    height: 60,
    paddingHorizontal: SPACING.page,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandName: { ...TYPE.headlineMd, color: COLORS.primary },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  scroll: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: SPACING.page, paddingTop: 8, paddingBottom: 28, gap: 20 },

  greetCard: { padding: 22 },
  greetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greetHi: { ...TYPE.headlineXl, color: COLORS.onSurface },
  greetSub: { ...TYPE.bodyMd, color: COLORS.onSurfaceVariant, marginTop: 2 },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.tertiaryTint,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    marginTop: 16,
  },
  statusText: { ...TYPE.labelMd, color: COLORS.tertiary, marginLeft: 12 },
  dotWrap: { width: 8, height: 8, alignItems: 'center', justifyContent: 'center' },
  dotPing: { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.tertiary },
  dotCore: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.tertiary },
  shield: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionLabel: { ...TYPE.labelSm, color: COLORS.onSurfaceVariant, marginBottom: -8, marginLeft: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 16 },
  gridItem: { width: '48%' },
  fullWidth: { width: '100%' },
  gridItemHighlight: { backgroundColor: COLORS.primaryContainer, borderColor: COLORS.primaryContainer },
  gridItemInner: { padding: 18, alignItems: 'flex-start' },
  actionChip: { width: 48, height: 48, borderRadius: RADIUS.lg, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  actionLabel: { ...TYPE.titleSm, color: COLORS.onSurface },
  actionSub: { ...TYPE.labelSm, color: COLORS.onSurfaceVariant, marginTop: 2 },

  companion: { flexDirection: 'row', alignItems: 'center', padding: 18, gap: 16 },
  companionBody: { flex: 1, gap: 10 },
  speech: { backgroundColor: COLORS.surfaceLow, padding: 14, borderRadius: RADIUS.lg, borderBottomLeftRadius: RADIUS.sm },
  speechText: { ...TYPE.bodyMd, color: COLORS.onSurfaceVariant },
  companionCta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  companionCtaText: { ...TYPE.labelMd, color: COLORS.primary },

  statsRow: { flexDirection: 'row', gap: 16 },
  stacked: { flexDirection: 'column' },
  statCard: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  statLabel: { ...TYPE.labelSm, color: COLORS.onSurfaceVariant },
  statValue: { ...TYPE.titleSm, color: COLORS.onSurface },
});
