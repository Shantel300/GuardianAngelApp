import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import PageHeader from '../components/PageHeader';
import BentoCard from '../components/BentoCard';
import PrimaryButton from '../components/PrimaryButton';
import { useGuardian } from '../context/GuardianContext';
import { COLORS, RADIUS, SPACING, TYPE } from '../constants/theme';
import { MAURITIUS_EMERGENCY_SERVICES } from '../constants/emergency';

export default function SosScreen() {
  const { preferences, trustedContacts } = useGuardian();
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activated, setActivated] = useState(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (progressTimer.current) clearInterval(progressTimer.current);
    holdTimer.current = null;
    progressTimer.current = null;
    setHolding(false);
    if (!activated) setProgress(0);
  };

  useEffect(
    () => () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
      if (progressTimer.current) clearInterval(progressTimer.current);
    },
    []
  );

  const confirmActivation = () => {
    stopHold();
    if (preferences.hapticsEnabled) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    Alert.alert(
      'Activate emergency support?',
      'Guardian Angel will show contact options. It will not call or message anyone automatically.',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => setProgress(0) },
        {
          text: 'Activate',
          style: 'destructive',
          onPress: () => {
            setActivated(true);
            setProgress(100);
          },
        },
      ]
    );
  };

  const startHold = () => {
    if (activated) return;
    setHolding(true);
    setProgress(5);
    progressTimer.current = setInterval(
      () => setProgress((value) => Math.min(95, value + 5)),
      75
    );
    holdTimer.current = setTimeout(confirmActivation, 1500);
  };

  const openDialer = (name: string, number: string) => {
    Alert.alert(`Call ${name}?`, `Your phone dialer will open with ${number}. You must start the call.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Open dialer',
        onPress: async () => {
          const url = `tel:${number}`;
          if (await Linking.canOpenURL(url)) await Linking.openURL(url);
          else Alert.alert('Dialer unavailable', `Please call ${number} manually.`);
        },
      },
    ]);
  };

  const messageDefaultContact = () => {
    const contact =
      trustedContacts.find((item) => item.isDefault) ?? trustedContacts[0];
    if (!contact) {
      Alert.alert(
        'No trusted contact',
        'Add a trusted contact from Support before preparing a message.'
      );
      return;
    }
    Alert.alert(
      `Message ${contact.name}?`,
      'A neutral message will be prepared. Nothing is sent until you press Send in your messaging app.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Prepare message',
          onPress: async () => {
            const body = encodeURIComponent(
              'Could you please check in with me when you can?'
            );
            const separator = Platform.OS === 'ios' ? '&' : '?';
            const url = `sms:${contact.phone}${separator}body=${body}`;
            if (await Linking.canOpenURL(url)) await Linking.openURL(url);
            else Alert.alert('Messaging unavailable', 'Please contact them manually.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <PageHeader title="Emergency Support" subtitle="You stay in control" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.notice}>
          <MaterialIcons name="privacy-tip" size={18} color={COLORS.secondary} />
          <Text style={styles.noticeText}>
            No call or message is made without your confirmation.
          </Text>
        </View>

        <Pressable
          style={[styles.sos, activated && styles.sosActive]}
          onPressIn={startHold}
          onPressOut={stopHold}
          disabled={activated}
          accessibilityRole="button"
          accessibilityLabel="Press and hold to activate emergency support"
        >
          <View style={[styles.progress, { width: `${progress}%` }]} />
          <MaterialIcons name="sos" size={50} color={COLORS.onPrimary} />
          <Text style={styles.sosTitle}>
            {activated ? 'SUPPORT ACTIVE' : holding ? 'KEEP HOLDING…' : 'HOLD FOR SOS'}
          </Text>
          <Text style={styles.sosCaption}>
            {activated ? 'Choose a contact option below' : 'Hold for 1.5 seconds'}
          </Text>
        </Pressable>

        {activated && (
          <>
            <Text style={styles.section}>EMERGENCY SERVICES</Text>
            {MAURITIUS_EMERGENCY_SERVICES.map((service) => (
              <BentoCard
                key={service.number}
                style={styles.service}
                onPress={() => openDialer(service.name, service.number)}
              >
                <MaterialIcons
                  name={service.icon}
                  size={26}
                  color={COLORS.primary}
                />
                <View style={styles.serviceText}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceNumber}>{service.number}</Text>
                </View>
                <MaterialIcons name="phone" size={22} color={COLORS.primary} />
              </BentoCard>
            ))}
            <PrimaryButton
              label="Prepare trusted-contact message"
              icon="sms"
              variant="secondary"
              onPress={messageDefaultContact}
            />
            <PrimaryButton
              label="Cancel emergency mode"
              variant="ghost"
              onPress={() => {
                setActivated(false);
                setProgress(0);
              }}
            />
          </>
        )}

        <Text style={styles.disclaimer}>
          Prototype numbers: Medical 114, Police 999, Fire 115. Reconfirm them
          with event organisers before real-world use.
        </Text>
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
  notice: {
    flexDirection: 'row',
    gap: 9,
    padding: 13,
    backgroundColor: COLORS.secondaryTint,
    borderRadius: RADIUS.md,
  },
  noticeText: { ...TYPE.labelMd, color: COLORS.onSurfaceVariant, flex: 1 },
  sos: {
    height: 245,
    borderRadius: 123,
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginVertical: 12,
  },
  sosActive: { backgroundColor: COLORS.primary },
  progress: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  sosTitle: { ...TYPE.headlineLg, color: COLORS.onPrimary, marginTop: 8 },
  sosCaption: { ...TYPE.labelMd, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  section: { ...TYPE.labelSm, color: COLORS.onSurfaceVariant, marginTop: 8 },
  service: { flexDirection: 'row', alignItems: 'center', minHeight: 72 },
  serviceText: { flex: 1, marginLeft: 14 },
  serviceName: { ...TYPE.titleSm, color: COLORS.onSurface },
  serviceNumber: { ...TYPE.bodyMd, color: COLORS.onSurfaceVariant },
  disclaimer: {
    ...TYPE.labelSm,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 8,
  },
});
