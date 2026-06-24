import { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { MaterialIcons } from '@expo/vector-icons';
import PageHeader from '../../components/PageHeader';
import BentoCard from '../../components/BentoCard';
import PrimaryButton from '../../components/PrimaryButton';
import {
  GuardianConsent,
  GuardianPreferences,
  useGuardian,
} from '../../context/GuardianContext';
import {
  ensureNotificationPermission,
  getNotificationPermissionStatus,
  sendWellbeingNotification,
} from '../../services/notificationService';
import { COLORS, RADIUS, SPACING, TYPE } from '../../constants/theme';

function ToggleRow({
  title,
  description,
  value,
  onChange,
}: {
  title: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <BentoCard style={styles.toggleCard}>
      <View style={styles.toggleText}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: COLORS.surfaceHigh, true: COLORS.primaryContainer }}
        thumbColor={COLORS.surfaceLowest}
      />
    </BentoCard>
  );
}

function PreferencesSettings() {
  const { preferences, updatePreferences } = useGuardian();
  const [nickname, setNickname] = useState(preferences.nickname);

  const preferenceToggles: {
    key: keyof Pick<
      GuardianPreferences,
      'hapticsEnabled' | 'reducedMotion' | 'supportivePrompts'
    >;
    title: string;
    description: string;
  }[] = [
    {
      key: 'hapticsEnabled',
      title: 'Gentle haptics',
      description: 'Use vibration feedback for important confirmations.',
    },
    {
      key: 'reducedMotion',
      title: 'Reduce motion',
      description: 'Limit pulsing and expanding animations.',
    },
    {
      key: 'supportivePrompts',
      title: 'Supportive prompts',
      description: 'Show optional wellbeing suggestions on the home screen.',
    },
  ];

  const saveNickname = () => {
    const clean = nickname.trim().slice(0, 24);
    if (!clean) {
      Alert.alert('Nickname needed', 'Enter a private nickname.');
      return;
    }
    updatePreferences({ nickname: clean });
    setNickname(clean);
    Alert.alert('Saved', 'Your private nickname was updated.');
  };

  return (
    <>
      <BentoCard>
        <Text style={styles.title}>Private nickname</Text>
        <Text style={styles.body}>
          Stored only on this device. A real name is not required.
        </Text>
        <TextInput
          style={styles.input}
          value={nickname}
          onChangeText={setNickname}
          maxLength={24}
          placeholder="Friend"
          placeholderTextColor={COLORS.outline}
        />
        <PrimaryButton
          label="Save nickname"
          icon="save"
          onPress={saveNickname}
          style={styles.buttonTop}
        />
      </BentoCard>
      {preferenceToggles.map((item) => (
        <ToggleRow
          key={item.key}
          title={item.title}
          description={item.description}
          value={preferences[item.key]}
          onChange={(value) => updatePreferences({ [item.key]: value })}
        />
      ))}
    </>
  );
}

function PrivacySettings() {
  const router = useRouter();
  const {
    consent,
    updateConsent,
    clearChat,
    resetLocalData,
  } = useGuardian();

  const consentRows: {
    key: keyof GuardianConsent;
    title: string;
    description: string;
  }[] = [
    {
      key: 'chatbot',
      title: 'Private Chatbot',
      description: 'Temporarily process up to four recent messages on the local AI laptop.',
    },
    {
      key: 'monitoring',
      title: 'Simulated Monitoring',
      description: 'Analyse fictional wearable readings on this phone.',
    },
    {
      key: 'alerts',
      title: 'Wellbeing Alerts',
      description: 'Allow neutral check-in alerts after sustained unusual patterns.',
    },
    {
      key: 'referral',
      title: 'Referral Sharing',
      description: 'Prepare a pseudonymous support referral after review.',
    },
  ];

  return (
    <>
      <View style={styles.info}>
        <MaterialIcons name="shield" size={21} color={COLORS.tertiary} />
        <Text style={styles.infoText}>
          Settings and encrypted trusted contacts may persist. Chats and
          check-in responses never do.
        </Text>
      </View>
      {consentRows.map((item) => (
        <ToggleRow
          key={item.key}
          title={item.title}
          description={item.description}
          value={consent[item.key]}
          onChange={(value) => updateConsent({ [item.key]: value })}
        />
      ))}
      <PrimaryButton
        label="Clear temporary chat"
        icon="delete-sweep"
        variant="secondary"
        onPress={() =>
          Alert.alert('Clear chat?', 'The current in-memory conversation will be removed.', [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Clear',
              style: 'destructive',
              onPress: () => {
                clearChat();
                Alert.alert('Chat cleared');
              },
            },
          ])
        }
      />
      <PrimaryButton
        label="Reset all local app data"
        icon="restart-alt"
        variant="ghost"
        onPress={() =>
          Alert.alert(
            'Reset local data?',
            'This removes preferences, consent, trusted contacts, and the current session.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Reset',
                style: 'destructive',
                onPress: () =>
                  void resetLocalData().then(() => router.replace('/consent')),
              },
            ]
          )
        }
      />
    </>
  );
}

function NotificationSettings() {
  const {
    preferences,
    updatePreferences,
    notificationStatus,
    setNotificationStatus,
  } = useGuardian();
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    const status = await getNotificationPermissionStatus();
    setNotificationStatus(status);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const request = async () => {
    setBusy(true);
    const allowed = await ensureNotificationPermission();
    setNotificationStatus(allowed ? 'granted' : 'denied');
    if (!allowed) {
      Alert.alert(
        'Notifications are off',
        'You can enable them from the device settings.'
      );
    }
    setBusy(false);
  };

  const test = async () => {
    setBusy(true);
    const allowed = await ensureNotificationPermission();
    setNotificationStatus(allowed ? 'granted' : 'denied');
    if (allowed) {
      await sendWellbeingNotification();
      Alert.alert('Test sent', 'Tap the notification to open the check-in.');
    }
    setBusy(false);
  };

  return (
    <>
      <ToggleRow
        title="Wellbeing notifications"
        description="Allow neutral local check-in reminders. Lock-screen text contains no drug or biometric details."
        value={preferences.wellbeingNotifications}
        onChange={(wellbeingNotifications) =>
          updatePreferences({ wellbeingNotifications })
        }
      />
      <BentoCard>
        <Text style={styles.title}>Device permission</Text>
        <Text style={styles.status}>
          {notificationStatus === 'granted'
            ? 'Allowed'
            : notificationStatus === 'denied'
              ? 'Denied'
              : 'Not requested'}
        </Text>
        {notificationStatus !== 'granted' && (
          <PrimaryButton
            label="Request permission"
            icon="notifications-active"
            onPress={() => void request()}
            loading={busy}
            style={styles.buttonTop}
          />
        )}
      </BentoCard>
      <PrimaryButton
        label="Send a test check-in"
        icon="notification-add"
        onPress={() => void test()}
        disabled={!preferences.wellbeingNotifications}
        loading={busy}
      />
      <PrimaryButton
        label="Open device settings"
        icon="settings"
        variant="secondary"
        onPress={() => void Linking.openSettings()}
      />
    </>
  );
}

function AboutSettings() {
  const version = Constants.expoConfig?.version ?? '0.1.0';
  return (
    <>
      <BentoCard style={styles.aboutHero}>
        <MaterialIcons name="health-and-safety" size={52} color={COLORS.primary} />
        <Text style={styles.aboutTitle}>Guardian Angel</Text>
        <Text style={styles.body}>Version {version} · Hackathon prototype</Text>
      </BentoCard>
      <BentoCard>
        <Text style={styles.title}>What this prototype does</Text>
        <Text style={styles.body}>
          It offers private support tools, a local AI conversation, and
          explainable anomaly checks over simulated wearable readings.
        </Text>
      </BentoCard>
      <BentoCard>
        <Text style={styles.title}>Important limitation</Text>
        <Text style={styles.body}>
          Guardian Angel does not diagnose stress, cravings, relapse, or drug
          use. It is not a replacement for emergency or clinical care.
        </Text>
      </BentoCard>
      <BentoCard>
        <Text style={styles.title}>Privacy</Text>
        <Text style={styles.body}>
          Conversations and check-ins stay temporary. Prototype chatbot
          messages travel over local Wi-Fi to the team laptop for processing
          and are not intentionally stored.
        </Text>
      </BentoCard>
    </>
  );
}

export default function SettingsScreen() {
  const { section } = useLocalSearchParams<{ section: string }>();
  const titles: Record<string, string> = {
    preferences: 'Preferences',
    privacy: 'Privacy & Security',
    notifications: 'Notifications',
    about: 'About',
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <PageHeader title={titles[section] ?? 'Settings'} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scroll}
      >
        {section === 'preferences' && <PreferencesSettings />}
        {section === 'privacy' && <PrivacySettings />}
        {section === 'notifications' && <NotificationSettings />}
        {section === 'about' && <AboutSettings />}
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
  toggleCard: { minHeight: 98, flexDirection: 'row', alignItems: 'center', gap: 12 },
  toggleText: { flex: 1 },
  title: { ...TYPE.titleSm, color: COLORS.onSurface },
  body: { ...TYPE.bodyMd, color: COLORS.onSurfaceVariant, marginTop: 4 },
  input: {
    ...TYPE.bodyMd,
    color: COLORS.onSurface,
    minHeight: 50,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    backgroundColor: COLORS.surfaceLow,
    paddingHorizontal: 14,
    marginTop: 12,
  },
  buttonTop: { marginTop: 12 },
  info: {
    flexDirection: 'row',
    gap: 9,
    padding: 14,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.tertiaryTint,
  },
  infoText: { ...TYPE.labelMd, color: COLORS.onSurfaceVariant, flex: 1 },
  status: {
    ...TYPE.headlineMd,
    color: COLORS.secondary,
    textTransform: 'capitalize',
    marginTop: 5,
  },
  aboutHero: { alignItems: 'center', paddingVertical: 28 },
  aboutTitle: { ...TYPE.headlineLg, color: COLORS.primary, marginTop: 8 },
});
