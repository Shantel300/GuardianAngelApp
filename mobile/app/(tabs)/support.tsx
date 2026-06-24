import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import BentoCard from '../../components/BentoCard';
import { IconChip } from '../../components/Icon';
import PrimaryButton from '../../components/PrimaryButton';
import Mascot from '../../components/Mascot';
import { COLORS, TYPE, SPACING, RADIUS } from '../../constants/theme';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

type Tool = { title: string; desc: string; icon: IconName; color: string; tint: string };

const COPING: Tool[] = [
  { title: 'Guided Breathing', desc: 'Calm down with paced breathing', icon: 'air', color: COLORS.secondary, tint: COLORS.secondaryTint },
  { title: 'Five Senses Grounding', desc: 'Anchor yourself in the present', icon: 'spa', color: COLORS.tertiary, tint: COLORS.tertiaryTint },
  { title: 'Refusal Phrases', desc: 'Practice saying no with confidence', icon: 'front-hand', color: COLORS.warning, tint: COLORS.warningTint },
  { title: 'Craving Delay Timer', desc: 'Ride out the urge with a countdown', icon: 'timer', color: COLORS.primaryContainer, tint: COLORS.primaryTint },
];

const HELP: Tool[] = [
  { title: 'Contact a Trusted Person', desc: 'Reach someone you trust', icon: 'group', color: COLORS.secondary, tint: COLORS.secondaryTint },
  { title: 'Request Counsellor Support', desc: 'Confidential professional help', icon: 'health-and-safety', color: COLORS.tertiary, tint: COLORS.tertiaryTint },
];

function ToolRow({ t }: { t: Tool }) {
  return (
    <BentoCard style={styles.row}>
      <IconChip name={t.icon} color={t.color} tint={t.tint} />
      <View style={{ flex: 1, marginLeft: 14 }}>
        <Text style={styles.rowTitle}>{t.title}</Text>
        <Text style={styles.rowDesc}>{t.desc}</Text>
      </View>
      <MaterialIcons name="arrow-forward-ios" size={15} color={COLORS.outline} />
    </BentoCard>
  );
}

export default function SupportScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>Support</Text>

        {/* Companion intro */}
        <BentoCard radius={RADIUS.xxl} style={styles.intro}>
          <Mascot size={64} />
          <View style={styles.introBubble}>
            <Text style={styles.introText}>"I'm here to help you stay safe and feel supported."</Text>
            <Text style={styles.introCaption}>Your Safety Companion</Text>
          </View>
        </BentoCard>

        <Text style={styles.sectionLabel}>COPING TOOLS</Text>
        <View style={{ gap: 12 }}>
          {COPING.map((t) => <ToolRow key={t.title} t={t} />)}
        </View>

        <Text style={styles.sectionLabel}>GET HELP</Text>
        <View style={{ gap: 12 }}>
          {HELP.map((t) => <ToolRow key={t.title} t={t} />)}
        </View>

        <PrimaryButton label="Get Immediate Support" icon="emergency" onPress={() => {}} style={{ marginTop: 8 }} />
        <Text style={styles.footnote}>Available 24/7 for discreet, professional help.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: SPACING.page, paddingTop: 12, paddingBottom: 28, gap: 14 },
  h1: { ...TYPE.headlineXl, color: COLORS.onSurface },

  intro: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  introBubble: { flex: 1 },
  introText: { ...TYPE.bodyMd, color: COLORS.onSurface, fontStyle: 'italic' },
  introCaption: { ...TYPE.labelSm, color: COLORS.onSurfaceVariant, marginTop: 6 },

  sectionLabel: { ...TYPE.labelSm, color: COLORS.onSurfaceVariant, marginTop: 6, marginBottom: -2, marginLeft: 4 },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowTitle: { ...TYPE.titleSm, color: COLORS.onSurface },
  rowDesc: { ...TYPE.labelSm, color: COLORS.onSurfaceVariant, marginTop: 2 },

  footnote: { ...TYPE.labelSm, color: COLORS.onSurfaceVariant, textAlign: 'center', marginTop: 4 },
});
