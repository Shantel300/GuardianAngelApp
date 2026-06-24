import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function SplashScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f9fc' }}>
      <Text style={{ fontSize: 32, fontWeight: '700', color: '#b52330', marginBottom: 20 }}>
        Guardian Angel
      </Text>
      <Text style={{ fontSize: 16, color: '#5a403f', marginBottom: 40, textAlign: 'center', paddingHorizontal: 20 }}>
        Private support when you need it
      </Text>

      <Link href="/onboarding" asChild>
        <Text style={{ fontSize: 16, color: '#ff5a5f', fontWeight: '600', marginTop: 20 }}>
          Get Started
        </Text>
      </Link>

      <Link href="/auth/login" asChild>
        <Text style={{ fontSize: 14, color: '#0060ac', marginTop: 30 }}>
          I already have an account
        </Text>
      </Link>
    </View>
  );
}
