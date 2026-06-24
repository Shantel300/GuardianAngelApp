import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import BentoCard from '../../components/BentoCard';
import { IconChip } from '../../components/Icon';
import Mascot from '../../components/Mascot';
import { COLORS, TYPE, SPACING, RADIUS } from '../../constants/theme';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

type Item = { title: string; desc?: string; icon: IconName; color: string; tint: string; danger?: boolean; onPress?: () => void };

function Row({ item }: { item: Item }) {
  return (
    <BentoCard style={styles.row} onPress={item.onPress}>
      <IconChip name={item.icon} color={item.color} tint={item.tint} />
      <View style={{ flex: 1, marginLeft: 14 }}>
        <Text style={[styles.rowTitle, item.danger && { color: COLORS.primary }]}>{item.title}</Text>
        {item.desc && <Text style={styles.rowDesc}>{item.desc}</Text>}
      </View>
      <MaterialIcons name="arrow-forward-ios" size={15} color={COLORS.outline} />
    </BentoCard>
  );
}

export default function ProfileScreen() {
  const router = useRouter();

  const settings: Item[] = [
    { title: 'Preferences', icon: 'tune', color: COLORS.secondary, tint: COLORS.secondaryTint },
    { title: 'Privacy & Security', icon: 'lock', color: COLORS.tertiary, tint: COLORS.tertiaryTint },
    { title: 'Notifications', icon: 'notifications', color: COLORS.warning, tint: COLORS.warningTint },
  ];

  const data: Item[] = [
    {
      title: 'Clear Chat History',
      desc: 'Erase all local sessions',
      icon: 'delete-sweep',
      color: COLORS.secondary,
      tint: COLORS.secondaryTint,
      onPress: () =>
        Alert.alert('Clear chat history?', 'This permanently erases local sessions.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear', style: 'destructive' },
        ]),
    },
    { title: 'About Guardian Angel', desc: 'Version 0.1.0 · Prototype', icon: 'info', color: COLORS.onSurfaceVariant, tint: COLORS.surfaceLow },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>Profile</Text>

        {/* User card */}
        <BentoCard radius={RADIUS.xxl} style={styles.userCard}>
          <Mascot size={60} />
          <View style={{ marginLeft: 16 }}>
            <Text style={styles.userName}>Sarah Johnson</Text>
            <Text style={styles.userMeta}>Member since June 2024</Text>
          </View>
        </BentoCard>

        <Text style={styles.sectionLabel}>SETTINGS</Text>
        <View style={{ gap: 12 }}>{settings.map((i) => <Row key={i.title} item={i} />)}</View>

        <Text style={styles.sectionLabel}>DATA MANAGEMENT</Text>
        <View style={{ gap: 12 }}>{data.map((i) => <Row key={i.title} item={i} />)}</View>

        <BentoCard
          style={styles.logout}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </BentoCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: SPACING.page, paddingTop: 12, paddingBottom: 28, gap: 14 },
  h1: { ...TYPE.headlineXl, color: COLORS.onSurface },

  userCard: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  userName: { ...TYPE.headlineMd, color: COLORS.onSurface },
  userMeta: { ...TYPE.labelSm, color: COLORS.onSurfaceVariant, marginTop: 2 },

  sectionLabel: { ...TYPE.labelSm, color: COLORS.onSurfaceVariant, marginTop: 6, marginBottom: -2, marginLeft: 4 },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowTitle: { ...TYPE.titleSm, color: COLORS.onSurface },
  rowDesc: { ...TYPE.labelSm, color: COLORS.onSurfaceVariant, marginTop: 2 },

  logout: { alignItems: 'center', backgroundColor: COLORS.primaryTint, borderColor: 'rgba(181,35,48,0.2)', marginTop: 8 },
  logoutText: { ...TYPE.titleSm, color: COLORS.primary },
});
