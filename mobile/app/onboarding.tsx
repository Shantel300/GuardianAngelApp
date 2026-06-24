import { View, Text, ScrollView } from 'react-native';
import { Link } from 'expo-router';

export default function OnboardingScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f7f9fc' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 40 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#191c1e', marginBottom: 20 }}>
          Private youth and recovery support
        </Text>
        <Text style={{ fontSize: 16, color: '#5a403f', textAlign: 'center', marginBottom: 40 }}>
          Guardian Angel is your confidential companion for early intervention and wellbeing.
        </Text>

        <View style={{
          backgroundColor: '#fff',
          padding: 20,
          borderRadius: 16,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#191c1e', marginBottom: 10 }}>
            ✅ Private
          </Text>
          <Text style={{ fontSize: 14, color: '#5a403f' }}>
            Your conversations are never saved or shared without your consent.
          </Text>
        </View>

        <View style={{
          backgroundColor: '#fff',
          padding: 20,
          borderRadius: 16,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#191c1e', marginBottom: 10 }}>
            🤖 AI-Assisted
          </Text>
          <Text style={{ fontSize: 14, color: '#5a403f' }}>
            Smart analysis to identify support signals and recommend resources.
          </Text>
        </View>

        <View style={{
          backgroundColor: '#fff',
          padding: 20,
          borderRadius: 16,
          marginBottom: 40,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#191c1e', marginBottom: 10 }}>
            📱 Always With You
          </Text>
          <Text style={{ fontSize: 14, color: '#5a403f' }}>
            Optional wearable monitoring and trusted contact alerts.
          </Text>
        </View>

        <Link href="/consent" asChild>
          <View style={{
            backgroundColor: '#ff5a5f',
            paddingVertical: 16,
            paddingHorizontal: 40,
            borderRadius: 50,
            alignSelf: 'center',
            marginBottom: 20
          }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
              Next
            </Text>
          </View>
        </Link>

        <Link href="/" asChild>
          <Text style={{ fontSize: 14, color: '#0060ac', fontWeight: '500' }}>
            Skip for now
          </Text>
        </Link>
      </View>
    </ScrollView>
  );
}
