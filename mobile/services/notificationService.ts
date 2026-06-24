import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const CHANNEL_ID = 'wellbeing-check-ins';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function ensureNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Wellbeing check-ins',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 200, 150, 200],
      lightColor: '#ff5a5f',
    });
  }

  const existing = await Notifications.getPermissionsAsync();
  if (existing.status === 'granted') return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.status === 'granted';
}

export async function sendWellbeingNotification(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Guardian Angel check-in',
      body: 'Your wellbeing signals have changed. Would you like to check in?',
      data: { url: '/check-in' },
    },
    trigger: null,
  });
}

export async function getNotificationPermissionStatus(): Promise<
  'granted' | 'denied' | 'unknown'
> {
  const permission = await Notifications.getPermissionsAsync();
  if (permission.status === 'granted') return 'granted';
  if (permission.status === 'denied') return 'denied';
  return 'unknown';
}
