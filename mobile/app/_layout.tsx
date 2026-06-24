import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="consent" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="assessment" options={{ animationEnabled: true }} />
      <Stack.Screen name="check-in" options={{ animationEnabled: true }} />
    </Stack>
  );
}
