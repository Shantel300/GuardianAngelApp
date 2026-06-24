import { useEffect, useState } from 'react';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { COLORS } from '../constants/theme';
import { GuardianProvider } from '../context/GuardianContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  // Safety net: never block the UI on font loading for more than 2s.
  // If fonts are slow/unavailable the app still renders with system fonts
  // rather than getting stuck on a blank splash screen.
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const ready = fontsLoaded || !!fontError || timedOut;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready]);

  useEffect(() => {
    const redirect = (response: Notifications.NotificationResponse | null) => {
      const url = response?.notification.request.content.data?.url;
      if (typeof url === 'string' && url.startsWith('/')) {
        router.push(url as never);
        void Notifications.clearLastNotificationResponseAsync();
      }
    };

    redirect(Notifications.getLastNotificationResponse());
    const subscription =
      Notifications.addNotificationResponseReceivedListener(redirect);
    return () => subscription.remove();
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <GuardianProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="consent" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="assessment" options={{ presentation: 'card' }} />
        <Stack.Screen name="check-in" options={{ presentation: 'card' }} />
        <Stack.Screen name="sos" options={{ presentation: 'card' }} />
        <Stack.Screen name="trusted-contacts" options={{ presentation: 'card' }} />
        <Stack.Screen name="referral" options={{ presentation: 'card' }} />
        <Stack.Screen name="support-tool/[tool]" options={{ presentation: 'card' }} />
        <Stack.Screen name="settings/[section]" options={{ presentation: 'card' }} />
      </Stack>
    </GuardianProvider>
  );
}
